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
  genre: {
    type: String,
    enum: ['homme', 'femme'],
  },
  rate: {
    type: Number,
    default: 0 
  },
  location: {
    type: String,
  },
  password: {
    type: String,
    required: true 
  },
  resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
      defaultValue: null,
    },
    isBlocked: { 
    type: Boolean, 
    default: false 
},
  isArchived: { 
    type: Boolean, 
    default: false 
},
  avatar: {
    type: String,
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true 
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
