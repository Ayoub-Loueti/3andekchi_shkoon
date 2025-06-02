const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  mail: {
    type: String,
    required: true,
    unique: true 
  },
  numero: {
    type: String, 
  },
  rate: {
    type: Number,
    default: 0 
  },
  password: {
    type: String,
    required: true 
  },
}, {
  timestamps: true 
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
