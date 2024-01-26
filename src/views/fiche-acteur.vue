<template>
  <div>
    <h1>Détails de l'acteur</h1>
    <div v-if="actor != null" class="actor-card">
      <h2>{{ actor.firstname }} {{ actor.lastname }}</h2>
      <p>Films: {{ formatMovies(actor.movies) }}</p>
      <p>Média: {{ actor.media || 'Non spécifié' }}</p>
      <!-- Ajoutez d'autres détails spécifiques de l'acteur ici -->
    </div>
    <router-link to="/acteurs">Retour à la liste des acteurs</router-link>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const actors = ref([])
const actor = ref({
  firstname: '',
  lastname: '',
  movies: '',
  media: ''
  // Ajoutez d'autres valeurs
})

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:5173/actor.json')
    const data = await response.json()
    actors.value = data['hydra:member']
    const actorId = Number(route.params.id)
    const foundActor = actors.value.find(actor => actor.id === actorId)
    if (foundActor) {
      actor.value = foundActor
    } else {
      console.error('Acteur non trouvé')
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de l\'acteur :', error)
  }
})

// Fonction utilitaire pour formater les films de l'acteur
const formatMovies = (movies) => Array.isArray(movies) ? movies.join(', ') : 'Aucun film répertorié'
</script>

<style scoped>
/* Style pour la fiche détaillée de l'acteur sous forme de carte */
.actor-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.actor-card h2 {
  color: #333;
  margin-bottom: 10px;
}

.actor-card p {
  color: #666;
  margin-bottom: 10px;
}
</style>
