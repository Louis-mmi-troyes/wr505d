<template>
  <div>
    <h1>Liste des films</h1>
    <input v-model="searchText" class="form-control" type="text" placeholder="Rechercher par titre" />

    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="movies-container">
            <div v-for="movie in paginateMovies" :key="movie.id" class="movie-card">
              <div v-if="selectedMovieId === movie.id">
                <form @submit.prevent="simulateUpdateMovieTitle(movie.id)">
                  <div v-for="field in ['Title', 'Description', 'Director', 'Actors', 'Categories', 'ReleaseDate', 'ReleaseDateHyphen']" :key="field" class="form-group">
                    <label :for="'editMovie' + field">{{ field }} :</label>
                    <select v-if="field === 'Actors'" class="form-control" :id="'editMovie' + field" v-model="selectedMovie.actors" multiple>
                      <option v-for="actor in getDistinctActors()" :key="actor" :value="actor">{{ actor }}</option>
                    </select>
                    <select v-else-if="field === 'Categories'" class="form-control" :id="'editMovie' + field" v-model="selectedMovie.categories" multiple>
                      <option v-for="category in getDistinctCategories()" :key="category" :value="category">{{ category }}</option>
                    </select>
                    <input v-else :type="field.includes('Date') ? 'date' : 'text'" class="form-control" :id="'editMovie' + field" v-model="selectedMovie[field.toLowerCase()]"
                      :placeholder="'Modifier ' + field" />
                  </div>
                  <button type="submit" class="btn btn-primary">Simuler Modifier</button>
                </form>
                <button @click="simulateDeleteMovie" class="btn btn-danger" style="color: black;">Simuler Supprimer</button>
              </div>
<!-- ... Autres parties de votre template ... -->
<div v-else>
  <div class="movie-title">{{ movie.title }}</div>
  <div v-if="movie.actors && movie.actors.length > 0">
    <div><strong>Acteurs:</strong></div>
    <ul><li v-for="actor in movie.actors" :key="actor">{{ actor }}</li></ul>
  </div>
  <div v-if="movie.categories && movie.categories.length > 0">
    <div><strong>Catégories:</strong></div>
    <ul><li v-for="category in movie.categories" :key="category">{{ category }}</li></ul>
  </div>
  <router-link :to="'/fiche-pays/' + movie.id" style="margin-right:25%">Détail</router-link>

  <a @click="toggleDetails(movie.id)">Edit</a>
</div>
<!-- ... Autres parties de votre template ... -->

            </div>
          </div>
        </div>
        <div class="col-md-3" v-if="!selectedMovieId">
          <h2 v-if="!addingNewMovie">Ajouter un nouveau film</h2>
          <form v-if="addingNewMovie" @submit.prevent="simulateAddMovie">
            <div v-for="field in ['Title', 'Description', 'Director', 'Actors', 'Categories', 'ReleaseDate', 'ReleaseDateHyphen']" :key="field" class="form-group">
              <label :for="'newMovie' + field">{{ field }} :</label>
              <select v-if="field === 'Actors'" class="form-control" :id="'newMovie' + field" v-model="newMovie.actors" multiple>
                <option v-for="actor in getDistinctActors()" :key="actor" :value="actor">{{ actor }}</option>
              </select>
              <select v-else-if="field === 'Categories'" class="form-control" :id="'newMovie' + field" v-model="newMovie.categories" multiple>
                <option v-for="category in getDistinctCategories()" :key="category" :value="category">{{ category }}</option>
              </select>
              <input v-else :type="field.includes('Date') ? 'date' : 'text'" class="form-control" :id="'newMovie' + field" v-model="newMovie[field.toLowerCase()]"
                :placeholder="field === 'ReleaseDate' ? 'YYYY-MM-DD' : 'Nouveau film ' + field" />
            </div>
            <button type="submit" class="btn btn-success">Simuler Ajouter</button>
          </form>
          <button v-if="!addingNewMovie" @click="startAddingNewMovie" class="btn btn-primary">Add movie</button>
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
        <p>Êtes-vous sûr de vouloir supprimer ce film ?</p>
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
      movies: [],
      selectedMovieId: null,
      selectedMovie: null,
      editedMovieTitle: '',
      addingNewMovie: false,
      newMovie: {
        title: '',
        description: '',
        director: '',
        actors: [],
        categories: [],
        releaseDate: '',
        releaseDateHyphen: '',
      },
      currentPage: 1,
      moviesPerPage: 8,
      showDeleteConfirmation: false,
      searchText: '',
    };
  },
  created() {
    this.getMovies();
  },
  methods: {
    
    toggleDetails(movieId) {
      this.selectedMovieId = this.selectedMovieId === movieId ? null : movieId;
      this.selectedMovie = this.movies.find(movie => movie.id === this.selectedMovieId);
      this.editedMovieTitle = this.selectedMovie ? this.selectedMovie.title : '';


    },
    async getMovies() {
      try {
        const response = await axios.get('http://localhost:5173/all2.json');
        this.movies = response.data['hydra:member'].map(movie => ({
          id: movie.id,
          title: movie.titre,
          actors: movie.actors || [],
          categories: movie.categories || [],
        }));
      } catch (error) {
        console.error('Error', error);
      }
    },
    simulateUpdateMovieTitle(movieId) {
   console.log(`Simuler la mise à jour du film avec l'ID ${movieId}`);
    console.log(`Données du film avant la mise à jour :`, this.selectedMovie);

    // Vous pouvez envoyer uniquement les données nécessaires à votre API
    const updatedMovieData = {
      '@context': '/public/index.php/api/contexts/Movie',
      '@id': `/public/index.php/api/movies/${this.selectedMovie.id}`,
      '@type': 'Movie',
      id: this.selectedMovie.id,
      title: this.selectedMovie.title,
      actors: this.selectedMovie.actors,
      categories: this.selectedMovie.categories,
      release_date: this.selectedMovie.releaseDate,
      description: this.selectedMovie.description,
      director: this.selectedMovie.director,
      releaseDate: this.selectedMovie.releaseDate,
    };

    console.log('Objet de mise à jour envoyé à l\'API:', updatedMovieData, `PATCH : ${movieId}`);
    
    // Simulez la mise à jour de la liste des films (remplacez cette partie par votre appel API réel)
    const existingMovie = this.movies.find(movie => movie.id === movieId);
    if (existingMovie) {
      // Mettez à jour les données dans la liste des films
      Object.assign(existingMovie, this.selectedMovie);

      // Réinitialisez les valeurs
      this.selectedMovie = null;
      this.selectedMovieId = null;
    }
  },
    simulateDeleteMovie() {
      this.showDeleteConfirmation = true;
    },
    confirmDelete() {
      console.log(`Simuler la suppression du film avec l'ID ${this.selectedMovie.id}`);
      const deletedMovie = { id: this.selectedMovie.id };
      console.log('Objet de suppression envoyé à l\'API:', deletedMovie, `DELETE`);

      this.movies = this.movies.filter(movie => movie.id !== this.selectedMovie.id);
      this.editedMovieTitle = '';
      this.selectedMovieId = null;
      this.showDeleteConfirmation = false;
    },
    cancelDelete() {
      this.showDeleteConfirmation = false;
    },
    startAddingNewMovie() {
      this.addingNewMovie = true;
    },
    simulateAddMovie() {
      if (!this.newMovie.title || !this.newMovie.description || !this.newMovie.director) {
        console.error('Erreur : Les champs Titre, Description et Réalisateur sont obligatoires.');
        return;
      }

      console.log('Simuler l\'ajout d\'un nouveau film');

      const newMovie = {
        id: Math.max(...this.movies.map(movie => movie.id), 0) + 1,
        title: this.newMovie.title,
        description: this.newMovie.description,
        director: this.newMovie.director,
        actors: this.newMovie.actors,
        categories: this.newMovie.categories,
        releaseDate: this.newMovie.releaseDate,
        releaseDateHyphen: this.newMovie.releaseDateHyphen,
      };

      this.movies.push(newMovie);
      this.newMovie = {
        title: '',
        description: '',
        director: '',
        actors: [],
        categories: [],
        releaseDate: '',
        releaseDateHyphen: '',
      };
      this.addingNewMovie = false;

      const responseData = {
        '@context': '/public/index.php/api/contexts/Movie',
        '@id': `/public/index.php/api/movies/${newMovie.id}`,
        '@type': 'Movie',
        'id': newMovie.id,
        'title': newMovie.title,
        'actors': newMovie.actors,
        'categories': newMovie.categories,
        'release_date': new Date().toISOString(),
        'description': newMovie.description,
        'director': newMovie.director,
        'releaseDate': new Date().toISOString(),
      };

      console.log('Données reçues de l\'API après l\'ajout:', responseData, `POST`);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    getDistinctActors() {
      const allActors = this.movies.reduce((actors, movie) => actors.concat(movie.actors), []);
      return [...new Set(allActors)];
    },
    getDistinctCategories() {
      const allCategories = this.movies.reduce((categories, movie) => categories.concat(movie.categories), []);
      return [...new Set(allCategories)];
    },
  },
  computed: {
    filteredMovies() {
      return this.movies.filter(movie => movie.title.toLowerCase().includes(this.searchText.toLowerCase()));
    },
    totalPages() {
      return Math.ceil(this.filteredMovies.length / this.moviesPerPage);
    },
    paginateMovies() {
      const start = (this.currentPage - 1) * this.moviesPerPage;
      const end = start + this.moviesPerPage;
      return this.filteredMovies.slice(start, end);
    },
  },
};
</script>

<style>
.movies-container { display: flex; flex-wrap: wrap; justify-content: space-between; width: 1000px; }
.movie-card { width: calc(25% - 20px); margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; transition: background-color 0.3s ease; }
.movie-card:hover { background-color: #f5f5f5; }
.movie-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
.selected { background-color: #e6f7ff; }
.col-md-12 { display: flex; flex-wrap: wrap; justify-content: space-between; }

/* Pagination Styles */
.pagination { display: flex; justify-content: center; margin-top: 20px; }
.page-item { display: inline-block; margin: 0 5px; }
.page-link { cursor: pointer; }

/* Delete Confirmation Popin Styles */
.modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; }
.modal-content { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); }

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

/* Style for multiple select */
.form-control[multiple] {
  height: auto;
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
    color: black;
}


/* Style for the "Simuler Ajouter" button */
.btn-success {
  background-color: #28a745;
  color: #000; /* Keep text color black */
}

/* Style for the "Add movie" button */
.btn-primary.add-movie {
  background-color: #58d073;
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
