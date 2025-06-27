const beEndpont ="http://localhost:8080/";
const token = localStorage.getItem("token");
async function fetchFromServer() {
    const taskId = localStorage.getItem("current-taskId");
    const response = await fetch(beEndpont+"task/"+taskId,{
        method:"GET",
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+token
        }
    });
    if(!response.ok){
        alert("Some thing went wrong, please try again");
        window.location.href="dashboard.html";
        return;
    } 
    const data= await response.json();
    document.getElementById("task-name").innerHTML=data.name;
    document.getElementById("task-start").innerHTML=formatDateTime(data.startTime);
    document.getElementById("task-end").innerHTML=formatDateTime(data.endTime);
    document.getElementById("task-description").innerHTML=data.description;
    document.getElementById("task-complete").innerHTML= data.completeTime?formatDateTime(data.completeTime):'Uncomplete';
} 
function formatDateTime(isoString) {
    const date = new Date(isoString);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
} 
fetchFromServer();