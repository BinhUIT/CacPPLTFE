async function postLoginRequest(data) {
    const response = await fetch("http://localhost:8080/login",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify(data)
    });
    if(response.ok) {
        const responseData= await response.json();
        console.log(responseData);
        localStorage.setItem("token",responseData.token);
        localStorage.setItem("username",responseData.user.name);
        localStorage.setItem("useremail", responseData.user.email);
        localStorage.setItem("userphone", responseData.user.phone);
        localStorage.setItem("userId", responseData.userId);
        window.location.href="dashboard.html";
    } 
    else {
        alert("Login Failed");
        window.location.reload();
    }
}
document.getElementById("submit").addEventListener("click",e=>{
    e.preventDefault();
    const data = {
        email:document.getElementById("email").value,
        password:document.getElementById("password").value
    };
    postLoginRequest(data);
    
});
