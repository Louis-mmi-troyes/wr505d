<template>
  <div>
    <h1>Derniers Films</h1>

    <div class="movies-container" @click="redirectToDetailPage">
      <div v-for="movie in latestMovies" :key="movie.id" class="movie-card" :data-movie-id="movie.id">
        <div class="movie-title">{{ movie.title }}</div>
      </div>
    </div>

    <h1>Derniers Acteurs</h1>

    <div class="actors-container" @click="redirectToActorDetailPage">
      <div v-for="actor in latestActors" :key="actor.id" class="actor-card" :data-actor-id="actor.id">
        <div class="actor-details">
          <div class="actor-name">{{ actor.firstname }} {{ actor.lastname }}</div>

        </div>
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
      latestMovies: [],
      actors: [],
      latestActors: [],
    };
  },
  created() {
    this.getMovies();
    this.getActors();
  },
  methods: {
    async getMovies() {
      try {
        const response = await axios.get('http://localhost:5173/all2.json');
        this.movies = response.data['hydra:member'].map(movie => ({
          id: movie.id,
          title: movie.titre,
          actors: movie.actors || [],
          categories: movie.categories || [],
        }));

        // Order movies by ID in descending order
        this.movies.sort((a, b) => b.id - a.id);

        // Take the first 4 movies as the latest ones
        this.latestMovies = this.movies.slice(0, 4);
      } catch (error) {
        console.error('Error', error);
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
        }));

        // Order actors by ID in descending order
        this.actors.sort((a, b) => b.id - a.id);

        // Take the first 4 actors as the latest ones
        this.latestActors = this.actors.slice(0, 4);
      } catch (error) {
        console.error('Error', error);
      }
    },
    redirectToDetailPage(event) {
      const movieCard = event.target.closest('.movie-card');
      if (movieCard) {
        const movieId = parseInt(movieCard.dataset.movieId);
        // Rediriger vers la page de détail avec l'ID du film
        this.$router.push({ path: `/fiche-pays/${movieId}` });
      }
    },
    redirectToActorDetailPage(event) {
      const actorCard = event.target.closest('.actor-card');
      if (actorCard) {
        const actorId = parseInt(actorCard.dataset.actorId);
        // Rediriger vers la page de détail avec l'ID de l'acteur
        this.$router.push({ path: `/fiche-acteur/${actorId}` });
      }
    },
  },
};
</script>

<style>
/* Vos styles existants ici */

.actors-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 1000px;
  margin-top: 20px;
}

.actor-card {
  width: calc(25% - 20px);
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.actor-card:hover {
  background-color: #f5f5f5;
}

.actor-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.actor-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
