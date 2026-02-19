import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const ALLOWED_ROLES = ['BUYER', 'ORGANIZER'];

const signToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const toPublicUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  createdAt: user.createdAt
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nom, email et mot de passe sont obligatoires.' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedRole = String(role || 'BUYER').toUpperCase();

    if (!ALLOWED_ROLES.includes(normalizedRole)) {
      return res.status(400).json({ message: 'Rôle invalide. Utilisez BUYER ou ORGANIZER.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash,
        role: normalizedRole
      }
    });

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: toPublicUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe sont obligatoires.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const token = signToken(user);

    return res.status(200).json({
      token,
      user: toPublicUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    return res.status(200).json({ user: toPublicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

export default router;
