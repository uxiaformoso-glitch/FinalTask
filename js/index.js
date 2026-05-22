import {getStoredTasks, saveTasks, getStoredCategories} from './storage.js';
import {renderChart} from './graficos.js';

document.addEventListener('DOMContentLoaded', () => {
    const toDoContainer = document.getElementById('toDoTask');
    const finishedContainer = document.getElementById('finishedTask');
    const importForm = document.getElementById('importForm');

    //main layout routine to render task cards
    function renderTasksUI() {
        const tasks = getStoredTasks();
        const activeCategories = getStoredCategories();

        toDoContainer.innerHTML = '';
        finishedContainer.innerHTML = '';

        if (tasks.length === 0) {
            toDoContainer.innerHTML = '<p>No hay tareas pendientes.</p>';
            finishedContainer.innerHTML = '<p>No hay tareas completadas.</p>'
            renderChart(tasks);
            return;
        }

        //Sort tasks by pririty
        const priorityWeights = {
            'alta': 1,
            'media': 2,
            'mitjana': 2,
            'baja': 3,
            'baixa': 3
        };

        tasks.sort((a, b) => {
            //If priority is undefined or unrecognized, fallback to 4
            const weightA = priorityWeights[String(a.prioritat).toLowerCase()] || 4;
            const weightB = priorityWeights[String(b.prioritat).toLowerCase()] || 4;

            //Primary sort: Compare priorities
            if (weightA !== weightB) {
                return weightA - weightB; //Lower weight higher priority
            }

            //Secondary sort: closest date first
            const dateA = a.data ? new Date(a.data).getTime() : Infinity;
            const dateB = b.data ? new Date(b.data).getTime() : Infinity;

            return dateA - dateB;
        });

        tasks.forEach(task => {
            //Check if task's assigned category still exists in category manager
            const categoryStillExists = activeCategories.find(c => c.nom === task.categoria?.nom);

            //If category exists, use its color. If deleted neutral gray color
            const displayColor = categoryStillExists ? categoryStillExists.color : '#cbd5e1';
            const displayCategoryName = categoryStillExists ? task.categoria.nom : 'Sin categoría (Eliminada)';

            const card = document.createElement('div');

            const cleanPriorityClass = String(task.prioritat).toLowerCase();

            card.className = `cardContainer card-priority-${cleanPriorityClass}`;

            card.innerHTML = `
                <div class="taskInfo">
                    <div class="cardHeaderRow">
                        <h4 class="${task.realitzada ? 'completed-title' : ''}">${task.titol}</h4>
                        <span class="priorityTextLabel">${task.prioritat.charAt(0).toUpperCase() + task.prioritat.slice(1).toLowerCase()}</span>
                    </div>

                    <div class="categoryBadgeContainer">
                        <span class="categoryTaskName" style="background-color: ${displayColor};">${displayCategoryName}</span>
                    </div>

                    <div class="taskDate">${task.data}</div>

                    <div class="cardFooterRow">
                        <p class="taskDescription">${task.descripcio}</p>
                        <div class="btn-taskControls">
                            <label class="btn-checkbox">
                                <input type="checkbox" class="toggleStatus" data-id="${task.id}" ${task.realitzada ? 'checked' : ''}>
                            </label>
                            <button class="btn-deleteTask" data-id="${task.id}" title="Eliminar tarea">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            if (task.realitzada) {
                finishedContainer.appendChild(card);
            } else {
                toDoContainer.appendChild(card);
            }
        });

        //Toggle checking tasks
        document.querySelectorAll('.toggleStatus').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = e.target.getAttribute('data-id');
                const currentTasks = getStoredTasks();
                const targetTask = currentTasks.find(t => t.id === taskId);

                if (targetTask) {
                    targetTask.realitzada = e.target.checked;
                    saveTasks(currentTasks);
                    renderTasksUI();
                }
            });
        });

        document.querySelectorAll('.btn-deleteTask').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.target.closest('.btn-deleteTask');
                const taskId = targetBtn.getAttribute('data-id');
                let currentTasks = getStoredTasks();

                currentTasks = currentTasks.filter(t => t.id !== taskId);
                saveTasks(currentTasks);
                renderTasksUI();
            });
        });

        //Re-calculate and refresh the Chart.js canvas
        renderChart(tasks);
    }

    if (importForm) {
        importForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const jsonPathInput = document.getElementById('jsonPath');
            const path = jsonPathInput.value.trim() || 'datos/actividades_001.json';

            fetch(path)
                .then(response => {
                    if (!response.ok) throw new Error('No se ha localizado el fichero.');
                    return response.json();
                })
                .then(importedArray => {
                    const localTasks = getStoredTasks();
                    const localCategories = getStoredCategories();

                    let itemsAddedCount = 0;
                    let categoriesAddedCount = 0;

                    importedArray.forEach(incomingItem => {
                        const safeImportId = incomingItem.id.startsWith('import-')
                            ? incomingItem.id : `import-${incomingItem.id}`;

                        const collisionDetected = localTasks.some(existing => existing.id === safeImportId);

                        if (!collisionDetected) {
                            if (incomingItem.categoria && incomingItem.categoria.nom) {
                                const catName = incomingItem.categoria.nom;
                                const catColor = incomingItem.categoria.color || '#7f8c8d';

                                const categoryExists = localCategories.some(
                                    c => c.nom.toLowerCase() === catName.toLowerCase()
                                );

                                if (!categoryExists) {
                                    localCategories.push({nom: catName, color: catColor});
                                    categoriesAddedCount++;
                                }
                            }

                            const standardRecord = {
                                id: safeImportId,
                                titol: incomingItem.titol || incomingItem.titulo,
                                descripcio: incomingItem.descripcio || incomingItem.descripcion,
                                data: incomingItem.data || incomingItem.fecha,
                                categoria: incomingItem.categoria,
                                prioritat: incomingItem.prioritat || incomingItem.prioridad,
                                realitzada: incomingItem.realitzada !== undefined ? incomingItem.realitzada : false
                            };

                            localTasks.push(standardRecord);
                            itemsAddedCount++;
                        }
                    });

                    //Save tasks back to local storage
                    saveTasks(localTasks);

                    //Save categories if new ones were automatically discovered (.json)
                    if (categoriesAddedCount > 0) {
                        localStorage.setItem('categories_data', JSON.stringify(localCategories));
                    }

                    renderTasksUI();
                    alert(`Importación completada.\n Se añadieron ${itemsAddedCount} nuevas tareas.\n Se registraron ${categoriesAddedCount} nuevas categorías.`);
                    jsonPathInput.value = ''; 
                })
                .catch(err => {
                    console.error(err);
                    alert(`Error de lectura: ${err.message}. Revisa que la ruta sea correcta.`);
                });
        });
    }

    renderTasksUI();
});