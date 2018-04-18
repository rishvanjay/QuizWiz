

    
var config = {
    apiKey: "AIzaSyCVPd3bcv8m0zyutS12R-YznD-huOEH_S4",
    authDomain: "quizwiz-dda60.firebaseapp.com",
    databaseURL: "https://quizwiz-dda60.firebaseio.com",
    projectId: "quizwiz-dda60",
    storageBucket: "quizwiz-dda60.appspot.com",
    messagingSenderId: "429794970466"
  };
  firebase.initializeApp(config);



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
    var email = document.getElementById("uname").value;
    var password = document.getElementById("pwd").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        console.log(errorMessage);

        if (errorCode == 'auth/email-already-in-use') {
            alert('The email is aleady in use. Try a new email.');
          }

        // ...
      });

}



window.onload = windowLoad;