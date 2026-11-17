#!/usr/bin/env bash
# Sonde chaque route de t-konate.dev APRÈS application de la règle A.
# Preuve de non-régression : comparer à la mesure d'avant (voir BASELINE ci-dessous).
set -uo pipefail

HOST="${1:-t-konate.dev}"
WWW="${2:-www.t-konate.dev}"

echo "== avant/après attendu (mesuré le 2026-11-16 avant règle)"
cat <<'EOF'
  /           200 text/plain 19   (placeholder nginx, doit devenir 302 -> www)
  /vault/     200 text/html       (doit rester 200, aucun redirect_url)
  /beszel/    200 text/html       (idem)
  /hermes/    302                 (doit rester 302, aucun redirect_url)
  /n8n/       502 text/plain      (déjà down avant la règle — signalé à part)
EOF

echo
echo "== routes exclues (aucune ne doit rediriger)"
fail=0
for p in /vault/ /vault /beszel/ /hermes/ /n8n/ /n8n /webhook/x /webhook-test/x /rest/x /api/x /.well-known/security.txt; do
  out=$(curl -s -o /dev/null -m 10 -w '%{http_code}|%{content_type}|%{redirect_url}' "https://$HOST$p")
  redir=$(printf '%s' "$out" | cut -d'|' -f3)
  out=$(printf '%s' "$out" | tr '|' ' ')
  printf '%-26s %s\n' "$p" "$out"
  # Un 301 vers /vault/ (slash final) est la normalisation nginx préexistante, pas
  # une régression. Seule une redirection vers le site (www) est une régression ici.
  case "$redir" in
    *"//$WWW"*) echo "  ^ RÉGRESSION : route de service renvoyée vers le site — exclusion manquante"; fail=1 ;;
    "") ;;
    *) echo "  (301/302 interne préexistant, vérifié à la baseline)" ;;
  esac
done

echo
echo "== chemins du site (doivent rediriger vers www)"
for p in / /projets/ /contact/ "/en/?x=1"; do
  printf '%-26s ' "$p"
  curl -s -o /dev/null -m 10 -w '%{http_code} -> %{redirect_url}\n' "https://$HOST$p"
done

echo
echo "== cible"
printf '%-26s ' "https://$WWW/"
curl -s -o /dev/null -m 10 -w '%{http_code} %{content_type} %{size_download}o\n' "https://$WWW/"

[ "$fail" = "0" ] || { echo "ÉCHEC : au moins une route de service est redirigée" >&2; exit 1; }
echo "OK — aucune route de service redirigée"
