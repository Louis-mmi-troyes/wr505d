<!-- App.vue -->
<template>
  <div id="app">
    <label for="moviesDropdown">Sélectionnez un film :</label>
    <select id="moviesDropdown" v-model="selectedMovie">
      <option v-for="movie in movies" :key="movie">{{ movie }}</option>
    </select>
    <p>Vous avez sélectionné : {{ selectedMovie }}</p>
  </div>
</template>

// App.vue
<script>
import axios from 'axios';

export default {
  data() {
    return {
      movies: [],
      selectedMovie: null,
    };
  },
  mounted() {
    // Load the JSON file here
    // Example using axios
    axios.get('http://localhost:5173/actor.json')
      .then(response => {
        this.movies = this.extractMovies(response.data['hydra:member']); // Update this line
      })
      .catch(error => {
        console.error('Error loading JSON file', error);
      });
  },
  methods: {
    extractMovies(actors) {
      const allMovies = actors.reduce((movies, actor) => {
        return movies.concat(actor.movies);
      }, []);
      return [...new Set(allMovies)];
    },
  },
};
</script>


<style>
/* Ajoutez vos styles CSS ici */
</style>