import {getStoredCategories, saveCategories} from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const categoryForm = document.getElementById('categoryForm');
    const categoriesList = document.getElementById('categoriesList');

    //Render list of current categories with a delete button
    function renderCategoriesUI() {
        if (!categoriesList) return;

        const categories = getStoredCategories();
        categoriesList.innerHTML = '';

        if (categories.length === 0) {
            categoriesList.innerHTML = '<p>No hay categorías creadas</p>';
            return;
        }

        categories.forEach((cat, index) => {
            const row = document.createElement('div');
            
            row.className = 'category-row';

            row.innerHTML = `
                <strong>${cat.nom}</strong>
                <button class="btn-delete">Eliminar</button>
            `;

            categoriesList.appendChild(row);
        });

        //Attach individual event listeners to delete button
        categoriesList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.target.getAttribute('data-index'), 10);
                const currentCats = getStoredCategories();

                currentCats.splice(indexToRemove, 1);
                saveCategories(currentCats);
                renderCategoriesUI();
            });
        });
    }

    //Form submission to create new categories
    if (categoryForm) {
        categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('newCategory');
            const colorInput = document.getElementById('categoryColor');

            const newName = nameInput.value.trim();
            const newColor = colorInput.value;

            const categories = getStoredCategories();

            //Validate against duplicates
            const matchesExisting = categories.some(cat => cat.nom.toLowerCase() === newName.toLowerCase());
            if (matchesExisting) {
                alert('Esta categoría ya existe.');
                return;
            }

            categories.push({nom: newName, color: newColor});
            saveCategories(categories);

            //Reset input values
            nameInput.value = '';
            colorInput.value = '#000000'
            renderCategoriesUI();
        });

        renderCategoriesUI();
    }
});