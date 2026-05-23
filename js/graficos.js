let chartInstance = null;

/**
 * Compiles and renders a bar chart displaying completed tasks by month
 * @param {Array} tasks - Complete list of current tasks
 */

export function renderChart(tasks) {
    const canvasElement = document.getElementById('taskChart');
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
        type: 'line',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Tareas Realizadas',
                data: monthlyCounts,
                backgroundColor: 'rgba(163, 226, 218, 0.4)',
                borderColor: 'rgb(74, 185, 171)',
                borderWidth: 2,
                tension: 0.1,
                fill: true,
                pointBackgroundColor: 'rgb(74, 185, 171)',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 50,
                    ticks: {stepSize: 5},
                }
            }
        }
    });
}