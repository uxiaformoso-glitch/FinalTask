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

        tasks.forEach(task => {
            //Check if task's assigned category still exists in category manager
            const categoryStillExists = activeCategories.find(c => c.nom === task.categoria?.nom);

            //If category exists, use its color. If deleted neutral gray color
            const displayColor = categoryStillExists ? categoryStillExists.color : '#cbd5e1';
            const displayCategoryName = categoryStillExists ? task.categoria.nom : 'Sin categoría (Eliminada)';

            const card = document.createElement('div');
            card.className = 'cardContainer';

            card.style.borderLeft = `6px  solid ${displayColor}`;

            card.innerHTML = `
                <div>
                    <div class="leftSide-container">
                        <h4>${task.titol}</h4>
                        <span>${displayCategoryName}</span>
                        <span>${task.data}</span>
                        <p>${task.descripcio}</p>
                    </div>
                    <div class="rightSide-container">
                        <span>Prioridad: <strong>${task.prioritat}</strong></span>
                        <div>
                            <label>
                                <input type="checkbox" class="toggleStatus" data-id="${task.id}" ${task.realitzada ? 'checked' : ''}>
                                ${task.realitzada ? 'Hecha' : 'Pendiente'}
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
                    let itemsAddedCount = 0;

                    importedArray.forEach(incomingItem => {
                        const collisionDetected = localTasks.some(existing => existing.id === incomingItem.id);

                        if (!collisionDetected) {
                            const standardRecord = {
                                id: incomingItem.id,
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

                    saveTasks(localTasks);
                    renderTasksUI();
                    alert(`Importación completada. Se añadieron ${itemsAddedCount} nuevas tareas`);
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