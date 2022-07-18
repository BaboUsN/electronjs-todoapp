const electron = require("electron");
const { ipcRenderer } = electron;

// get elemenets
const todoinput = document.querySelector("#todoinput");
const todoList = document.querySelector(".task-box");
const deleteTodo = document.querySelector("#deleteTodo");
const clearAll = document.querySelector("#allClearButton");
console.log(clearAll);
function allEventListener() {
  document.addEventListener("keyup", pressedEnter);
  todoList.addEventListener("click", todoDeleter);
  clearAll.addEventListener("click", allTodosDeleter);
}
allEventListener();

function allTodosDeleter(e) {
  ipcRenderer.send("todo:deleteAllTodos");
}

function todoDeleter(e) {
  console.log(e.target);
  try {
    if (e.target.id === "deleteTodo") {
      todoId = e.target.parentElement.id;
      ipcRenderer.send("todo:deleteTodo", todoId);
    }
  } catch {}
}

function pressedEnter(e) {
  if (e.keyCode === 13) {
    let todoData = todoinput.value;
    if (todoData !== "") {
      ipcRenderer.send("todo:newTodoData", todoData);
      todoinput.value = "";
    }
  }
}

ipcRenderer.on("backend-todo:addItem", (err, data) => {
  loadTodos(data);
});

const loadTodos = (data) => {
  pureHtml = ``;
  data.map((item) => {
    pureHtml += `<li class="task" id="${item.id}" ><p>${item.title}</p>
  <div id="deleteTodo" >X</div>
  </li>`;
  });
  console.log(pureHtml);
  todoList.innerHTML = pureHtml;
};
