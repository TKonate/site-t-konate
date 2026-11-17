#!/usr/bin/env python3
"""Sonde Pages : comptes visibles par le token, projets Pages existants, et faisabilité
d'une création de projet connecté à GitHub. Read-only sauf avec --create-git.

Usage :
  appsec-vault run --with CLOUDFLARE_API_TOKEN -- python3 cf_pages_probe.py
"""
import json
import os
import sys
import urllib.error
import urllib.request

API = "https://api.cloudflare.com/client/v4"
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
REPO = os.environ.get("REPO", "TKonate/site-t-konate")
PROJECT = os.environ.get("PROJECT", "t-konate")
CREATE = "--create-git" in sys.argv

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


accounts = call("/accounts")
if not accounts.get("success"):
    print("GET /accounts ->", json.dumps(accounts.get("errors"), ensure_ascii=False))
    sys.exit(1)
print("comptes:", [(a["id"], a["name"]) for a in accounts["result"]])
if not accounts["result"]:
    sys.exit("aucun compte visible (token probablement limité à la zone)")

acct = accounts["result"][0]["id"]
projs = call(f"/accounts/{acct}/pages/projects")
if projs.get("success"):
    print("projets Pages:", [(p["name"], p.get("subdomain")) for p in projs["result"]])
else:
    print("GET pages/projects ->", json.dumps(projs.get("errors"), ensure_ascii=False))

if CREATE:
    owner, name = REPO.split("/")
    src = call(f"/accounts/{acct}/pages/projects", "POST", {
        "name": PROJECT,
        "production_branch": "main",
        "source": {
            "type": "github",
            "config": {
                "owner": owner,
                "repo_name": name,
                "production_branch": "main",
                "deployments_enabled": True,
                "production_deployments_enabled": True,
                "preview_deployment_setting": "none",
            },
        },
    })
    print("POST pages/projects ->", json.dumps(
        {"success": src.get("success"),
         "errors": src.get("errors"),
         "project": (src.get("result") or {}).get("name"),
         "subdomain": (src.get("result") or {}).get("subdomain")}, ensure_ascii=False))
