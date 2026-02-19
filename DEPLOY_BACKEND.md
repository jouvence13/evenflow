# Déploiement du backend Evenflow sur Railway

## 1. Prérequis
- Compte Railway (https://railway.app)
- Code backend prêt (Node.js, Express, Prisma, etc.)
- Accès à une base de données (ex : PostgreSQL)

## 2. Étapes de déploiement

### a. Créer un projet Railway
1. Connecte-toi sur https://railway.app
2. Clique sur "New Project" puis "Deploy from GitHub" ou "Start from Scratch"
3. Si tu utilises GitHub, connecte ton dépôt backend
4. Sinon, upload le dossier backend

### b. Configurer la base de données
1. Dans Railway, clique sur "Add Plugin" > "PostgreSQL" (ou autre DB)
2. Copie l’URL de la base (ex : `postgresql://user:password@host:port/database`)

### c. Ajouter les variables d’environnement
1. Va dans l’onglet "Variables"
2. Ajoute :
   - `DATABASE_URL` = URL de la base
   - `PORT` = 3000 (ou autre)

### d. Configurer Prisma (si utilisé)
1. Dans le terminal Railway, lance :
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

### e. Lancer le backend
1. Railway détecte automatiquement le type de projet (Node.js)
2. Le serveur démarre (npm run dev ou npm start)
3. L’URL publique du backend s’affiche (ex : `https://evenflow-backend.up.railway.app`)

### f. Tester l’API
- Accède à l’URL Railway dans le navigateur ou via Postman
- Exemple : `https://evenflow-backend.up.railway.app/api/events`

### g. Connecter le frontend
- Dans le frontend (Vercel), configure l’URL de l’API avec l’URL Railway
- Ajoute la variable d’environnement :
  - `VITE_API_URL` = URL Railway

## 3. Résolution de problèmes
- Vérifie les logs Railway (onglet "Deployments")
- Assure-toi que la base de données est accessible
- Les variables d’environnement doivent être correctes
- Si Prisma ne fonctionne pas, vérifie le schéma et les migrations

---

**Contacte-moi si tu veux un exemple de code ou une configuration spécifique !**
