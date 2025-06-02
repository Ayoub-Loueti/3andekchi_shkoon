const Client = require('../models/clientModel');
const bcrypt = require('bcryptjs');

exports.loginUser = async (req, res) => {
  const { mail, password } = req.body;

  const client = await Client.findOne({ mail });

  if (client && (await bcrypt.compare(password, client.password))) {
    res.json({
      _id: client._id,
      nom: client.nom,
      prenom: client.prenom,
      mail: client.mail,
    });
  } else {
    res.status(400).json({ message: 'client existe pas' });
  }
};

exports.signupUser = async (req, res) => {
  const { nom, prenom, mail, numero, rate, password } = req.body;

  const userExists = await Client.findOne({ mail });

  if (userExists) {
    res.status(400).json({ message: 'user existe deja' });
    return; 
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const client = await Client.create({
    nom,
    prenom,
    mail,
    numero,
    rate,
    password: hashedPassword,
  });

  if (client) {
    res.status(201).json({
      _id: client._id,
      nom: client.nom,
      prenom: client.prenom,
      mail: client.mail,
      numero: client.numero,
      rate: client.rate,
    });
  } else {
    res.status(400).json({ message: 'invalide user' });
  }
};

module.exports = exports;
