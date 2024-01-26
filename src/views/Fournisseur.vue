<template>
  <div>
    <h1>Liste des catégories</h1>
    <input v-model="searchText" class="form-control" type="text" placeholder="Rechercher par nom" />

    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="categories-container">
            <div v-for="category in paginateCategories" :key="category.id" class="category-card">
<div v-if="selectedCategoryId === category.id">
  <form @submit.prevent="simulateUpdateCategory(category.id)">
    <div v-for="(field, index) in Object.keys(selectedCategory)" :key="index" class="form-group">
      <label :for="'editCategory' + field">{{ field }} :</label>
      <input v-if="field !== 'id'" :type="field === 'Name' ? 'text' : 'text'" class="form-control" :id="'editCategory' + field" v-model="selectedCategory[field.toLowerCase()]"
        :placeholder="'Modifier ' + field" />
    </div>
    <button type="submit" class="btn btn-primary">Simuler Modifier</button>
  </form>
  <button @click="simulateDeleteCategory" class="btn btn-danger" style="color: black;">Simuler Supprimer</button>
</div>

              <div v-else>
                <div class="category-name">{{ category.name }}</div>
                <div>
                  <strong>Films:</strong>
                  <ul>
                    <li v-for="movie in category.movies" :key="movie">{{ movie }}</li>
                  </ul>
                </div>
                <a @click="toggleCategoryDetails(category.id)">Modifier</a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3" v-if="!selectedCategoryId">
          <h2 v-if="!addingNewCategory">Ajouter une nouvelle catégorie</h2>
          <form v-if="addingNewCategory" @submit.prevent="simulateAddCategory">
            <div v-for="field in Object.keys(newCategory)" :key="field" class="form-group">
              <label :for="'newCategory' + field">{{ field }} :</label>
              <input :type="field === 'id' ? 'text' : 'text'" class="form-control" :id="'newCategory' + field" v-model="newCategory[field]"
                :placeholder="'Nouvelle catégorie ' + field" />
            </div>
            <button type="submit" class="btn btn-success">Simuler Ajouter</button>
          </form>
          <button v-if="!addingNewCategory" @click="startAddingNewCategory" class="btn btn-primary">Ajouter catégorie</button>
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
        <p>Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
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
      categories: [],
      selectedCategoryId: null,
      selectedCategory: null,
      addingNewCategory: false,
      newCategory: {
        name: '',
        movies: [],
        media: [],
      },
      currentPage: 1,
      categoriesPerPage: 8,
      showDeleteConfirmation: false,
      searchText: '',
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    toggleCategoryDetails(categoryId) {
  this.selectedCategoryId = this.selectedCategoryId === categoryId ? null : categoryId;
  this.selectedCategory = this.categories.find(category => category.id === this.selectedCategoryId);

  if (this.selectedCategory) {
    // Créez un objet temporaire pour le formulaire de modification
    this.formData = {
      name: this.selectedCategory.name,
      movies: this.selectedCategory.movies.join(', '), // Convert array to string
    };
  } else {
    this.formData = {}; // Réinitialisez l'objet formData
  }
},

    async getCategories() {
      try {
        const response = await axios.get('http://localhost:5173/cat.json');
        this.categories = response.data['hydra:member'].map(category => ({
          id: category.id,
          name: category.name,
          movies: category.movies || [], // Check if movies array exists
          media: category.media || [], // Check if media array exists
        }));
      } catch (error) {
        console.error('Erreur', error);
      }
    },
simulateUpdateCategory(categoryId) {
  console.log(`Simuler la mise à jour de la catégorie avec l'ID ${categoryId}`);
  console.log(`Données de la catégorie avant la mise à jour :`, this.selectedCategory);

  // Créer une copie de la catégorie sélectionnée pour éviter les modifications directes
  const selectedCategoryCopy = { ...this.selectedCategory };

  // Traiter spécifiquement le champ "movies" pour éviter le problème avec la virgule
  if (typeof selectedCategoryCopy.movies === 'string') {
    // Convertir la chaîne en tableau en séparant par la virgule
    selectedCategoryCopy.movies = selectedCategoryCopy.movies.split(',').map(movie => movie.trim());
  }

  // Vous pouvez envoyer uniquement les données nécessaires à votre API
  const updatedCategoryData = {
    '@context': '/public/index.php/api/contexts/Category',
    '@id': `/public/index.php/api/categories/${selectedCategoryCopy.id}`,
    '@type': 'Category',
    ...selectedCategoryCopy,
  };

  // Afficher la chaîne avec une virgule comme séparateur dans la console
  console.log('Objet de mise à jour envoyé à l\'API:', updatedCategoryData, `PATCH : ${categoryId}`);
  
  // Simulez la mise à jour de la liste des catégories (remplacez cette partie par votre appel API réel)
  const existingCategory = this.categories.find(category => category.id === categoryId);
  if (existingCategory) {
    // Mettez à jour les données dans la liste des catégories
    Object.assign(existingCategory, selectedCategoryCopy);

    // Réinitialisez les valeurs
    this.selectedCategory = null;
    this.selectedCategoryId = null;
  }
},



    simulateDeleteCategory() {
      this.showDeleteConfirmation = true;
    },
confirmDelete() {
  // Vérifier si la catégorie sélectionnée existe
  if (this.selectedCategory) {
    console.log(`Simuler la suppression de la catégorie avec l'ID ${this.selectedCategory.id}`);

    // Vérifier la valeur de this.selectedCategory.movies
    console.log('Valeur de this.selectedCategory.movies :', this.selectedCategory.movies);

    // Vérifier si la liste des films existe et est vide ou contient uniquement des chaînes vides
    if (Array.isArray(this.selectedCategory.movies) && this.selectedCategory.movies.every(movie => movie === "")) {
      // Supprimer la catégorie uniquement si la liste des films est vide ou contient uniquement des chaînes vides
      const deletedCategory = { id: this.selectedCategory.id };
      console.log('Objet de suppression envoyé à l\'API:', deletedCategory, `DELETE`);

      // Supprimer la catégorie de la liste
      this.categories = this.categories.filter(category => category.id !== this.selectedCategory.id);
      this.selectedCategoryId = null;
      this.showDeleteConfirmation = false;
    } else {
      // Afficher un message ou une alerte indiquant que la suppression n'est pas autorisée
      console.log('Suppression non autorisée. La liste des films n\'est pas vide ou contient des films.');
      // Vous pouvez également afficher un message à l'utilisateur ici
      // Par exemple : alert('Suppression non autorisée. La liste des films n'est pas vide ou contient des films.');
    }
  }
},









    cancelDelete() {
      this.showDeleteConfirmation = false;
    },
    startAddingNewCategory() {
      this.addingNewCategory = true;
    },
simulateAddCategory() {
  if (!this.newCategory.name) {
    console.error('Erreur : Le champ Nom est obligatoire.');
    return;
  }

  console.log('Simuler l\'ajout d\'une nouvelle catégorie');

  const newCategory = {
    id: Math.max(...this.categories.map(category => category.id), 0) + 1,
    name: this.newCategory.name,
    movies: typeof this.newCategory.movies === 'string' ? (this.newCategory.movies.includes(',') ? this.newCategory.movies.split(',').map(movie => movie.trim()) : [this.newCategory.movies.trim()]) : this.newCategory.movies || [],
    media: this.newCategory.media || [],
  };

  this.categories.push(newCategory);
  this.newCategory = {
    name: '',
    movies: [],
    media: [],
  };
  this.addingNewCategory = false;

  const responseData = {
    '@context': '/public/index.php/api/contexts/Category',
    '@id': `/public/index.php/api/categories/${newCategory.id}`,
    '@type': 'Category',
    'id': newCategory.id,
    'name': newCategory.name,
    'movies': newCategory.movies,
    'media': newCategory.media,
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
    filteredCategories() {
      return this.categories.filter(category => category.name.toLowerCase().includes(this.searchText.toLowerCase()));
    },
    totalPages() {
      return Math.ceil(this.filteredCategories.length / this.categoriesPerPage);
    },
    paginateCategories() {
      const start = (this.currentPage - 1) * this.categoriesPerPage;
      const end = start + this.categoriesPerPage;
      return this.filteredCategories.slice(start, end);
    },
  },
};
</script>



<style>
.categories-container { display: flex; flex-wrap: wrap; justify-content: space-between; width: 1000px; }
.category-card { width: calc(25% - 20px); margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; transition: background-color 0.3s ease; }
.category-card:hover { background-color: #f5f5f5; }
.category-name { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
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
