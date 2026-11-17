#!/usr/bin/env python3
"""Rattache www.t-konate.dev au projet Pages site-t-konate, puis repointe le CNAME.

Ne touche JAMAIS l'apex : il reste sur le tunnel (D15/D16). Séquences :
  1. POST  custom domain www sur le projet Pages
  2. PATCH du seul enregistrement DNS `www` -> site-t-konate.pages.dev (proxied)
Usage: appsec-vault run --with CLOUDFLARE_API_TOKEN -- python3 cf_pages_domain.py
"""
import json
import os
import sys
import urllib.error
import urllib.request

API = "https://api.cloudflare.com/client/v4"
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
ACCT = os.environ.get("ACCOUNT_ID", "830dac1e3323a68b2ec3109f82edc65a")
ZONE = os.environ.get("ZONE_ID", "1dd716048f2dcc5ddbaa287fc8d4cafe")
PROJECT = os.environ.get("PROJECT", "site-t-konate")
HOST = "www.t-konate.dev"
TARGET = f"{PROJECT}.pages.dev"
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


# 1. custom domain
d = call(f"/accounts/{ACCT}/pages/projects/{PROJECT}/domains", "POST", {"name": HOST})
print("POST custom domain:", json.dumps({"success": d.get("success"), "errors": d.get("errors"),
                                         "status": (d.get("result") or {}).get("status")}, ensure_ascii=False))

# 2. CNAME www uniquement
recs = call(f"/zones/{ZONE}/dns_records?name={HOST}")
if not recs.get("success"):
    sys.exit(f"lecture DNS impossible: {recs.get('errors')}")
existing = recs["result"]
if not existing:
    sys.exit(f"aucun enregistrement {HOST} — rien modifié")
rec = existing[0]
print(f"DNS avant: {rec['type']} {rec['name']} -> {rec['content']} proxied={rec['proxied']}")
patch = call(f"/zones/{ZONE}/dns_records/{rec['id']}", "PATCH",
             {"type": "CNAME", "name": HOST, "content": TARGET, "proxied": True, "ttl": 1})
if not patch.get("success"):
    sys.exit(f"PATCH DNS refusé: {patch.get('errors')}")
r = patch["result"]
print(f"DNS après: {r['type']} {r['name']} -> {r['content']} proxied={r['proxied']}")

# garde-fou : l'apex ne doit pas avoir bougé
apex = call(f"/zones/{ZONE}/dns_records?name=t-konate.dev")
apex_rec = (apex.get("result") or [{}])[0]
print(f"apex inchangé: {apex_rec.get('type')} {apex_rec.get('name')} -> {str(apex_rec.get('content'))[:40]}")
