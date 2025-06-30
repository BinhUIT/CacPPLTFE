const beEndpont = "http://localhost:8080/";
const token = localStorage.getItem("token");
const listUncompleteTask = [];
function updateClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  const timeString = now.toLocaleTimeString("en-GB", { hour12: false });
  clock.textContent = timeString;
}

function showStartSessionPopup() {
  document.getElementById("startSessionPopup").style.display = "flex";
}
showStartSessionPopup();
function confirmStartSession() {
  setInterval(updateClock, 1000);
  updateClock();
  document.getElementById("startSessionPopup").style.display = "none";
}
async function startSession() {
  const response = await fetch(beEndpont + "start_session", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + tokenup,
    },
  });
  if (!response.ok) {
    alert("Start session failed, try again");
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("startSessionPopup").style.display = "none";
    setInterval(updateClock, 1000);
    updateClock();
  }
}
async function doNotStartSession() {
  window.location.href = "dashboard.html";
}
function onClickEndSession() {
  document.getElementById("endSessionPopup").style.display = "flex";
}
async function confirmEndSession() {
  const res = await updateTaskBeforeEndSession();
  if (!res) {
    alert("Fail to update task's progress");
  }
  const response = await fetch(beEndpont + "end_session", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (response.ok) {
    window.location.href = "dashboard.html";
  } else {
    alert("End session failed");
    window.location.href = "dashboard.html";
  }
}
async function getAllTask() {
  const response = await fetch(beEndpont + "all_task", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (response.ok) {
    const responseData = await response.json();
    for (let i = 0; i < responseData.length; i++) {
      if (responseData[i].currentProgress < 1) {
        listUncompleteTask.push(responseData[i]);
      }
    }
  }
}
async function displayAndSetUptoUI() {
  await getAllTask();
  const taskList = document.getElementById("task-list");
  for (let i = 0; i < listUncompleteTask.length; i++) {
    const currentTask = listUncompleteTask[i];
    const taskTag = document.createElement("div");
    taskTag.setAttribute("class", "task");
    taskList.appendChild(taskTag);
    const taskHeader = document.createElement("div");
    taskHeader.setAttribute("class", "task-header");
    taskTag.appendChild(taskHeader);
    const taskName = document.createElement("div");
    taskName.setAttribute("class", "task-name");
    taskName.innerHTML = currentTask.name;
    taskHeader.appendChild(taskName);
    const progressBar = document.createElement("div");
    progressBar.setAttribute("class", "progress-bar");
    taskTag.appendChild(progressBar);
    const progress = document.createElement("div");
    progressBar.appendChild(progress);
    progress.setAttribute("class", "progress");
    const currentProgress = currentTask.currentProgress / currentTask.progress;
    progress.style.width = currentProgress * 100 + "%";
    const progressInputContainer = document.createElement("div");
    progressInputContainer.setAttribute("class", "progress-input-container");
    taskTag.appendChild(progressInputContainer);
    const progressInput = document.createElement("input");
    progressInputContainer.appendChild(progressInput);
    progressInput.setAttribute("type", "number");
    progressInput.setAttribute("min", currentProgress * 100);
    progressInput.setAttribute("max", 100);
    progressInput.setAttribute("value", currentProgress * 100);
    progressInput.setAttribute("class", "progress-input");
    progressInput.oninput = function () {
      const value = parseInt(this.value);
      console.log(value / 100);
      console.log(value + "%");
      progress.style.width = value + "%";
      currentTask.currentProgress = value / 100;
      console.log(value);
    };
  }
}
async function updateTaskBeforeEndSession() {
  const updateData = listUncompleteTask.map((item, index) => {
    return {
      taskId: item.taskId,
      completeProgress: item.currentProgress,
    };
  });
  for (let i = 0; i < listUncompleteTask.length; i++) {
    console.log(updateData);
  }
  const response = await fetch(beEndpont + "update/many_progress", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(updateData),
  });
  if (response.ok) {
    return true;
  }
  return false;
}

displayAndSetUptoUI();
