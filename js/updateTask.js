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
   document.getElementById("name").value=data.name;
   document.getElementById("description").value=data.description;
   console.log(data.endTime);
   document.getElementById("endTime").value=toDatetimeLocalFormat(data.endTime);
   document.getElementById("submit").addEventListener("click",async (e)=> {
    e.preventDefault();
     const taskId = localStorage.getItem("current-taskId");
     const rdata = {
        taskId:taskId,
        name:document.getElementById("name").value,
        description:document.getElementById("description").value,
        endTime:document.getElementById("endTime").value
     }
     const response = await fetch(beEndpont+"task/update",{
        method:"PUT",
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+token
        },
        body:JSON.stringify(rdata)
     });
     if(response.ok) {
        alert("Update success");
        window.location.href="dashboard.html";
        return;
     }
     if(response.status==404) {
        alert("Task does not exist");
        window.location.href="dashboard.html";
        return;
     }
     alert("Error in server");
        window.location.href="dashboard.html";

   })
} 
function toDatetimeLocalFormat(isoString) {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
fetchFromServer();