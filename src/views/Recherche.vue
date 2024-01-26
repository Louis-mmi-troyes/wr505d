<template>
  <div>
    <h1>Liste des acteurs</h1>
    <input v-model="searchText" class="form-control" type="text" placeholder="Rechercher par prénom ou nom" />

    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="actors-container">
            <div v-for="actor in paginateActors" :key="actor.id" class="actor-card">
              <div v-if="selectedActorId === actor.id">
                <form @submit.prevent="simulateUpdateActor(actor.id)">
                  <div v-for="(field, index) in Object.keys(selectedActor)" :key="index" class="form-group">
                    <label :for="'editActor' + field">{{ field }} :</label>
                    <select v-if="field === 'movies'" class="form-control" :id="'editActor' + field" v-model="selectedActor[field]">
                      <option value="">Sélectionner un film</option>
                      <option v-for="movie in movieOptions" :key="movie" :value="movie">{{ movie }}</option>
                    </select>
                    
                    <input v-else type="text" class="form-control" :id="'editActor' + field" v-model="selectedActor[field]"
                      :placeholder="'Modifier ' + field" />
                  </div>
                  
                  <button type="submit" class="btn btn-primary">Simuler Modifier</button>
                </form>
                <button @click="simulateDeleteActor" class="btn btn-danger" style="color: black;">Simuler Supprimer</button>
              </div>
              <div v-else>
                <div class="actor-name">{{ actor.firstname }} {{ actor.lastname }}</div>
                <div>
                  <strong>Films:</strong>
                  <ul>
                    <li v-for="movie in actor.movies" :key="movie">{{ movie }}</li>
                  </ul>
                </div>
                <a :href="`/fiche-acteur/${actor.id}`" style="margin-right:25%">Détails</a>
                <a @click="toggleActorDetails(actor.id)">Modifier</a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3" v-if="!selectedActorId">
          <h2 v-if="!addingNewActor">Ajouter un nouvel acteur</h2>
          <form v-if="addingNewActor" @submit.prevent="simulateAddActor">
            <div v-for="field in Object.keys(newActor)" :key="field" class="form-group">
              <label :for="'newActor' + field">{{ field }} :</label>
              <select v-if="field === 'movies'" class="form-control" :id="'newActor' + field" v-model="newActor[field]">
                <option value="">Sélectionner un film</option>
                <option v-for="movie in movieOptions" :key="movie" :value="movie">{{ movie }}</option>
              </select>
              <input v-else type="text" class="form-control" :id="'newActor' + field" v-model="newActor[field]"
                :placeholder="'Nouvel acteur ' + field" />
            </div>
            <button type="submit" class="btn btn-success">Simuler Ajouter</button>
          </form>
          <button v-if="!addingNewActor" @click="startAddingNewActor" class="btn btn-primary">Ajouter acteur</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <nav>
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" @click="changePage(currentPage - 1)" aria-label="Précédent">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
          <a class="page-link" @click="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" @click="changePage(currentPage + 1)" aria-label="Suivant">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Delete Confirmation Popin -->
    <div v-if="showDeleteConfirmation" class="modal">
      <div class="modal-content">
        <p>Êtes-vous sûr de vouloir supprimer cet acteur ?</p>
        <button @click="confirmDelete" class="btn btn-danger">Oui</button>
        <button @click="cancelDelete" class="btn btn-primary">Non</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      actors: [],
      movieOptions: [],
      selectedActorId: null,
      selectedActor: null,
      addingNewActor: false,
      newActor: {
        firstname: '',
        lastname: '',
        movies: [],
      },
      currentPage: 1,
      actorsPerPage: 8,
      showDeleteConfirmation: false,
      searchText: '',
    };
  },
  created() {
    this.getActors();
  },
  methods: {
    toggleActorDetails(actorId) {
      this.selectedActorId = this.selectedActorId === actorId ? null : actorId;
      this.selectedActor = this.actors.find(actor => actor.id === this.selectedActorId);

      if (this.selectedActor) {
        // Créez un objet temporaire pour le formulaire de modification
        this.formData = {
          firstname: this.selectedActor.firstname,
          lastname: this.selectedActor.lastname,
          movies: this.selectedActor.movies.join(', '), // Convert array to string
        };
      } else {
        this.formData = {}; // Réinitialisez l'objet formData
      }
    },

    async getActors() {
      try {
        const response = await axios.get('http://localhost:5173/actor.json');
        this.actors = response.data['hydra:member'].map(actor => ({
          id: actor.id,
          firstname: actor.firstname,
          lastname: actor.lastname,
          movies: actor.movies || [],
          media: actor.media || [],
        }));

        // Appelez la méthode pour mettre à jour la liste des options de film
        this.getMovieOptions();
      } catch (error) {
        console.error('Erreur', error);
      }
    },

    getMovieOptions() {
      const allMovies = this.actors.reduce((movies, actor) => {
        return movies.concat(actor.movies);
      }, []);

      // Utilisez un ensemble pour éliminer les doublons
      const uniqueMovies = [...new Set(allMovies)];

      // Mettez à jour la propriété movieOptions
      this.movieOptions = uniqueMovies;
    },

    simulateUpdateActor(actorId) {
      console.log(`Simuler la mise à jour de l'acteur avec l'ID ${actorId}`);
      console.log(`Données de l'acteur avant la mise à jour :`, this.selectedActor);

      // Créer une copie de l'acteur sélectionné pour éviter les modifications directes
      const selectedActorCopy = { ...this.selectedActor };

      // Traiter spécifiquement le champ "movies" pour éviter le problème avec la virgule
      if (typeof selectedActorCopy.movies === 'string') {
        // Convertir la chaîne en tableau en séparant par la virgule
        selectedActorCopy.movies = selectedActorCopy.movies.split(',').map(movie => movie.trim());
      }

      // Vous pouvez envoyer uniquement les données nécessaires à votre API
      const updatedActorData = {
        '@context': '/public/index.php/api/contexts/Actor',
        '@id': `/public/index.php/api/actors/${selectedActorCopy.id}`,
        '@type': 'Actor',
        ...selectedActorCopy,
      };

      // Afficher la chaîne avec une virgule comme séparateur dans la console
      console.log('Objet de mise à jour envoyé à l\'API:', updatedActorData, `PATCH : ${actorId}`);

      // Simulez la mise à jour de la liste des acteurs (remplacez cette partie par votre appel API réel)
      const existingActor = this.actors.find(actor => actor.id === actorId);
      if (existingActor) {
        // Mettez à jour les données dans la liste des acteurs
        Object.assign(existingActor, selectedActorCopy);

        // Réinitialisez les valeurs
        this.selectedActor = null;
        this.selectedActorId = null;
      }
    },

    simulateDeleteActor() {
      this.showDeleteConfirmation = true;
    },

    confirmDelete() {
      console.log(`Simuler la suppression de l'acteur avec l'ID ${this.selectedActor.id}`);

      // Vérifier si la liste des films existe et n'est pas nulle
      if (this.selectedActor.movies !== null && !this.selectedActor.movies.includes('…')) {
        const deletedActor = { id: this.selectedActor.id };
        console.log('Objet de suppression envoyé à l\'API:', deletedActor, `DELETE`);

        // Supprimer l'acteur uniquement si la liste des films n'est pas vide
        this.actors = this.actors.filter(actor => actor.id !== this.selectedActor.id);
        this.selectedActorId = null;
        this.showDeleteConfirmation = false;
      } else {
        // Afficher un message ou une alerte indiquant que la suppression n'est pas autorisée
        console.log("Suppression non autorisée. La liste des films n'est pas vide.");
        // Vous pouvez également afficher un message à l'utilisateur ici
        // Par exemple : alert("Suppression non autorisée. La liste des films n'est pas vide.");
      }
    },

    cancelDelete() {
      this.showDeleteConfirmation = false;
    },

    startAddingNewActor() {
      this.addingNewActor = true;
    },

    simulateAddActor() {
      if (!this.newActor.firstname || !this.newActor.lastname) {
        console.error('Erreur : Les champs Prénom et Nom sont obligatoires.');
        return;
      }

      console.log("Simuler l'ajout d'un nouvel acteur");

      const newActor = {
        id: Math.max(...this.actors.map(actor => actor.id), 0) + 1,
        firstname: this.newActor.firstname,
        lastname: this.newActor.lastname,
        movies: typeof this.newActor.movies === 'string' ? (this.newActor.movies.includes(',') ? this.newActor.movies.split(',').map(movie => movie.trim()) : [this.newActor.movies.trim()]) : this.newActor.movies || [],
        media: this.newActor.media || [],
      };

      this.actors.push(newActor);
      this.newActor = {
        firstname: '',
        lastname: '',
        movies: [],
        media: [],
      };
      this.addingNewActor = false;

      const responseData = {
        '@context': '/public/index.php/api/contexts/Actor',
        '@id': `/public/index.php/api/actors/${newActor.id}`,
        '@type': 'Actor',
        'id': newActor.id,
        'firstname': newActor.firstname,
        'lastname': newActor.lastname,
        'movies': newActor.movies,
        'media': newActor.media,
      };

      console.log("Données reçues de l'API après l'ajout:", responseData, 'POST');
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  computed: {
    filteredActors() {
      return this.actors.filter(actor => `${actor.firstname} ${actor.lastname}`.toLowerCase().includes(this.searchText.toLowerCase()));
    },
    totalPages() {
      return Math.ceil(this.filteredActors.length / this.actorsPerPage);
    },
    paginateActors() {
      const start = (this.currentPage - 1) * this.actorsPerPage;
      const end = start + this.actorsPerPage;
      return this.filteredActors.slice(start, end);
    },
  },
};
</script>


<style>
.actors-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 1000px;
}

.actor-card {
  width: calc(25% - 20px);
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  transition: background-color 0.3s ease;
}

.actor-card:hover {
  background-color: #f5f5f5;
}

.actor-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.selected {
  background-color: #e6f7ff;
}

.col-md-12 {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* Pagination Styles */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.page-item {
  display: inline-block;
  margin: 0 5px;
}

.page-link {
  cursor: pointer;
}

/* Delete Confirmation Popin Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Add these styles to your existing <style> block */
.form-group {
  margin-bottom: 15px;
}

/* Style for form labels */
.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

/* Style for form inputs and selects */
.form-control {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Style for form buttons */
.btn {
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
}

/* Style for the "Simuler Modifier" button */
.btn-primary {
  background-color: #58d073;
  color: #000; /* Keep text color black */
}

/* Style for the "Simuler Supprimer" button */
.btn-danger {
  background-color: #fb4a4a;
  color: #000; /* Keep text color black */
}

/* Style for the "Simuler Ajouter" button */
.btn-success {
  background-color: #28a745;
  color: #000; /* Keep text color black */
}

/* Style for the form container */
.form-container {
  max-width: 400px; /* Adjust as needed */
  margin: 0 auto;
}

/* Style for form header */
.form-header {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

/* Style for form input error messages */
.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
}

/* Style for form success messages */
.success-message {
  color: #28a745;
  font-size: 14px;
  margin-top: 10px;
}

</style>

