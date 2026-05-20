const TASK_KEY = 'tasks_data';
const CATEGORIES_KEY = 'categories_data';

//Task CRUD operations
export function getStoredTasks() {
    const tasks = localStorage.getItem(TASK_KEY);
    return tasks ? JSON.parse(tasks) : [];
}

export function saveTasks(tasks) {
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

export function addTaskToStorage(newTask) {
    const tasks = getStoredTasks();
    tasks.push(newTask);
    saveTasks(tasks);
}

//Category CRUD operations
export function getStoredCategories() {
    const categories = localStorage.getItem(CATEGORIES_KEY);

    //Default categories if local storage is blank on first boot
    return categories ? JSON.parse(categories) : [
        { nom: "Organitzación", color: "#f7df1e" },
        { nom: "Diseño", color: "#e5989b" },
        { nom: "Tareas hogar", color: "#6c5ce7" }
    ];
}

export function saveCategories(categories) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}