#!/usr/bin/env python3
"""État du projet Pages t-konate : domaine, dernier déploiement, domaines custom."""
import json
import os
import sys
import urllib.error
import urllib.request

API = "https://api.cloudflare.com/client/v4"
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
ACCT = os.environ.get("ACCOUNT_ID", "")
PROJECT = os.environ.get("PROJECT", "t-konate")
if not TOKEN:
    sys.exit("CLOUDFLARE_API_TOKEN absent")


def call(path):
    req = urllib.request.Request(API + path)
    req.add_header("Authorization", "Bearer " + TOKEN)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        try:
            return json.loads(body)
        except json.JSONDecodeError:
            return {"success": False, "errors": [{"message": f"HTTP {e.code}: {body[:200]}"}]}


if not ACCT:
    a = call("/accounts")
    ACCT = a["result"][0]["id"] if a.get("success") and a.get("result") else sys.exit("compte introuvable")

p = call(f"/accounts/{ACCT}/pages/projects/{PROJECT}")
if not p.get("success"):
    print("projet:", json.dumps(p.get("errors"), ensure_ascii=False))
    sys.exit(1)
r = p["result"]
print("projet:", r.get("name"), "| sous-domaine:", r.get("subdomain"))
print("branche de prod:", r.get("production_branch"))
print("build_config:", json.dumps(r.get("build_config"), ensure_ascii=False))
print("deployment_configs.production.env_vars:",
      list(((r.get("deployment_configs") or {}).get("production") or {}).get("env_vars") or {}))
print("source:", json.dumps(((r.get("source") or {}).get("config") or {}).get("repo_name"), ensure_ascii=False))

d = call(f"/accounts/{ACCT}/pages/projects/{PROJECT}/deployments?per_page=3")
if d.get("success"):
    for dep in d["result"]:
        stage = (dep.get("latest_stage") or {})
        print(f"  deploy {dep.get('short_id')} | env={dep.get('environment')} | "
              f"stage={stage.get('name')}:{stage.get('status')} | url={dep.get('url')} | commit={((dep.get('deployment_trigger') or {}).get('metadata') or {}).get('commit_hash','')[:7]}")
else:
    print("deployments:", d.get("errors"))

doms = call(f"/accounts/{ACCT}/pages/projects/{PROJECT}/domains")
print("custom domains:", [x.get("name") for x in (doms.get("result") or [])] if doms.get("success") else doms.get("errors"))
