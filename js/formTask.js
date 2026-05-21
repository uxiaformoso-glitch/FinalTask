import { getStoredCategories, getStoredTasks, addTaskToStorage } from "./storage.js";
import { generateTaskId, createTaskModel } from "./modelos.js";

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm')
    const categorySelect = document.getElementById('category');

    if (categorySelect) {
        //Clear placeholder option from HTML structure
        categorySelect.innerHTML = '<option value="" disabled selected>Selecciona una opción</option>';

        const categories = getStoredCategories();
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.nom;
            opt.textContent = cat.nom;
            categorySelect.appendChild(opt);
        });
    }

    //Form submissions to save new tasks
    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();

            //Extract input values
            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value.trim();
            const date = document.getElementById('date').value;
            const categoryName = categorySelect.value;
            const priority = document.getElementById('priority').value;

            const categories = getStoredCategories();

            const matchingCatObj = categories.find(c => c.nom === categoryName) || {nom: categoryName, color: '#7f8c8d'}

            const allTasks = getStoredTasks();
            const uniqueID = generateTaskId(allTasks);

            //Standarized task object using models layout
            const newTask = createTaskModel(uniqueID, title, description, date, matchingCatObj, priority);

            addTaskToStorage(newTask);

            alert('¡Se ha creado una tarea nueva!');
            window.location.href = 'index.html;'
        });
    }
});