document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.priority, task.completed);
    });
    sortTasks(); 
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.querySelector(".task-text").textContent,
            priority: li.dataset.priority,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let task = taskInput.value.trim();
    let priority = document.getElementById("prioritySelect").value;

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    addTaskToDOM(task, priority, false);
    saveTasks();
    sortTasks();
    taskInput.value = "";
}

function addTaskToDOM(task, priority, completed) {
    let taskList = document.getElementById("taskList");

    let li = document.createElement("li");
    li.dataset.priority = priority;
    li.classList.add(`priority-${priority}`);
    if (completed) li.classList.add("completed");

    let taskText = document.createElement("span");
    taskText.classList.add("task-text");
    taskText.appendChild(document.createTextNode(task));

    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = "&#9998;";
    editButton.onclick = function() {
        editTask(li);
    };

    let deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("X"));
    deleteButton.onclick = function() {
        li.remove();
        saveTasks();
        sortTasks();
    };

    li.onclick = function() {
        li.classList.toggle("completed");
        saveTasks();
    };

    li.appendChild(taskText);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
}

function editTask(li) {
    let newTask = prompt("Edit Task:", li.querySelector(".task-text").textContent);
    if (newTask !== null && newTask.trim() !== "") {
        li.querySelector(".task-text").textContent = newTask;
        saveTasks();
    }
}

function searchTasks() {
    let filter = document.getElementById("searchInput").value.toLowerCase();
    let tasks = document.querySelectorAll("#taskList li");

    tasks.forEach(task => {
        let text = task.querySelector(".task-text").textContent.toLowerCase();
        task.style.display = text.includes(filter) ? "" : "none";
    });
}
function sortTasks() {
    let taskList = document.getElementById("taskList");
    let tasks = Array.from(taskList.children);

    tasks.sort((a, b) => {
        let priorityOrder = { "high": 1, "medium": 2, "low": 3 };
        return priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority];
    });

    tasks.forEach(task => taskList.appendChild(task));
}
