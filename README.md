# Evenflow (Frontend + Backend)

Application de billetterie événementielle avec frontend React et backend Node.js + Prisma.

## Stack technique

- Frontend: React 18, Vite 5, React Router DOM 6, Tailwind CSS 3
- Backend: Express, Prisma, SQLite, JWT, bcrypt

## Prérequis

- Node.js 18+
- npm 9+

## Installation

### 1) Frontend

```bash
npm install
```

### 2) Backend

```bash
cd backend
npm install
copy .env.example .env
npx prisma migrate dev --name init
```

## Lancer le projet en local

### Terminal 1 - API

```bash
cd backend
npm run dev
```

API disponible sur `http://localhost:5000`.

### Terminal 2 - Frontend

```bash
npm run dev
```

Le serveur démarre par défaut sur `http://localhost:5173`.

## Scripts disponibles

- `npm run dev` : lance le serveur de développement
- `npm run build` : génère le build de production dans `dist/`
- `npm run preview` : prévisualise le build de production localement
- `npm run lint` : lance ESLint sur `src`
- `npm run format` : formate les fichiers avec Prettier
- `npm run deploy` : build puis déploiement GitHub Pages (si configuré)

### Backend (`backend/package.json`)

- `npm run dev` : démarre l’API en mode développement
- `npm run start` : démarre l’API en mode production
- `npm run prisma:migrate` : crée/applique une migration Prisma
- `npm run prisma:generate` : génère le Prisma Client
- `npm run prisma:studio` : ouvre Prisma Studio

## Structure principale

```text
src/
	api/                 # Configuration axios
	components/          # UI, layout, sections, features
	constants/           # Constantes globales
	context/             # AuthContext, CartContext
	hooks/               # Hooks personnalisés (ex: useAuth)
	mock-data/           # Données mock
	pages/               # Pages publiques + auth
	services/            # Services applicatifs
	styles/              # Styles globaux Tailwind/CSS
	utils/               # Utilitaires

backend/
	prisma/              # Schéma + migrations Prisma
	src/config/          # Client Prisma
	src/middleware/      # Middleware auth JWT
	src/routes/          # Routes API (auth)
	src/server.js        # Entrée API Express
```

## Routage actuel

- `/` : accueil
- `/events` : listing des événements
- `/events/:id` : détail d’un événement
- `/login` : connexion
- `/register` : inscription

## Authentification (backend Prisma)

Le frontend est branché sur l’API backend :

- `POST /api/auth/register` : création de compte avec rôle `BUYER` ou `ORGANIZER`
- `POST /api/auth/login` : connexion et retour d’un JWT
- `GET /api/auth/me` : profil utilisateur connecté (JWT requis)

Persistance locale côté frontend :

- token JWT stocké sous la clé `token`
- utilisateur stocké sous la clé `evenflow_user`

Après connexion/inscription, les deux rôles sont redirigés vers `/` (même flux pour l’instant).

## Notes de développement

- Les pages `/login` et `/register` sont connectées à l’API backend.
- L’inscription propose le type de compte `Acheteur` ou `Organisateur`.
- Le design repose sur des classes utilitaires Tailwind + quelques classes globales définies dans `src/styles/globals.css`.

## Build vérifié

Le build frontend a été validé via :

```bash
npm run build
```
