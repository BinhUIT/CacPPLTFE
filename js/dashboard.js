const beEndpont = "http://localhost:8080/";
const token = localStorage.getItem("token");
function loadUsername() {
  const username = localStorage.getItem("username");
  document.getElementById("username").innerHTML = username;
}
let taskIdWantToDelete = -1;
loadUsername();
async function loadTask() {
  const response = await fetch(beEndpont + "all_task", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (response.ok) {
    const responseData = await response.json();
    console.log(responseData);
    const taskListUL = document.getElementById("task-list");
    for (let i = 0; i < responseData.length; i++) {
      const liTag = document.createElement("li");
      taskListUL.appendChild(liTag);
      const taskName = document.createElement("span");
      const taskProgress = document.createElement("span");
      const taskDealine = document.createElement("span");
      const viewTag = document.createElement("button");
      taskName.innerHTML = responseData[i].name;
      taskProgress.innerHTML =
        (responseData[i].currentProgress / responseData[i].progress) * 100 +
        "%";
      taskDealine.innerHTML = formatDateTime(responseData[i].endTime);
      viewTag.innerHTML = "View";
      viewTag.setAttribute("class", "view-task-link");
      liTag.appendChild(taskName);
      liTag.appendChild(taskProgress);
      liTag.appendChild(taskDealine);
      liTag.appendChild(viewTag);
      viewTag.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.setItem("current-taskId", responseData[i].taskId);
        window.location.href = "taskDetail.html";
      });
      if (responseData[i].currentProgress < 1) {
        const updateTask = document.createElement("button");
        updateTask.innerHTML = "Update";
        updateTask.setAttribute("class", "view-task-link");
        updateTask.style.background = "yellow";
        updateTask.style.color = "black";
        updateTask.addEventListener("click", function (e) {
          localStorage.setItem("current-taskId", responseData[i].taskId);
          window.location.href = "updateTask.html";
        });
        liTag.appendChild(updateTask);
      }
      if (responseData[i].currentProgress < 1) {
        const deleteTask = document.createElement("button");
        deleteTask.setAttribute("class", "view-task-link");
        deleteTask.style.background = "red";
        deleteTask.style.color = "white";
        taskIdWantToDelete = responseData[i].taskId;
        deleteTask.innerHTML = "Delete";
        deleteTask.addEventListener("click", (e) => {
          e.preventDefault();
          document.getElementById("delete-popup").style.display = "flex";
        });
        liTag.appendChild(deleteTask);
      }
    }
  } else {
    alert("Something went wrong");
    window.location.href = "index.html";
  }
}
async function loadCompletedTasksCount() {
  const response = await fetch(beEndpont + "complete_task", {
    // <-- Adjust this endpoint to match your Spring Boot API
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (response.ok) {
    const completedTasks = await response.json();
    console.log("Completed tasks:", completedTasks);
    const count = completedTasks.length; // Get the size of the array

    const completedCountElement = document
      .getElementById("completed_count")
      .querySelector("span");
    if (completedCountElement) {
      completedCountElement.textContent = count;
    } else {
      console.warn("Element with ID 'completed_count' or its span not found.");
    }
  } else {
    console.error(
      "Failed to fetch completed tasks count. Status:",
      response.status
    );
    const completedCountElement = document
      .getElementById("completed_count")
      .querySelector("span");
    if (completedCountElement) {
      completedCountElement.textContent = "Error";
    }
  }
}
async function loadTaskDueTo7Days() {
  const response = await fetch(beEndpont + "due_task_in_7_days", {
    // <-- Adjust this endpoint to match your Spring Boot API
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (response.ok) {
    const taskDueTo7Days = await response.json();
    console.log("Seven day tasks:", taskDueTo7Days);
    const count = taskDueTo7Days.length; // Get the size of the array

    const sevenDaysElement = document
      .getElementById("in_7_days")
      .querySelector("span");
    if (sevenDaysElement) {
      sevenDaysElement.textContent = count;
    } else {
      console.warn("Element with ID 'in_7_days' or its span not found.");
    }
  } else {
    console.error(
      "Failed to fetch completed tasks count. Status:",
      response.status
    );
    const sevenDaysElement = document
      .getElementById("completed_count")
      .querySelector("span");
    if (sevenDaysElement) {
      sevenDaysElement.textContent = "Error";
    }
  }
}

function formatDateTime(isoString) {
  const date = new Date(isoString);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}
function onNotDelete() {
  document.getElementById("delete-popup").style.display = "none";
  taskIdWantToDelete = -1;
}
document.getElementById("cancel-delete").addEventListener("click", (e) => {
  e.preventDefault();
  onNotDelete();
});
document
  .getElementById("confirm-delete")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const response = await fetch(
      beEndpont + "task/delete/" + taskIdWantToDelete,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    const responseMessage = await response.text();
    alert(responseMessage);
    window.location.reload();
  });
document.getElementById("logoutbutton").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("logoutPopup").style.display = "flex";
});
function logout() {
  localStorage.clear();
  window.location.href = "/index.html";
}
function doNotLogout() {
  document.getElementById("logoutPopup").style.display = "none";
}
loadTask();
loadCompletedTasksCount();
loadTaskDueTo7Days();
