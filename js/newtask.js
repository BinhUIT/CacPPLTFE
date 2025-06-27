const beEndpont ="http://localhost:8080/";
const token = localStorage.getItem("token");
if(!token||token=="") {
    window.location.href="login.html";
}

async function createTask(){
    const data = {
        name: document.getElementById("name").value,
        startTime:document.getElementById("startTime").value,
        endTime:document.getElementById("endTime").value,
        description:document.getElementById("description").value
    };
    const response = await fetch(beEndpont+"create/new_task",{
        method:"POST",
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+token
        },
        body:JSON.stringify(data)
    });
    if(response.ok) {
        alert("Create task success");
        window.location.href="dashboard.html"
    } 
    else {
        if(response.status==400) {
            alert("Invalid start and end time");
            window.location.reload();
        } 
        else {
            alert("Internal server error");
            window.location.reload();
        }
    }
    
}
document.getElementById("submit").addEventListener("click",e=>{
    e.preventDefault();
    createTask();
})