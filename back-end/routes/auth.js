const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Inscription
router.post('/register', async (req, res) => {
  console.log("Requête reçue :", req.body); // Pour déboguer

  const { name, email, password, role } = req.body;

  // Vérification des champs requis
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  try {
    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = await User.create({
      nom: name,
      email,
      motDePasse: hashedPassword,
      role
    });

    res.json({ message: 'Utilisateur créé', user });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs requis
  if (!email || !password) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.motDePasse);
    if (!isMatch) return res.status(401).json({ error: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Connexion réussie', token, user });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

module.exports = router;
