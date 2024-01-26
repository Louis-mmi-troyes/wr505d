import { createRouter, createWebHistory } from 'vue-router'

import Pays from '../views/Pays.vue'
import Fournisseur from '../views/Fournisseur.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/About.vue')
    },
    {
      path: '/acteurs',
      name: 'acteurs',
      component: () => import('../views/Recherche.vue')
    },
    {
      path: '/movies',
      name: 'movies',
      component: Pays
    },
    {
      path: '/categorie',
      name: 'categorie',
      component: Fournisseur
    },
    {
      path: '/fiche-pays/:id',
      name: 'fiche-pays',
      component: () => import('../views/FichePays.vue')
    },
    {
      path: '/fiche-acteur/:id',
      name: 'fiche-acteur',
      component: () => import('../views/fiche-acteur.vue')
    }

  ]
})

export default router
