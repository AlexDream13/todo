const form = document.querySelector('#form');
const input = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((item) => renderTask(item));
}


checkEmptyList();


form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask (event){
    event.preventDefault();
    const taskText = input.value.trim();
let newTaskId = Date.now();
    newTaskId = Number(String(newTaskId).slice(8));
    //Описываем задачу в виде обьекта
    const newTask = {
        id: newTaskId,
        text: taskText,
        done: false,
    };
    //Добавляем обьект в массив с задачами
    tasks.push(newTask);
    saveLocalStorage();
    renderTask(newTask);
    input.value = '';
    input.focus();
    //Скрываем заголовок "Список дел пуст"
    /*if(tasksList.children.length > 1){
        emptyList.classList.add('none');
    }*/
    checkEmptyList();
}

function deleteTask (event){
    if(event.target.dataset.action !== "delete") return;
        const parentNode = event.target.closest('.list-group-item');
        //Определяем ID задачи
        const id = Number(parentNode.id);

  //Находим индекс задачи, findIndex() проходит по массиву tasks и если условие верно возвращает true и индекс задачи
    //const index = tasks.findIndex(task => task.id === id);

    //Удаляем задачу из массива (два способа)
    //tasks.splice(index,1);
    tasks = tasks.filter((task) => task.id !== id);
    saveLocalStorage();
    //Удаляем задачу из разметки
        parentNode.remove();
   //Показываем заголовок "Список дел пуст"
    //if(tasksList.children.length === 1) emptyList.classList.remove('none');
    checkEmptyList();

}

function doneTask(event){
    //Проверяем, что клик был НЕ по кнопке "Задача выполнена"
    if(event.target.dataset.action !== "done") return;
    const parentNode = event.target.closest('.list-group-item');

    //Определяем ID задачи
    const id = Number(parentNode.id);
    
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;
    saveLocalStorage();
    const taskTitle = parentNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList(){
    if (tasks.length === 0){
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
<div class="empty-list__title">Список дел пуст</div>
</li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    if (tasks.length > 0){
        const emptyListElement = document.querySelector('#emptyList');
        emptyListElement ? emptyListElement.remove() : null;
    }
}

function saveLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks));

}
function renderTask(task){
    //Формируем CSS класс
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

//Формируем разметку для новой задачи
    const taskHtml = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                    <span class="${cssClass}">${task.text}</span>
                    <div class="task-item__buttons">
                    <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                    </button>
                    <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                    </button>
                    </div>
                   </li>`;
    // Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHtml);
}