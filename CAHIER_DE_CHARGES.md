# Cahier des charges - Projet Evenflow

## 1. Présentation
Evenflow est une plateforme web innovante dédiée à la gestion d’événements et à la billetterie digitale. Elle permet aux organisateurs de créer, personnaliser et piloter leurs événements en ligne, tout en offrant aux participants une expérience d’achat de tickets fluide, sécurisée et interactive. Grâce à Evenflow, chaque événement devient plus accessible, plus moderne et plus transparent.

## 2. Fonctionnalités principales
### Organisateur
- Création d’événements (titre, description, image, date, lieu, catégories)
- Ajout et gestion dynamique de types de tickets (prix, quantité, bénéfices, image)
- Modification des événements jusqu’à la date de début
- Suivi des ventes, statistiques et tickets scannés
- Scan des tickets via QR code (mobile ou desktop)
- Tableau de bord intuitif et personnalisé
- Export des historiques de scan et ventes

### Utilisateur
- Navigation sur un catalogue d’événements riche et filtrable
- Achat de tickets (gratuits ou payants) en quelques clics
- Paiement en ligne sécurisé (FedaPay, autres moyens)
- Visualisation et gestion des tickets achetés
- Validation des tickets à l’entrée (QR code)
- Création de compte, connexion et gestion du profil

### Général
- Page d’accueil dynamique et attractive
- Newsletter et communication ciblée
- Footer et navigation unifiée sur toutes les pages
- Gestion intelligente des images (par défaut si manquante)
- Sécurité renforcée pour les données et les clés

## 3. Architecture technique
- Frontend : React, Vite, Context API, Framer Motion, Lucide Icons
- Backend : Node.js, Express, Prisma, PostgreSQL
- Paiement : FedaPay (clé publique côté front, clé privée côté back)
- Déploiement : Vercel (front), Railway (back)

## 4. Sécurité
- Clés privées jamais exposées côté front
- Fichier .env ignoré dans le versionnement
- Validation des paiements côté serveur
- Protection des données utilisateurs

## 5. UX/UI
- Interface moderne, responsive et accessible
- Boutons magnétiques, transitions animées, effets visuels
- Affichage d’images partout (par défaut si manquante)
- Navigation claire, rapide et intuitive

## 6. Tests et validation
- Vérification du fonctionnement front/back
- Test des scénarios d’achat, scan, gestion d’événements
- Validation du paiement (FedaPay)
- Scénarios de tickets gratuits et payants

## 7. Déploiement
- Instructions détaillées pour lancer le projet en local et en ligne
- Configuration des variables d’environnement
- Guide pour tester et déployer sur Vercel/Railway

---

**Ce document sert de référence pour le développement, la validation et l’évolution du projet Evenflow. Il garantit une vision claire, structurée et ambitieuse pour tous les acteurs du projet.**
