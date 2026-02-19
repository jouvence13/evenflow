# Déployer le backend Evenflow sur Railway via GitHub

## 1. Prérequis
- Compte Railway (https://railway.app)
- Compte GitHub
- Le dossier backend est dans ton projet et pushé sur GitHub

## 2. Étapes de déploiement

### a. Préparer le dépôt GitHub
1. Assure-toi que le dossier backend est bien dans ton projet
2. Push le projet sur GitHub (avec le backend)

### b. Créer un projet Railway depuis GitHub
1. Connecte-toi sur https://railway.app
2. Clique sur "New Project"
3. Choisis "Deploy from GitHub"
4. Autorise Railway à accéder à ton compte GitHub
5. Sélectionne le dépôt contenant le backend
6. Choisis le dossier backend comme racine du projet (Railway te propose de choisir le dossier)

### c. Configurer les variables d’environnement
1. Va dans l’onglet "Variables" du projet Railway
2. Ajoute :
   - `DATABASE_URL` = URL de ta base
   - `PORT` = 3000 (ou autre)

### d. Lancer le déploiement
1. Railway détecte le backend (Node.js)
2. Le serveur démarre automatiquement (npm run dev ou npm start)
3. L’URL publique du backend s’affiche (ex : `https://evenflow-backend.up.railway.app`)

### e. Tester l’API
- Accède à l’URL Railway dans le navigateur ou via Postman
- Exemple : `https://evenflow-backend.up.railway.app/api/events`

### f. Connecter le frontend
- Dans le frontend (Vercel), configure l’URL de l’API avec l’URL Railway
- Ajoute la variable d’environnement :
  - `VITE_API_URL` = URL Railway

## 3. Conseils
- Si le backend est dans un sous-dossier, Railway te permet de choisir ce dossier lors de l’import
- Les logs Railway sont accessibles pour débug
- Les variables d’environnement doivent être correctes

---

**Contacte-moi si tu veux un exemple de structure de projet ou un fichier .env !**
