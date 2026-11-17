#!/usr/bin/env python3
"""Sonde read-only de l'API Cloudflare : token, zone, ruleset de redirection existant.
N'affiche jamais le token. Écrit dans le dépôt (pas de jq : absent de l'image)."""
import json
import os
import sys
import urllib.error
import urllib.request

API = "https://api.cloudflare.com/client/v4"
ZONE = os.environ.get("ZONE_NAME", "t-konate.dev")
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")

if not TOKEN:
    sys.exit("CLOUDFLARE_API_TOKEN absent (lancer via appsec-vault run --with ...)")


def call(path, method="GET", payload=None):
    req = urllib.request.Request(API + path, method=method)
    req.add_header("Authorization", "Bearer " + TOKEN)
    req.add_header("Content-Type", "application/json")
    data = None
    if payload is not None:
        data = json.dumps(payload).encode()
    try:
        with urllib.request.urlopen(req, data, timeout=30) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        try:
            return json.loads(body)
        except json.JSONDecodeError:
            return {"success": False, "errors": [{"message": f"HTTP {e.code}: {body[:300]}"}]}


print("token longueur:", len(TOKEN))
v = call("/user/tokens/verify")
print("verify (/user/* — échoue normalement sur un token scopé zone):",
      json.dumps({"success": v.get("success"),
                  "status": (v.get("result") or {}).get("status"),
                  "expires_on": (v.get("result") or {}).get("expires_on"),
                  "errors": v.get("errors")}, ensure_ascii=False))

z = call(f"/zones?name={ZONE}")
zones = [(r.get("id"), r.get("name"), r.get("status")) for r in (z.get("result") or [])]
print("zones:", zones, "errors:", z.get("errors"))
if not zones:
    sys.exit(1)

zone_id = zones[0][0]
r = call(f"/zones/{zone_id}/rulesets/phases/http_request_dynamic_redirect/entrypoint")
print("phase GET success:", r.get("success"), "| errors:", json.dumps(r.get("errors"), ensure_ascii=False))
result = r.get("result") or {}
rules = result.get("rules") or []
print("ruleset id:", result.get("id"), "| version:", result.get("version"))
print("règles existantes:", len(rules))
for rule in rules:
    print(json.dumps({k: rule.get(k) for k in ("id", "description", "action", "enabled", "expression")},
                     ensure_ascii=False, indent=2))
