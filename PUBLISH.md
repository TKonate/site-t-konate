# Publier t-konate.dev

Le build est prêt : `site-t-konate-dist.zip` (21 pages, ~520 Ko décompressé).
Aucun secret dans le paquet, aucun fichier de développement.

## Option A — Cloudflare Pages, envoi direct (aucun outil, 3 minutes)

1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** →
   **Upload assets**.
2. Nom du projet : `t-konate`.
3. Glisser `site-t-konate-dist.zip` (ou le dossier `dist/` décompressé).
4. **Deploy**. Le site est en ligne sur `t-konate.pages.dev`.
5. **Custom domains** → ajouter `t-konate.dev` et `www.t-konate.dev` →
   Cloudflare crée l'enregistrement DNS.

⚠️ Avant l'étape 5, vérifier que les sous-domaines du homelab (`vault.`, `n8n.`,
`beszel.`, `hermes.`) pointent toujours vers le tunnel : le domaine racine change
de cible, pas eux. Si un sous-domaine casse, c'est un incident DNS à signaler à Admin.

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
| `CONTACT_TO` | `tiberio.konatepro@gmail.com` |
| `CONTACT_FROM` | `site@t-konate.dev` (domaine à vérifier chez Resend) |

Sans ces variables, le site fonctionne : le formulaire bascule sur un lien mailto.

## Boucle GitHub ↔ site

Le README de profil est déjà rédigé : `GITHUB-PROFILE.md`.
Le coller dans `TKonate/TKonate/README.md` pour que le profil GitHub renvoie vers
le site (le site renvoie déjà vers GitHub sur les 21 pages).

## Vérifications après publication

```bash
curl -I https://t-konate.dev                      # 200 + HTTPS
curl -s https://t-konate.dev | grep -c "Tibério"  # contenu servi
curl -s https://t-konate.dev/sitemap.xml | grep -c "<url>"   # 21
```
