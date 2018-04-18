// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function windowLoad() {

    //adding an on click listener to login button
    document.getElementById("login").addEventListener("click", onLogin);
}

function onLogin() {
    //get text from textfields
    //call firebase function
    console.log("logging in");
    console.log(document.getElementById("uname").value);
    console.log(document.getElementById("pwd").value);
    

}

window.onload = windowLoad;