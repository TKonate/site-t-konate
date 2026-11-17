# Publier t-konate.dev

Le build est prêt : `site-t-konate-dist.zip` (21 pages, ~520 Ko décompressé).
Aucun secret dans le paquet, aucun fichier de développement.

## Option A — Cloudflare Pages, envoi direct (aucun outil, 3 minutes)

1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** →
   **Upload assets**.
2. Nom du projet : `t-konate`.
3. Le dépôt vit **dans le conteneur** : récupérer l'archive sur l'hôte d'abord,
   puis la glisser dans le navigateur.
   ```bash
   docker cp hermes:/opt/data/projects/site-t-konate/site-t-konate-dist.zip ~/
   ```
   (régénérée le 2026-11-17 : 21 pages, 520 Ko décompressé, 117 Ko en zip)
4. **Deploy**. Le site est en ligne sur `t-konate.pages.dev`.
5. **Custom domains** → ajouter **`www.t-konate.dev` uniquement** → Cloudflare crée
   l'enregistrement DNS.

⛔ **Ne jamais ajouter `t-konate.dev` (l'apex) comme custom domain.** L'apex est
servi par le tunnel et porte les services en préfixes de chemins : un hébergeur
statique ne connaît que ses propres pages et renverrait 404 sur `/vault/`,
`/beszel/`, `/hermes/`, `/n8n/`. Voir la décision D15/D16 du vault. L'apex mène au
site par une *règle de redirection* scopée, pas par une bascule DNS
(`deploy/cloudflare/`).

## Option B — GitHub + déploiement automatique (recommandé ensuite)

Le dépôt local est prêt (commits `369e9e8` → `b6b5b6c`, branche `main`).

```bash
# 1. créer le dépôt vide TKonate/site-t-konate sur GitHub (sans README ni licence)
cd /opt/data/projects/site-t-konate
git remote add origin https://github.com/TKonate/site-t-konate.git
git branch -M main
git push -u origin main
```

Puis dans Cloudflare Pages : **Connect to Git** → sélectionner le dépôt →
build command `npm run build`, output `dist`. Chaque `git push` redéploie.

Variables d'environnement à ajouter (Settings → Environment variables) pour le
formulaire de contact :

| Nom | Valeur |
|---|---|
| `RESEND_API_KEY` | clé créée sur resend.com |
| `CONTACT_TO` | `contact@t-konate.dev` |
| `CONTACT_FROM` | `site@t-konate.dev` (domaine à vérifier chez Resend) |

Sans ces variables, le site fonctionne : le formulaire bascule sur un lien mailto.

## Boucle GitHub ↔ site

Le README de profil est déjà rédigé : `GITHUB-PROFILE.md`.
Le coller dans `TKonate/TKonate/README.md` pour que le profil GitHub renvoie vers
le site (le site renvoie déjà vers GitHub sur les 21 pages).

## Vérifications après publication

```bash
curl -I https://www.t-konate.dev                       # 200 + HTTPS
curl -s https://www.t-konate.dev | grep -c "Tibério"   # contenu servi
curl -s https://www.t-konate.dev/sitemap.xml | grep -c "<url>"   # 21
curl -sI https://t-konate.dev/ | grep -i location      # 302 -> www (règle A)
curl -s -o /dev/null -w '%{http_code}\n' https://t-konate.dev/vault/   # 200, non redirigé
```
