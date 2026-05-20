let charInstance = null;

/**
 * Compiles and renders a bar chart displaying completed tasks by month
 * @param {Array} tasks - Complete list of current tasks
 */

export function renderChart(tasks) {
    const canvasElement = document.getElementById('tasksChart');
    if (!canvasElement) return;

    //Filter out tasks marked as completed
    const completedTasks = tasks.filter(task => task.realitzada);

    //Track monthly task completion
    const monthlyCounts = Array(12).fill(0);

    completedTasks.forEach(task => {
        if (task.data) {
            const dateObj = new Date(task.data)
            const month = dateObj.getMonth();
            if (!isNaN(month)) {
                monthlyCounts[month]++;
            }
        }
    });

    const monthLabels = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
        'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    //If a charte instance already exists, destroy it before rendering a new one
    if (chartInstance) {
        chartInstance.destroy();
    }

    const ctx = canvasElement.getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Tareas Realizadas por mes',
                data: monthlyCounts,
                backgroundColor: 'rgba(41, 145, 224, 0.7)',
                borderColor: 'rgb(41, 145, 224)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {stepSize: 1}
                }
            }
        }
    });
}