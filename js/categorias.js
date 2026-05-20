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

        categories.forEach((cat) => {
            const row = document.createElement('div');
            
            row.className = 'category-row';

            row.style.setProperty('--badge-color', cat.color);

            row.innerHTML = `
                <div class="category-info">
                    <span class="colorIndicator"></span>
                    <strong>${cat.nom}</strong>
                </div>
                <button class="btn-delete" onclick="removeCategory('${cat.nom}')">Eliminar</button>
            `;

            categoriesList.appendChild(row);
        });
    }

    window.removeCategory = function(categoryName) {
        let currentCats = getStoredCategories();

        currentCats = currentCats.filter(cat => cat.nom !== categoryName);

        saveCategories(currentCats);
        renderCategoriesUI();
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