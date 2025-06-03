const signUpConfirmationEmailTemplate = (nom, prenom ,  idUtil, resetPasswordToken,API_ENDPOINT,) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Confirmation de votre inscription</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
  }
  .email-container {
    max-width: 560px;
    margin: auto;
    background: #ffffff;
    padding: 20px;
    text-align: center;
    border: 1px solid #ddd; /* Less pronounced frame */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05); /* Lighter shadow for a subtler effect */
  }
  .logo {
    margin-bottom: 20px;
  }
  .content {
    color: #333;
    line-height: 1.6;
  }
  .confirmation-link {
    display: inline-block;
    margin-top: 20px;
    color: #0084B4; /* Ooredoo brand color for the link */
    text-decoration: underline;
    font-weight: bold;
  }
</style>
</head>
<body>
<div class="email-container">
  <div class="logo">
    <img src="https://cdnfr.africanmanager.com/wp-content/uploads/2023/07/oored.jpg" alt="Ooredoo Logo" width="120">
  </div>
  <div class="content">
    <h1>Bonjour,</h1>
    <p>Merci pour votre inscription. Pour activer votre compte, veuillez cliquer sur le lien suivant :</p>
    <a href="${API_ENDPOINT}/activate-account/${idUtil}/${resetPasswordToken}" class="confirmation-link">Je confirme que je souhaite activer mon compte</a>
    <p>Si vous n'avez pas demandé cette activation, veuillez ignorer cet e-mail.</p>
    <p>Cordialement,</p>
    <p>L'équipe Ooredoo</p>
  </div>
</div>
</body>
</html>
`;

const forgotPasswordEmailTemplate = (nom, email,API_ENDPOINT, token) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Réinitialisation de votre mot de passe</title>
<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px;
    border: 1px solid #ddd; /* Less pronounced frame */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
    text-align: center;
  }
  h1 {
    color: #333; /* Consistent with signUpConfirmationEmailTemplate */
  }
  p {
    color: #333;
    line-height: 1.6;
  }
  a {
    color: #ff6600; /* Consistent with signUpConfirmationEmailTemplate */
    text-decoration: none;
    font-weight: bold;
  }
</style>
</head>
<body>
<div class="container">
  <img src="https://cdnfr.africanmanager.com/wp-content/uploads/2023/07/oored.jpg" alt="Ooredoo Logo" style="width: 120px; margin: 20px 0;">
  <h1>Bonjour ${nom},</h1>
  <p>Vous avez récemment fait une demande de réinitialisation du mot de passe de votre compte : ${email}</p>
  <p>Votre code de réinitialisation est : <strong>${token}</strong></p>
  <p>Utilisez ce code pour commencer le processus de réinitialisation.</p>
  <p>Si vous n'avez pas demandé à réinitialiser votre mot de passe, veuillez ignorer cet email ou nous prévenir.</p>
  <p>Cordialement.</p>
  <p>Email from Club 22</p>
</div>
</body>
</html>
`;

const resetPasswordConfirmationEmailTemplate = (nom) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Confirmation de réinitialisation de votre mot de passe</title>
<style>
  body {
    font-family: Arial, sans-serif; /* Updated for consistency */
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
  }
  .email-container {
    max-width: 560px;
    margin: auto;
    background: #ffffff;
    padding: 20px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .logo {
    margin-bottom: 20px;
  }
  .content {
    color: #333;
    line-height: 1.6;
  }
  .confirmation-link {
    color: #0084B4; /* Keeping the link color consistent with the signup template */
    text-decoration: underline;
    font-weight: bold;
  }
</style>
</head>
<body>
<div class="email-container">
  <div class="logo">
    <img src="https://cdnfr.africanmanager.com/wp-content/uploads/2023/07/oored.jpg" alt="Ooredoo Logo" width="120">
  </div>
  <div class="content">
    <h1>Bonjour ${nom},</h1>
    <p>Votre mot de passe a été réinitialisé avec succès.</p>
    <p>Si vous n'avez pas effectué cette demande de réinitialisation, veuillez contacter immédiatement notre support client.</p>
    <p>Merci de votre confiance.</p>
    <p>Cordialement,</p>
    <p>L'équipe Ooredoo</p>
  </div>
</div>
</body>
</html>
`;

const loginSuccessEmailTemplate = (nom, prenom) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Confirmation de réinitialisation de votre mot de passe</title>
<style>
  body {
    font-family: Arial, sans-serif; /* Updated for consistency */
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
  }
  .email-container {
    max-width: 560px;
    margin: auto;
    background: #ffffff;
    padding: 20px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .logo {
    margin-bottom: 20px;
  }
  .content {
    color: #333;
    line-height: 1.6;
  }
  .confirmation-link {
    color: #0084B4; /* Keeping the link color consistent with the signup template */
    text-decoration: underline;
    font-weight: bold;
  }
</style>
</head>
<body>
<div class="email-container">
  <div class="logo">
    <img src="https://cdnfr.africanmanager.com/wp-content/uploads/2023/07/oored.jpg" alt="Ooredoo Logo" width="120">
  </div>
  <div class="content">
    <h1>Bonjour ${nom} ${prenom},</h1>
    <p>Vous vous êtes connecté(e) à votre compte avec succès.</p>
    <p>Merci de votre confiance.</p>
    <p>Cordialement,</p>
    <p>L'équipe Ooredoo</p>
  </div>
</div>
</body>
</html>
`;


module.exports = {
  signUpConfirmationEmailTemplate,
  forgotPasswordEmailTemplate,
  resetPasswordConfirmationEmailTemplate,
  loginSuccessEmailTemplate,
};
