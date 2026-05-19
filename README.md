# FinalTask

# Funcionamiento de la prueba:
● Inicio de la tarea: 15 de abril  
● Fecha límite de entrega: 30 de abril  
● No se puede hacer uso de ninguna inteligencia artificial.  

# Se debe entregar:
● Proyecto completo con archivos HTML, JS y CSS.  
● Debe poder visualizarse a través de GitHub Pages.  

# Enunciado
Desarrollar una aplicación web modular que permita planificar, gestionar y realizar el seguimiento de tareas personales mediante formularios, visualización gráfica y persistencia de datos. Esta aplicación simula un gestor personal de actividades, poniendo en práctica todos los conocimientos aprendidos durante el curso.  

# Requisitos y funcionalidades mínimas:
La aplicación debe estar compuesta por 3 páginas HTML con las siguientes funcionalidades:  

### index.html – Vista principal
● Debe tener un menú de navegación.  
● Muestra un listado de todas las actividades.  
● Permite:  
    ○ crear, eliminar y marcar como realizadas.  
● Muestra un gráfico con Chart.js con las tareas realizadas por mes.  
● Carga las actividades desde:  
    ○ localStorage  
    ○ un archivo actividades.json (importación con fetch(), evitando duplicados).  

### crear-tasca.html – Formulario para añadir actividades
● Debe tener un menú de navegación.  
● Incluye un formulario con validación:  
    ○ título, descripción, fecha, categoría (selector de categorías), prioridad (selector de Baja, Media, Alta).  
● Guarda las actividades en localStorage con un ID único en el formato "task-001" y el campo realizada: false.  

### categories.html – Gestor de categorías
● Debe tener un menú de navegación.  
● Permite añadir y eliminar categorías que se pueden usar en el formulario.  
● Las categorías se guardan en localStorage.  

# Organización del proyecto:
<ins>css</ins>  
    style.css  

<ins>datos</ins>  
    actividades_001.json  
    actividades_002.json  

<ins>js</ins>  
    categorias.js  
    form-task.js  
    graficos.js  
    index.js  
    modelos.js  
    storage.js  

categorias.html  
create-task.html  
index.html  
