const beEndpont ="http://localhost:8080/";
const token = localStorage.getItem("token");
document.getElementById("user-name").value=localStorage.getItem("username");
document.getElementById("user-email").value = localStorage.getItem("useremail");
document.getElementById("user-phone").value=localStorage.getItem("userphone");
document.getElementById("submit").addEventListener("click",async(e)=>{
    e.preventDefault();
    const request = {
        name:document.getElementById("user-name").value,
        email:document.getElementById("user-email").value,
        phone:document.getElementById("user-phone").value

    }
    const response = await fetch(beEndpont+"update/user",{
        method:"PUT",
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+token
        },
        body:JSON.stringify(request)
    });
    if(response.ok) {
        alert("Update info success");
        localStorage.setItem("username",request.name);
        localStorage.setItem("useremail",request.email);
        localStorage.setItem("userphone",request.phone);
    }
    else {
        alert("Update info fail");
    }
    window.location.href="dashboard.html";
}); 
document.getElementById("logoutbutton").addEventListener("click",e=>{
    e.preventDefault();
    document.getElementById("logoutPopup").style.display="flex";
});
function logout(){
    localStorage.clear();
    window.location.href="./index.html";
}
function doNotLogout() {
    document.getElementById("logoutPopup").style.display="none";
}