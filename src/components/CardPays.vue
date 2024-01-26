<template>
  <div>
    <h1>Liste des acteurs</h1>
    <input v-model="searchText" class="form-control" type="text" placeholder="Rechercher par nom" />

    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="actors-container">
            <div v-for="actor in paginateActors" :key="actor.id" class="actor-card">
              <div v-if="selectedActorId === actor.id">
                <form @submit.prevent="simulateUpdateActor(actor.id)">
                  <div v-for="field in ['Firstname', 'Lastname']" :key="field" class="form-group">
                    <label :for="'editActor' + field">{{ field }} :</label>
                    <input :type="field === 'Lastname' ? 'text' : 'text'" class="form-control" :id="'editActor' + field" v-model="selectedActor[field.toLowerCase()]"
                      :placeholder="'Modifier ' + field" />
                  </div>
                  <div class="form-group">
                    <label for="actorMovies">Films :</label>
                    <select multiple class="form-control" id="actorMovies" v-model="selectedActor.movies">
                      <option v-for="movie in movies" :key="movie.id" :value="movie.title">{{ movie.title }}</option>
                    </select>
                  </div>
                  <button type="submit" class="btn btn-primary">Simuler Modifier</button>
                </form>
                <button @click="simulateDeleteActor" class="btn btn-danger" style="color: black;">Simuler Supprimer</button>
              </div>
              <div v-else>
                <div class="actor-name">{{ actor.firstname }} {{ actor.lastname }}</div>
                <div v-if="actor.movies && actor.movies.length > 0">
                  <div><strong>Films:</strong></div>
                  <ul><li v-for="movie in actor.movies" :key="movie">{{ movie }}</li></ul>
                </div>
                <router-link :to="'/fiche-acteur/' + actor.id" style="margin-right:25%">Détail</router-link>
                <a @click="toggleActorDetails(actor.id)">Modifier</a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3" v-if="!selectedActorId">
          <h2 v-if="!addingNewActor">Ajouter un nouvel acteur</h2>
          <form v-if="addingNewActor" @submit.prevent="simulateAddActor">
            <div v-for="field in ['Firstname', 'Lastname']" :key="field" class="form-group">
              <label :for="'newActor' + field">{{ field }} :</label>
              <input :type="field === 'Lastname' ? 'text' : 'text'" class="form-control" :id="'newActor' + field" v-model="newActor[field.toLowerCase()]"
                :placeholder="'Nouvel acteur ' + field" />
            </div>
            <div class="form-group">
              <label for="newActorMovies">Films :</label>
              <select multiple class="form-control" id="newActorMovies" v-model="newActor.movies">
                <option v-for="movie in movies" :key="movie.id" :value="movie.title">{{ movie.title }}</option>
              </select>
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
          <a class="page-link" @click="changePage(currentPage - 1)" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
          <a class="page-link" @click="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" @click="changePage(currentPage + 1)" aria-label="Next">
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
      movies: [],  // Ajout de la liste des films
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
    this.getMovies();  // Appel pour obtenir la liste des films
  },
  methods: {
    toggleActorDetails(actorId) {
      this.selectedActorId = this.selectedActorId === actorId ? null : actorId;
      this.selectedActor = this.actors.find(actor => actor.id === this.selectedActorId);
    },
    async getActors() {
      try {
        const response = await axios.get('http://localhost:5173/actor.json');
        this.actors = response.data['hydra:member'].map(actor => ({
          id: actor.id,
          firstname: actor.firstname,
          lastname: actor.lastname,
          movies: actor.movies || [],
        }));
      } catch (error) {
        console.error('Error', error);
      }
    },
    async getMovies() {
      try {
        const response = await axios.get('http://localhost:5173/actor.json');
        this.movies = response.data['hydra:member'].map(movie => ({
          id: movie.id,
          title: movie.title,
        }));
      } catch (error) {
        console.error('Error', error);
      }
    },
    simulateUpdateActor(actorId) {
      console.log(`Simuler la mise à jour de l'acteur avec l'ID ${actorId}`);
      console.log(`Données de l'acteur avant la mise à jour :`, this.selectedActor);

      // Vous pouvez envoyer uniquement les données nécessaires à votre API
      const updatedActorData = {
        '@context': '/public/index.php/api/contexts/Actor',
        '@id': `/public/index.php/api/actors/${this.selectedActor.id}`,
        '@type': 'Actor',
        id: this.selectedActor.id,
        firstname: this.selectedActor.firstname,
        lastname: this.selectedActor.lastname,
        movies: this.selectedActor.movies,
      };

      console.log('Objet de mise à jour envoyé à l\'API:', updatedActorData, `PATCH : ${actorId}`);
      
      // Simulez la mise à jour de la liste des acteurs (remplacez cette partie par votre appel API réel)
      const existingActor = this.actors.find(actor => actor.id === actorId);
      if (existingActor) {
        // Mettez à jour les données dans la liste des acteurs
        Object.assign(existingActor, this.selectedActor);

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
      const deletedActor = { id: this.selectedActor.id };
      console.log('Objet de suppression envoyé à l\'API:', deletedActor, `DELETE`);

      this.actors = this.actors.filter(actor => actor.id !== this.selectedActor.id);
      this.selectedActorId = null;
      this.showDeleteConfirmation = false;
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

      console.log('Simuler l\'ajout d\'un nouvel acteur');

      const newActor = {
        id: Math.max(...this.actors.map(actor => actor.id), 0) + 1,
        firstname: this.newActor.firstname,
        lastname: this.newActor.lastname,
        movies: this.newActor.movies,
      };

      this.actors.push(newActor);
      this.newActor = {
        firstname: '',
        lastname: '',
        movies: [],
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
      };

      console.log('Données reçues de l\'API après l\'ajout:', responseData, `POST`);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  computed: {
    filteredActors() {
      return this.actors.filter(actor => (actor.firstname + ' ' + actor.lastname).toLowerCase().includes(this.searchText.toLowerCase()));
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
.actors-container { display: flex; flex-wrap: wrap; justify-content: space-between; width: 1000px; }
.actor-card { width: calc(25% - 20px); margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; transition: background-color 0.3s ease; }
.actor-card:hover { background-color: #f5f5f5; }
.actor-name { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
.selected { background-color: #e6f7ff; }

/* Ajoutez les styles de pagination si nécessaire */

/* Ajoutez les styles de la popin de confirmation de suppression si nécessaire */
</style>
