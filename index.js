const inputBox = document.getElementById("input-box");
        
const dueDateInput = document.getElementById("due-date");
const categorySelect = document.getElementById("category-select");
const searchBox = document.getElementById("search-box");
const listContainer = document.getElementById("list-container");

let tasks = []; // Array to store task details and due dates

function addTask() {


    if (inputBox.value === "") {
        alert("You must write something!!");
        return;
    }

    const task = {
        text: inputBox.value,
        dueDate: dueDateInput.value || "9999-12-31", // Default to a future date if no due date
        category: categorySelect.value,
    };

    tasks.push(task);
    tasks = sortTasks(tasks); // Sort tasks after adding new task

    renderTasks();

    inputBox.value = "";
    dueDateInput.value = "";
    saveData();
} 

function sortTasks(tasksArray) {
    return tasksArray.sort((a, b) => {
        if (a.dueDate === b.dueDate) {
            return 0;
        }
        if (a.dueDate === "9999-12-31") {
            return 1; // Tasks without due dates should come last
        }
        if (b.dueDate === "9999-12-31") {
            return -1;
        }
        return a.dueDate.localeCompare(b.dueDate);
    });
}

function renderTasks(filteredTasks = tasks) {
    listContainer.innerHTML = ""; // Clear the list

    for (const task of filteredTasks) {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card " + task.category;

        const taskDetails = document.createElement("div");
        taskDetails.className = "task-details";

        const taskText = document.createElement("div");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const dueDate = document.createElement("div");
        dueDate.className = "due-date";
        dueDate.textContent = "Due: " + task.dueDate;

        const closeButton = document.createElement("div");
        closeButton.className = "close-button";
        closeButton.innerHTML = "\u00d7";
        closeButton.onclick = function () {
            const index = tasks.indexOf(task);
            if (index !== -1) {
                tasks.splice(index, 1);
                renderTasks();
                saveData();
            }
        };
        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.textContent = "Edit";
        editButton.onclick = function () {
            editTask(task, taskText);
        };

        taskDetails.appendChild(taskText);
        taskDetails.appendChild(dueDate);

        taskCard.appendChild(taskDetails);
        taskCard.appendChild(editButton);
        taskCard.appendChild(closeButton);

        listContainer.appendChild(taskCard);
    }
}

function saveData() {
    localStorage.setItem("data", JSON.stringify(tasks));
}

function showTask() {
    const storedData = localStorage.getItem("data");
    if (storedData) {
        tasks = JSON.parse(storedData);
        tasks = sortTasks(tasks);
        renderTasks();
    }
}

function searchTasks() {
    const keyword = searchBox.value.toLowerCase();
    const taskCards = listContainer.getElementsByClassName("task-card");

    for (const taskCard of taskCards) {
        const taskText = taskCard.querySelector(".task-text").textContent.toLowerCase();
        if (taskText.includes(keyword)) {
            taskCard.style.display = "block";
        } else {
            taskCard.style.display = "none";
        }
    }
}
function editTask(task, taskTextElement) {
    const newText = prompt("Edit the task:", task.text);
    if (newText !== null) {
        task.text = newText;
        taskTextElement.textContent = newText; // Update the displayed text
        saveData();
    }
}

searchBox.addEventListener("keyup", searchTasks);

showTask();