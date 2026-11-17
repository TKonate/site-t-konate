#!/usr/bin/env python3
"""Active Cloudflare Email Routing pour contact@t-konate.dev -> boîte perso.

Idempotent : relit l'état avant chaque écriture. Le token ne doit jamais être affiché.
  appsec-vault run --with CLOUDFLARE_API_TOKEN -- python3 cf_email_routing.py
"""
import json
import os
import sys
import urllib.error
import urllib.request

API = "https://api.cloudflare.com/client/v4"
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
ZONE = os.environ.get("ZONE_ID", "1dd716048f2dcc5ddbaa287fc8d4cafe")
PUBLIC = os.environ.get("PUBLIC_ADDRESS", "contact@t-konate.dev")
DEST = os.environ.get("DEST_ADDRESS", "tiberio.konatepro@gmail.com")
if not TOKEN:
    sys.exit("CLOUDFLARE_API_TOKEN absent")


def call(path, method="GET", payload=None):
    req = urllib.request.Request(API + path, method=method)
    req.add_header("Authorization", "Bearer " + TOKEN)
    req.add_header("Content-Type", "application/json")
    data = json.dumps(payload).encode() if payload is not None else None
    try:
        with urllib.request.urlopen(req, data, timeout=30) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        try:
            return json.loads(body)
        except json.JSONDecodeError:
            return {"success": False, "errors": [{"message": f"HTTP {e.code}: {body[:300]}"}]}


def show(label, r, extra=None):
    out = {"success": r.get("success")}
    if r.get("errors"):
        out["errors"] = r["errors"]
    if extra:
        out.update(extra)
    print(label, json.dumps(out, ensure_ascii=False))
    return r.get("success")


# 1. état du routing
st = call(f"/zones/{ZONE}/email/routing")
cur = st.get("result") or {}
print("routing:", json.dumps({"enabled": cur.get("enabled"), "status": cur.get("status"),
                              "name": cur.get("name")}, ensure_ascii=False))

# 2. destinations existantes
dests = call(f"/zones/{ZONE}/email/routing/addresses")
print("destinations:", [(d.get("email"), d.get("verified")) for d in (dests.get("result") or [])])

# 3. créer la destination (déclenche le mail de vérification vers la boîte perso)
if not any(d.get("email", "").lower() == DEST.lower() for d in (dests.get("result") or [])):
    r = call(f"/zones/{ZONE}/email/routing/addresses", "POST", {"email": DEST})
    ok = (r.get("result") or {}).get("email")
    show("destination créée:", r, {"email": ok, "verified": (r.get("result") or {}).get("verified")})
else:
    print("destination déjà déclarée")

# 4. DNS : MX + SPF (active le service)
# /email/routing/dns renvoie une LISTE d'enregistrements (pas un objet {enabled}).
dns = call(f"/zones/{ZONE}/email/routing/dns")
if dns.get("success") and dns.get("result"):
    print("DNS routing déjà en place:", len(dns["result"]), "enregistrement(s)")
else:
    r = call(f"/zones/{ZONE}/email/routing/dns", "POST")
    show("DNS routing activé:", r, {"records": len(r.get("result") or []) if isinstance(r.get("result"), list) else r.get("result")})

# 5. règle : contact@ -> forward
rules = call(f"/zones/{ZONE}/email/routing/rules")
existing = [r for r in (rules.get("result") or [])
            if any(m.get("value", "").lower() == PUBLIC.lower() for m in (r.get("matchers") or []))]
if existing:
    print("règle déjà présente:", existing[0].get("tag"), "enabled=", existing[0].get("enabled"))
else:
    r = call(f"/zones/{ZONE}/email/routing/rules", "POST", {
        "name": f"{PUBLIC} -> boîte perso",
        "enabled": True,
        "matchers": [{"type": "literal", "field": "to", "value": PUBLIC}],
        "actions": [{"type": "forward", "value": [DEST]}],
    })
    show("règle créée:", r, {"tag": (r.get("result") or {}).get("tag"),
                             "enabled": (r.get("result") or {}).get("enabled")})

# 6. relecture
final_d = call(f"/zones/{ZONE}/email/routing/addresses")
print("état final destinations:", [(d.get("email"), d.get("verified")) for d in (final_d.get("result") or [])])
