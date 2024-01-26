<template>
  <div>
    <h1>Détails du film</h1>
    <div v-if="film != null" class="film-card">
      <h2>{{ film.titre }}</h2>
      <p>Acteurs: {{ formatActors(film.actors) }}</p>
      <p>Catégories: {{ formatCategories(film.categories) }}</p>
      <p>Date de sortie: {{ formatDate(film.release_date) }}</p>
      <p>Réalisateur: {{ film.director || 'Non spécifié' }}</p>
      <p>Description: {{ film.description || 'Aucune description disponible' }}</p>
    </div>
    <router-link to="/movies">Retour à la liste des films</router-link>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const films = ref([])
const film = ref({
  titre: '',
  actors: '',
  categories: '',
  release_date: '',
  director: '',
  description: ''
  //rajouter d'autres valeurs
})

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:5173/all2.json')
    const data = await response.json()
    films.value = data['hydra:member']
    const filmId = Number(route.params.id)
    const foundFilm = films.value.find(film => film.id === filmId)
    if (foundFilm) {
      film.value = foundFilm
    } else {
      console.error('Film non trouvé')
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du film :', error)
  }
})

// Fonctions utilitaires pour formater les valeurs
const formatActors = (actors) => Array.isArray(actors) ? actors.join(', ') : 'Aucun acteur répertorié'
const formatCategories = (categories) => Array.isArray(categories) ? categories.join(', ') : 'Aucune catégorie répertoriée'
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'Non spécifiée'
</script>

<style scoped>
/* Style pour la fiche détaillée du film sous forme de carte */
.film-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.film-card h2 {
  color: #333;
  margin-bottom: 10px;
}

.film-card p {
  color: #666;
  margin-bottom: 10px;
}
</style>
