const Utilisateur = require('../models/clientModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { mail, password, remember } = req.body;

  const client = await Utilisateur.findOne({ mail });

  if (client && (await bcrypt.compare(password, client.password))) {
    const token = jwt.sign(
      { id: client._id },
      process.env.JWT_KEY,
      { expiresIn: remember ? '30d' : '48h' }
    );

    res.json({
      _id: client._id,
      nom: client.nom,
      prenom: client.prenom,
      mail: client.mail,
      token: token,
    });
  } else {
    res.status(400).json({ message: 'client existe pas' });
  }
};

exports.signupUser = async (req, res) => {
  const { nom, prenom, mail, numero,  password, location } = req.body;

  const userExists = await Utilisateur.findOne({ mail });

  if (userExists) {
    res.status(400).json({ message: 'user existe deja' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Array of default avatars
  const defaultAvatars = [
    '/uploads/avatarFemme1.png',
    '/uploads/avatarHomme1.png',
    '/uploads/avatarHomme2.png',
  ];

  // Pick a random avatar
  const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

  const client = await Utilisateur.create({
    nom,
    prenom,
    mail,
    numero,
    location,
    password: hashedPassword,
    avatar: randomAvatar, // Assign the random default avatar
  });

  if (client) {
    res.status(201).json({
      _id: client._id,
      nom: client.nom,
      prenom: client.prenom,
      mail: client.mail,
      numero: client.numero,
      location: client.location,
      avatar: client.avatar, // Include the assigned avatar in the response
    });
  } else {
    res.status(400).json({ message: 'invalide user' });
  }
};

const FROM_EMAIL = process.env.MAILER_EMAIL_ID;
const AUTH_PASSWORD = process.env.MAILER_PASSWORD;

const API_ENDPOINT =
  process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_API_URL
    : process.env.DEVELOPMENT_API_URL;

const smtpTransport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    user: FROM_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

const {
  signUpConfirmationEmailTemplate,
  forgotPasswordEmailTemplate,
  resetPasswordConfirmationEmailTemplate,
} = require('../template/userAccountEmailTemplates');

exports.forgotPassword = async (req, res) => {
  try {
    const user = await Utilisateur.findOne({ mail: req.body.mail });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
/*
    if (user.etat !== 'autorise') {
      return res.status(403).json({ message: 'Votre compte doit être autorisé pour réinitialiser le mot de passe.' });
    }

    if (!user.password || user.password.trim() === '') {
      return res.status(400).json({ message: 'Les utilisateurs qui se sont inscrits via Google doivent utiliser la réinitialisation de mot de passe de Google.' });
    }
*/
    console.log(user);
    const token = Math.floor(1000 + Math.random() * 9000);

    await Utilisateur.findOneAndUpdate(
      { _id: user._id },
      {
        resetPasswordToken: token,
        resetPasswordExpires: new Date(Date.now() + 3600000),
      }
    );

    const template = forgotPasswordEmailTemplate(user.nom, user.mail, API_ENDPOINT, token);

    const data = {
      from: FROM_EMAIL,
      to: user.mail,
      subject: 'Réinitialisation de votre mot de passe',
      html: template,
    };

    await smtpTransport.sendMail(data);

    return res.json({
      message: "Veuillez vérifier votre e-mail pour plus d'instructions",
    });
  } catch (error) {
    console.error('Erreur dans forgotPassword:', error);
    return res.status(500).json({ message: error.message });
  }
};

exports.checkResetToken = async (req, res) => {
  try {
    const { resetPasswordToken } = req.body;

    const user = await Utilisateur.findOne({
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        isValid: false,
        message: 'Password reset token is invalid or has expired.',
      });
    }

    return res.json({ isValid: true });
  } catch (error) {
    console.error('Erreur dans checkResetToken:', error);
    return res.status(500).json({ isValid: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await Utilisateur.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({
        message: 'Password reset token is invalid or has expired.',
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password.newPassword, 10);

    await Utilisateur.findOneAndUpdate(
      { _id: user._id },
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      }
    );

    const template = resetPasswordConfirmationEmailTemplate(user.nom);
    const data = {
      to: user.mail,
      from: FROM_EMAIL,
      subject: 'Confirmation de réinitialisation du mot de passe',
      html: template,
    };

    await smtpTransport.sendMail(data);

    return res.json({ message: 'Réinitialisation du mot de passe réussie' });
  } catch (error) {
    console.error('Erreur dans resetPassword:', error);
    return res.status(500).json({ message: error.message });
  }
};

exports.resendForgotPasswordEmail = async (req, res) => {
  const { mail } = req.params;

  try {
    const user = await Utilisateur.findOne({mail: mail });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const token = Math.floor(1000 + Math.random() * 9000);

    await Utilisateur.update({
      resetPasswordToken: token,
      resetPasswordExpires: new Date(Date.now() + 3600000),
    }, {
      where: { _id: user._id }
    });

    const template = forgotPasswordEmailTemplate(user.nom, user.mail, API_ENDPOINT, token);
    const data = {
      from: FROM_EMAIL,
      to: user.mail,
      subject: 'Réinitialisation de votre mot de passe - Renvoi',
      html: template,
    };

    await smtpTransport.sendMail(data);

    return res.json({
      message: "E-mail de réinitialisation du mot de passe renvoyé avec succès. Veuillez vérifier votre e-mail pour plus d'instructions",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ isArchived: false }); // 👈 Ne récupérer que les non archivés

    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: 'Aucun client trouvé.' });
    }

    const clientList = clients.map(client => ({
      _id: client._id,
      nom: client.nom,
      prenom: client.prenom,
      mail: client.mail,
      numero: client.numero,
      rate: client.rate,
      isBlocked: client.isBlocked
    }));

    res.status(200).json(clientList);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
exports.archiveClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client non trouvé.' });

    client.isArchived = true;
    await client.save();

    res.status(200).json({ message: 'Client archivé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.unarchiveClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client non trouvé.' });

    client.isArchived = false;
    await client.save();

    res.status(200).json({ message: 'Client désarchivé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
exports.blockClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé.' });
    }

    client.isBlocked = true;
    await client.save();

    res.status(200).json({ message: 'Client bloqué avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.unblockClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé.' });
    }

    client.isBlocked = false;
    await client.save();

    res.status(200).json({ message: 'Client débloqué avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
exports.updateClient = async (req, res) => {
  try {
    console.log('PUT /users/clients/:id - Body:', req.body);
    console.log('Client ID:', req.params.id);

    const client = await Utilisateur.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!client) {
      return res.status(404).json({ message: 'Client not found.' });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error('❌ Error in updateClient:', error.message);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Ancien et nouveau mot de passe requis.' });
    }

    const user = await Utilisateur.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('❌ Erreur dans updatePassword:', error.message);
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await Utilisateur.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      mail: user.mail,
      numero: user.numero,
      location: user.location,
      avatar: user.avatar,
      rate: user.rate,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error in getUserInfo:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = exports;