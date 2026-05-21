/**
 * Generate unique tsk id sequentially
 * @param {Array} existingTasks - Current list of tasks
 * @returns {string} next available unique id
 */

export function generateTaskId(existingTasks) {
    if (!existingTasks || existingTasks.length === 0) return "task_001";

    const ids = existingTasks.map(task => {
        const match = task.id.match(/task-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    });

    const maxId = Math.max(...ids, 0);
    const nextId = maxId + 1;
    return `task-${String(nextId).padStart(3, '0')}`;
}

//Function to create a standardized task object
export function createTaskModel(id, titol, descripcio, data, categoriaObj, prioritat){
    return {
        id,
        titol,
        descripcio,
        data,
        categoria: categoriaObj,
        prioritat,
        realitzada: false
    };
}