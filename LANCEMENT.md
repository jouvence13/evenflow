# Guide de lancement du projet Evenflow

## 1. Prérequis
- Node.js installé (version 16+)
- npm ou yarn
- Accès à la base de données (ex : PostgreSQL)

## 2. Lancer le Frontend

### a. Installation
1. Ouvre un terminal dans le dossier du projet (ex : `site web/Evenflow`).
2. Installe les dépendances :
   ```bash
   npm install
   ```

### b. Démarrage
1. Lance le serveur front :
   ```bash
   npm run dev
   ```
2. Accède à l’application sur [http://localhost:5173](http://localhost:5173)

## 3. Lancer le Backend

### a. Installation
1. Va dans le dossier backend :
   ```bash
   cd backend
   ```
2. Installe les dépendances :
   ```bash
   npm install
   ```

### b. Configuration
1. Crée un fichier `.env` dans le dossier backend avec :
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   PORT=3000
   ```
2. (Optionnel) Configure Prisma :
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

### c. Démarrage
1. Lance le serveur backend :
   ```bash
   npm run dev
   ```
2. Le backend sera accessible sur [http://localhost:3000](http://localhost:3000)

## 4. Connexion Front/Back
- Vérifie que l’URL du backend est bien configurée dans le front (ex : dans `src/api/axios.js`).
- Pour un usage local : `http://localhost:3000`

## 5. Résolution de problèmes
- Si une erreur apparaît, vérifie les logs du terminal.
- Assure-toi que la base de données est accessible.
- Les variables d’environnement doivent être correctes.

---

**Contacte-moi si tu veux un guide pour le déploiement sur Railway ou Render !**
