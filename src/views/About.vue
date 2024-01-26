<template>
  <div>
    <h1>Connexion</h1>
    <form v-if="!showForgotPasswordForm" @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Se connecter</button>
      <a @click="showForgotPassword">Mot de passe oublié ?</a>
    </form>

    <form v-if="showForgotPasswordForm" @submit.prevent="forgotPassword">
      <div class="form-group">
        <label for="forgotEmail">Email:</label>
        <input type="email" id="forgotEmail" v-model="forgotEmail" required />
      </div>
      <button type="submit">Réinitialiser le mot de passe</button>
      <a @click="hideForgotPassword">Retour à la connexion</a>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      showForgotPasswordForm: false,
      forgotEmail: '',
    };
  },
  methods: {
    login() {
      // Logique de connexion ici
      console.log('Simuler la demande de connexion avec les informations suivantes:');
      console.log('Email:', this.email);
      console.log('Mot de passe:', this.password);

      // Réponse de simulation
      const responseData = {
        success: true, // Indiquer si la connexion a réussi ou échoué
        message: 'Connexion réussie',
        // Vous pouvez également inclure d'autres informations de l'utilisateur ici
      };

      console.log('Réponse de l\'API (simulation) :', responseData);

      // Ajoutez le traitement de la réponse ici (par exemple, rediriger l'utilisateur si la connexion a réussi)
    },
    showForgotPassword() {
      this.showForgotPasswordForm = true;
    },
    hideForgotPassword() {
      this.showForgotPasswordForm = false;
    },
    forgotPassword() {
      // Logique de réinitialisation du mot de passe ici
      console.log('Simuler la demande de réinitialisation du mot de passe avec les informations suivantes:');
      console.log('Email:', this.forgotEmail);

      // Réponse de simulation
      const responseData = {
        success: true, // Indiquer si la réinitialisation a réussi ou échoué
        message: 'Réinitialisation du mot de passe réussie',
        // Vous pouvez également inclure d'autres informations ici
      };

      console.log('Réponse de l\'API (simulation) :', responseData);

      // Ajoutez le traitement de la réponse ici (par exemple, afficher un message à l'utilisateur)
    },
  },
};
</script>

<style>
  /* Ajoutez vos styles ici si nécessaire */

  .login-form,
  .forgot-password-form {
    max-width: 300px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-top: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  button {
    display: block;
    width: 100%;
    padding: 10px;
    font-size: 14px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }

  .forgot-password-link,
  .return-to-login-link {
    display: block;
    text-align: center;
    margin-top: 10px;
    color: #007bff;
    cursor: pointer;
  }

  .forgot-password-link:hover,
  .return-to-login-link:hover {
    text-decoration: underline;
  }
</style>

