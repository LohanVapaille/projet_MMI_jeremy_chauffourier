# Mini Discord

Mini Discord est une application web de communication inspirée des plateformes de discussion en ligne. Elle permet aux utilisateurs de créer un compte, de se connecter, de créer des salons et d'échanger des messages en temps réel.

## Fonctionnalités

- Inscription, connexion et déconnexion des utilisateurs.
- Validation des formulaires avec VineJS.
- Création et consultation de salons de discussion.
- Affichage de l'historique des messages d'un salon.
- Envoi de messages dans un salon.
- Réception des nouveaux messages en temps réel sans rechargement de la page.
- Interface React avec sidebar des salons et zone de chat.
- Affichage des messages personnels à droite et des messages des autres utilisateurs à gauche.
- Base de données SQLite avec relations entre utilisateurs, salons et messages.

## Technologies utilisées

- AdonisJS 7
- TypeScript
- Lucid ORM
- SQLite avec Better SQLite3
- React
- Inertia.js
- VineJS
- AdonisJS Transmit et `@adonisjs/transmit-client`
- Vite

## Installation

### Prérequis

- Node.js 24 ou une version supérieure.
- npm.

### Installer le projet

```bash
git clone <URL_DU_DEPOT>
cd projet_MMI_jeremy_chauffourier
npm install
```

Créer le fichier d'environnement local à partir de l'exemple :

```bash
copy .env.example .env
```

Sous macOS ou Linux, utiliser :

```bash
cp .env.example .env
```

Générer ensuite la clé de chiffrement de l'application :

```bash
node ace generate:key
```

## Base de données

La base utilisée est une base SQLite située dans `tmp/db.sqlite3`.

Exécuter les migrations avec :

```bash
node ace migration:run
```

Les principales tables sont :

- `users` : comptes utilisateurs gérés par l'authentification AdonisJS ;
- `channels` : salons avec leur nom et leur description ;
- `messages` : messages associés à un utilisateur et à un salon.

Les relations Lucid sont les suivantes :

- un utilisateur possède plusieurs messages ;
- un salon possède plusieurs messages ;
- un message appartient à un utilisateur ;
- un message appartient à un salon.

## Lancer l'application

Pour lancer le serveur en développement avec le rechargement automatique :

```bash
npm run dev
```

L'application est ensuite accessible à l'adresse indiquée par AdonisJS, généralement :

```text
http://localhost:3333
```

Commandes utiles :

```bash
npm run typecheck
npm run lint
npm run build
npm test
```

## Organisation du projet

- `app/controllers/` : logique des salons et des messages ;
- `app/models/` : modèles Lucid et relations avec la base de données ;
- `app/validators/` : validation VineJS des données reçues ;
- `database/migrations/` : création et évolution des tables SQLite ;
- `inertia/pages/` : pages React rendues avec Inertia.js ;
- `start/routes.ts` : routes de l'application ;
- `start/transmit.ts` : autorisation des canaux temps réel ;
- `inertia/css/app.css` : styles de l'interface.

## Routes principales

| Méthode | Route                           | Rôle                                                |
| ------- | ------------------------------- | --------------------------------------------------- |
| `GET`   | `/login`                        | Afficher la page de connexion                       |
| `POST`  | `/login`                        | Connecter un utilisateur                            |
| `GET`   | `/signup`                       | Afficher la page d'inscription                      |
| `POST`  | `/signup`                       | Créer un compte                                     |
| `GET`   | `/dashboard`                    | Afficher les salons et le premier salon sélectionné |
| `GET`   | `/channels/:id`                 | Afficher un salon et ses messages                   |
| `POST`  | `/channels`                     | Créer un salon                                      |
| `POST`  | `/channels/:channelId/messages` | Envoyer un message                                  |
| `POST`  | `/logout`                       | Déconnecter l'utilisateur                           |

## Fonctionnement du temps réel

Lorsqu'un utilisateur envoie un message, le `MessageController` :

1. vérifie que le salon existe ;
2. valide le contenu avec VineJS ;
3. enregistre le message dans SQLite ;
4. charge les informations de l'auteur ;
5. diffuse le message avec Transmit.

Chaque salon possède un canal dédié :

```text
channels/{channelId}/messages
```

La page React s'abonne au canal du salon sélectionné avec `@adonisjs/transmit-client`. Lorsqu'un événement est reçu, le nouveau message est ajouté à l'état de la page sans recharger le navigateur.

## Utilisation de l'intelligence artificielle

J'ai utilisé GitHub Copilot avec le SDK Copilot dans VS Code pour m'accompagner pendant le développement.

L'IA m'a aidé à :

- structurer les migrations, les modèles et leurs relations ;
- créer les contrôleurs, les routes et les validateurs ;
- comprendre et intégrer AdonisJS Transmit ;
- développer l'interface React et améliorer sa mise en page ;
- repérer et corriger des erreurs de typage et de linting.

J'ai vérifié les propositions générées en les adaptant à la structure du projet, puis en exécutant les migrations, le typage, le lint et le build. Cette utilisation m'a permis d'avancer plus rapidement, mais j'ai du comprendre le rôle de chaque fichier et de chaque fonctionnalité pour pouvoir expliquer le projet.

## Améliorations possibles

- Modifier ou supprimer un message.
- Ajouter des messages privés.
- Ajouter des rôles et des permissions.
- Ajouter des notifications.
- Ajouter l'envoi de fichiers ou d'images.
- Ajouter une recherche dans les salons et les messages.
