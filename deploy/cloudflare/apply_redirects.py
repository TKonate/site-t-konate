#!/usr/bin/env python3
"""Applique le ruleset Single Redirect (phase http_request_dynamic_redirect) de t-konate.dev.

Le token est injecté par le magasin appsec, jamais affiché :
  /opt/data/profiles/appsec/bin/appsec-vault run --with CLOUDFLARE_API_TOKEN -- \
      deploy/cloudflare/apply_redirects.py [payload.json]

Sécurité : ne remplace jamais un ruleset existant sans le montrer. Un PUT sur
l'entrypoint écrase TOUTES les règles de la phase — d'où le refus par défaut.
"""
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

API = "https://api.cloudflare.com/client/v4"
ZONE = os.environ.get("ZONE_NAME", "t-konate.dev")
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
PHASE = "http_request_dynamic_redirect"
HERE = Path(__file__).resolve().parent

payload_path = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "redirect-apex-portfolio.json"
force = os.environ.get("MERGE_VALIDATED") == "1"

if not TOKEN:
    sys.exit("CLOUDFLARE_API_TOKEN absent — lancer via appsec-vault run --with CLOUDFLARE_API_TOKEN -- ...")


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


payload = json.loads(payload_path.read_text())
rules = payload["rules"]
for r in rules:
    if not r.get("expression") or not r.get("action"):
        sys.exit(f"règle incomplète dans {payload_path.name}: {r}")

zone = call(f"/zones?name={ZONE}")
if not zone.get("success") or not zone.get("result"):
    sys.exit(f"zone {ZONE} introuvable / token sans Zone:Read — {zone.get('errors')}")
zone_id = zone["result"][0]["id"]
print(f"zone {ZONE} = {zone_id}")

current = call(f"/zones/{zone_id}/rulesets/phases/{PHASE}/entrypoint")
existing = (current.get("result") or {}).get("rules") or []
print(f"ruleset existant: {current.get('result', {}).get('id') if current.get('success') else 'aucun'} "
      f"| règles en place: {len(existing)}")
if existing:
    print("PUT écraserait ces règles :", file=sys.stderr)
    for r in existing:
        print(f"  - {r.get('description')!r} enabled={r.get('enabled')} id={r.get('id')}", file=sys.stderr)
    if not force:
        sys.exit("refus: fusionner à la main, puis relancer avec MERGE_VALIDATED=1")

# L'entrypoint ne prend que la liste de règles : envoyer name/description en plus
# fait échouer l'API sur les champs inconnus.
resp = call(f"/zones/{zone_id}/rulesets/phases/{PHASE}/entrypoint", "PUT", {"rules": rules})
if not resp.get("success"):
    sys.exit(f"échec PUT: {json.dumps(resp.get('errors'), ensure_ascii=False)}")

res = resp["result"]
print(f"OK — ruleset {res.get('id')} version {res.get('version')}")
for r in res.get("rules", []):
    print(f"  · {r.get('description')} | enabled={r.get('enabled')} | {r.get('action')} "
          f"| statut={((r.get('action_parameters') or {}).get('from_value') or {}).get('status_code')}")
print("vérifier: deploy/cloudflare/verify-routes.sh")
