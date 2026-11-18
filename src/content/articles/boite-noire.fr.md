---
title: "Ce qui s'est passé, et comment je le sais"
lead: "Construire une boîte noire sur son infrastructure : quatre couches de traçabilité, le refus de l'audit global, et un déploiement qui annonçait un succès sans avoir rien configuré."
date: 2026-11-18
lang: fr
slug: boite-noire
translation: black-box
readingTime: "8 min"
---

Quand un service tombe, la question n'est jamais « est-ce que ça a planté ? ». La
question est « qu'est-ce qui s'est passé juste avant ? ». Et la réponse la plus
fréquente, quand on n'a rien prévu, c'est : on ne sait pas.

Cet article raconte comment j'ai construit une boîte noire sur mon infrastructure pour
arrêter de répondre ça.

## Le paradoxe de départ

En novembre, j'ai voulu savoir pourquoi une de mes machines avait disparu du réseau
pendant une semaine. Journal système vide. Aucune trace. Rien à lire.

Le paradoxe est là : **le journal existait**, mais uniquement en mémoire. Il disparaît
exactement au moment où on en a besoin, au redémarrage. J'avais une boîte noire qui
s'effaçait en cas d'accident.

Le second problème est plus insidieux : aucune traçabilité des actions privilégiées. Un
`sudo` laisse une trace dans le shell, pas dans un fichier qu'on peut relire trois
semaines plus tard.

## Quatre couches, une par question

Je n'ai pas cherché une solution unique. J'ai découpé le problème en quatre questions,
et donné à chacune sa couche.

**« Qu'est-ce que le système a dit ? »** Le journal systemd, rendu persistant. Sans ça,
rien d'autre n'est exploitable : chaque machine écrit ses logs dans `/var/log/journal`
avec un plafond de 500 Mo et une rétention de 30 jours. Le plafond compte. Sans lui, un
service bavard remplit le disque et provoque la panne qu'on cherchait à diagnostiquer.

**« Qui a touché à quoi, avec privilèges ? »** Avec auditd, et ses 16 règles. C'est la
décision de conception la plus importante du projet, et j'y reviens plus bas.

**« Qu'a-t-on tapé ? »** L'historique bash horodaté, écrit immédiatement à chaque
prompt. Une commande tapée trente secondes avant un crash ne doit pas disparaître avec
la session.

**« À quoi ressemblait la machine juste avant ? »** Un instantané toutes les cinq
minutes : charge, mémoire, top CPU, disque, services en échec, état des conteneurs.
C'est ce qui répond encore quand le journal est corrompu.

## La décision qui compte : pas d'`execve` global

La réaction naturelle, quand on veut tracer les commandes, c'est d'auditer tous les
`execve`, chaque processus lancé, sans exception. C'est ce que j'ai écarté, pour deux
raisons.

Le volume d'abord : des dizaines de milliers d'entrées par jour sur une machine modeste,
pour une information noyée.

La **fuite de secrets** ensuite, et c'est la vraie raison. auditd enregistre les
arguments des commandes (`argc`, `a0` à `a3`). Un audit global écrit donc en clair tout
ce qui passe en ligne de commande : un mot de passe après `-S`, un jeton, une URL de
base de données. **Une boîte noire qui fuit des identifiants est pire qu'une absence de
boîte noire**, parce qu'elle concentre en un seul fichier tout ce qu'on avait
éparpillé.

J'ai donc ciblé les fichiers et binaires sensibles plutôt que les processus : identités
(`/etc/passwd`, `/etc/shadow`), privilèges (`sudoers`), réseau (`/etc/hosts`,
configuration SSH), montages, chargement de modules noyau, services systemd, tâches
planifiées, et l'exécution de `sudo` et `su`. Seize règles, chacune justifiable.

Cette limite a un coût assumé : un mot de passe passé en argument à `sudo` apparaît tout
de même, parce que la règle sur `admin_exec` enregistre les premiers arguments. Ce n'est
pas zéro-fuite, c'est une réduction du périmètre.

Il y a une deuxième limite, structurelle : ces 16 règles sont une photo de ce qu'on sait
surveiller aujourd'hui. Elles viennent d'une liste écrite à la main. Le jour où un
fichier sensible apparaît ailleurs, il n'est surveillé par personne. Un audit n'est
jamais plus exhaustif que la liste dont il dérive.

## L'outil : une question, une commande

Un outil de diagnostic n'a de valeur que s'il est utilisable à froid, quand on est déjà
stressé et que quelque chose est cassé. J'ai donc regroupé la consultation derrière une
seule commande, `boite-noire`, avec sept entrées.

La plus importante est celle que je n'avais jamais eue : `crash`. Elle lit
`journalctl -b -1`, c'est-à-dire **la fin de la session précédente**, pas le démarrage
courant, qui ne contient rien d'intéressant après un redémarrage.

Les autres répondent à une question précise : les dernières commandes par utilisateur,
les actions privilégiées, les services en échec, les changements réseau et DNS, une vue
d'ensemble, et un export daté pour sortir les données de la machine.

## Ce que ça a effectivement changé

Une machine avait disparu du réseau pendant une semaine. Sans boîte noire, la conclusion
naturelle aurait été « elle a planté, il faut réinstaller ».

Le journal persistant a rouvert le démarrage précédent. La fin de cette session montrait
un arrêt **propre**, avec les services qui se terminent dans l'ordre. Pas de panne, pas
de crash : une coupure d'alimentation, et un arrêt normal du système avant l'extinction.
La machine est revenue au premier redémarrage, aucun composant n'était en cause.

Sans trace, j'aurais réinstallé un système sain et cherché une cause inexistante. C'est
la différence entre une intuition et un fait.

## Le déploiement qui annonçait un succès

La partie la plus utile de ce projet est un échec, et il vaut la peine d'être raconté.

Le script d'installation enchaîne cinq étapes : configurer journald, installer auditd,
écrire les règles, poser l'historique bash, créer le minuteur des instantanés. À la fin,
il affiche un résumé et lance la commande d'affichage. Sur deux machines, ça a marché du
premier coup.

Sur la troisième, celle qui héberge l'agent qui pilote tout le reste, je l'ai lancé
depuis un conteneur. Le script a déroulé ses cinq étapes, affiché son résumé, et rendu
la main sans erreur. **Il n'avait rien configuré.**

La raison est simple une fois qu'on la voit : dans un conteneur, `systemctl`,
`journalctl` et `auditctl` n'existent pas. Le script les appelait avec une redirection
d'erreur vers `/dev/null`, ce qui masquait chaque échec. Il annonçait donc une
installation complète sur une machine où il n'avait pas écrit une ligne.

Ce que ça m'a appris vaut plus que les quatre couches réunies : **un script qui continue
après un échec masqué ne produit pas une installation partielle, il produit une fausse
information.** J'ai rendu l'installation bavarde à l'endroit qui compte : elle détecte
maintenant qu'elle tourne dans un conteneur et refuse de continuer avant d'avoir touché
au système.

```
❌ Cible = conteneur (pid 1 : s6-svscan)
   journald persistant, auditd et timers systemd n'existent pas ici.
   Rien n'a été modifié.
```

Un déploiement qui échoue franchement coûte cinq minutes. Un déploiement qui réussit
sans rien faire coûte des mois, parce qu'on croit être couvert.

## Ce qui n'est pas couvert aujourd'hui

À la date de cet article, la boîte noire est déployée et vérifiée sur deux machines, avec
des volumes mesurés. La troisième, celle qui héberge l'agent central, ne l'est pas
encore : c'est exactement l'incident raconté ci-dessus, et il n'est pas refermé.

Je préfère l'écrire plutôt que de laisser un schéma suggérer une couverture complète.
C'est la prochaine étape, et elle a une contrainte que les deux autres n'avaient pas :
elle doit être installée sur l'hôte, pas depuis le conteneur où je vis.

## Les limites assumées

- **Pas de centralisation.** Chaque machine garde sa boîte noire localement. Si une
  machine meurt pour de bon, sa boîte meurt avec elle. L'export manuel permet de
  rapatrier les données, ce n'est pas automatique.
- **Rétention à 30 jours**, et plafond de 500 Mo : au-delà, la rotation se fait sur la
  taille et non sur l'âge.
- **Aucune alerte.** C'est un dispositif passif : il raconte, il ne prévient pas. Une
  analyse planifiée qui cherche des motifs suspects serait l'étape suivante.
- **Dépendance à systemd.** L'installation suppose systemd, journald et auditd. Ce n'est
  pas un défaut en soi, mais ça exclut les cibles conteneurisées, ce qui est précisément
  le cas de la machine manquante.

## Ce que j'en retire

La leçon technique est mince, et je l'assume : lire `journalctl -b -1` n'est pas
sorcier. Ce qui a demandé du travail, c'est de refuser l'audit global pour ne pas
fabriquer une fuite d'identifiants, et de rendre le diagnostic utilisable en une commande
quand tout est déjà en train de casser.

La leçon plus générale : **une panne non documentée se paie deux fois**, une fois quand
elle arrive et une fois quand on cherche pourquoi. La boîte noire ne m'a pas rendu mon
infrastructure plus fiable. Elle m'a rendu mes pannes lisibles.
