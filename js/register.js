function checkConfirmPassword() {
    const password = document.getElementById("password").value ;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if(password!=confirmPassword) {
        alert("Password and confirm password does not match");
        window.location.reload();
        return false;
    }
    return true;
}
async function postRegisterRequest() {
    const data = {
        name:"",
        email:"",
        password:"",
        phone:""
    }
     data.password = document.getElementById("password").value ;
     data.name = document.getElementById("name").value;
     data.email= document.getElementById("email").value;
     data.phone = document.getElementById("phone").value;
     const jsonString = JSON.stringify(data);
     const response = await fetch("http://localhost:8080/register",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:jsonString
     });
     if(response.ok) {
        alert("Register success");
        window.location.href="index.html"
     } 
     else {
        if(response.status==409) {
            alert("Email already exist");
        } 
        if(response.status ==400) {
            alert("Invalid information (email, password, phone)");
        } 
        if(response.status==500) {
            alert("Internal server error");
        }
        window.location.reload();
     }
}
document.getElementById("submit").addEventListener("click",e=>{
    e.preventDefault();
    if(checkConfirmPassword()) {
        postRegisterRequest();
    }
})