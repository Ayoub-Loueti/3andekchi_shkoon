const { OAuth2Client } = require('google-auth-library');
const Utilisateur = require('../models/clientModel'); // Assuming your user model is here
const jwt = require('jsonwebtoken'); // For generating JWTs
const bcrypt = require('bcryptjs'); // For password hashing (even though Google handles auth, we might store a hash)

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await Utilisateur.findOne({ mail: email });

    if (!user) {
      // If user doesn't exist, create a new one
      const randomPassword = Math.random().toString(36).slice(-8); // Generate a random password
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await Utilisateur.create({
        nom: name,
        mail: email,
        password: hashedPassword, // Store a hashed random password
        // You might want to add other fields here based on your Utilisateur model
        avatar: picture,
        isGoogleUser: true, // A flag to indicate it's a Google-registered user
      });
    } else {
      // If user exists, update their Google flag if necessary
      if (!user.isGoogleUser) {
        user.isGoogleUser = true;
        await user.save();
      }
    }

    // Generate JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.nom,
        email: user.mail,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
}; 