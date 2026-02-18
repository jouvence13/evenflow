# Evenflow Frontend

Application frontend de billetterie événementielle construite avec React, Vite et Tailwind CSS.

## Stack technique

- React 18
- Vite 5
- React Router DOM 6
- Tailwind CSS 3
- Framer Motion

## Prérequis

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
```

## Lancer le projet en local

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
```

## Routage actuel

- `/` : accueil
- `/events` : listing des événements
- `/events/:id` : détail d’un événement
- `/login` : connexion
- `/register` : inscription

## Authentification (mode mock)

Le projet utilise actuellement une authentification simulée via `AuthContext` avec persistance locale :

- utilisateur stocké dans `localStorage` sous la clé `evenflow_user`
- fonctions exposées : `login`, `register`, `logout`
- redirection automatique après connexion/inscription vers la page d’accueil

## Notes de développement

- Les pages d’authentification (`/login`, `/register`) sont fonctionnelles côté frontend.
- Le backend/API d’auth réel n’est pas encore branché.
- Le design repose sur des classes utilitaires Tailwind + quelques classes globales définies dans `src/styles/globals.css`.

## Build vérifié

Le build de production a été validé avec succès via :

```bash
npm run build
```
