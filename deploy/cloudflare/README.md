# Redirections Cloudflare — `t-konate.dev`

Applique la décision **D16** (vault : `10 - Projects/Site Web - Vitrine/Decisions.md`).
L'apex reste servi par le tunnel ; le site vit sur `www.t-konate.dev`. Une *Single
Redirect* (phase `http_request_dynamic_redirect`, exécutée avant l'ingress du tunnel)
envoie les chemins du site vers `www` et laisse passer les chemins de services.

## Fichiers

- `redirect-apex-portfolio.json` — règle A, payload complet prêt pour l'API.
- `redirect-polaris.TEMPLATE.json` — règle B (Polaris) : modèle **non déployé**.
  À remplir (`TARGET_HOST`) et activer seulement quand Polaris est en ligne.
- `apply_redirects.py` — résout la zone, refuse d'écraser un ruleset existant, applique.
- `cf_probe.py` — sonde read-only : validité du token, zone, règles déjà en place.
- `verify-routes.sh` — sonde les 11 routes exclues + les chemins du site ; échoue si
  une route de service est redirigée vers `www`.

⚠️ `jq` n'est pas installé dans l'image Hermes : tout le parsing API passe par
`python3`/`urllib` (stdlib). Ne pas réintroduire de `curl | jq`.

## Chemins exclus (mesurés le 2026-11-16, pas copiés d'une doc)

| Préfixe | Ce qu'il sert | État mesuré avant règle |
|---|---|---|
| `/vault` | Vaultwarden | 200 text/html |
| `/beszel` | Beszel | 200 text/html |
| `/hermes` | Hermes dashboard | 302 → /login |
| `/n8n` | n8n | 502 (service down, indépendant) |
| `/webhook`, `/webhook-test`, `/rest`, `/api` | intégrations n8n / API | placeholder 200 |
| `/.well-known` | chemins de validation | placeholder 200 |

Les quatre derniers renvoient aujourd'hui la page placeholder nginx : ils ne cassent
rien de vivant, mais un webhook ou un callback redirigé en 301 casse silencieusement
une intégration. Exclus par précaution.

## Usage

```bash
# 1. token déposé hors chat dans /opt/data/secrets-appsec/inbox, puis :
/opt/data/profiles/appsec/bin/appsec-vault import-inbox
# 2. sonder l'état (read-only), puis appliquer — le token ne vit que dans l'env de l'enfant
/opt/data/profiles/appsec/bin/appsec-vault run --with CLOUDFLARE_API_TOKEN -- \
  deploy/cloudflare/cf_probe.py
/opt/data/profiles/appsec/bin/appsec-vault run --with CLOUDFLARE_API_TOKEN -- \
  deploy/cloudflare/apply_redirects.py
# 3. vérifier : aucune route de service ne doit rediriger
deploy/cloudflare/verify-routes.sh
```

Portée du token : `Zone:Read` + `Zone:Rulesets:Edit` sur la zone `t-konate.dev`, rien
d'autre. Pas de `Zone:Edit` (aurait droit de modifier le DNS et donc les services).

## Ordre : 302 d'abord, 301 ensuite

Le payload applique **302**. Une fois `verify-routes.sh` au vert et quelques jours de
trafic réel sans incident, passer `status_code` à `301` (un 301 est mémorisé par le
navigateur : une erreur devient difficile à corriger pour les visiteurs déjà passés).

## Rollback

```bash
# supprimer la règle (ruleset vide)
curl -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE/rulesets/phases/http_request_dynamic_redirect/entrypoint" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H 'content-type: application/json' \
  --data '{"rules":[]}'
```
L'apex retrouve immédiatement son placeholder tunnel ; aucun DNS n'a bougé.
