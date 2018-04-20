

    
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
var modal2 = document.getElementById('id02');
var modal3 = document.getElementById('id03');
var modal4 = document.getElementById('id04');

//var cur = 0;



// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
    if (event.target == modal3) {
        modal3.style.display = "none";
    }
    if (event.target == modal4) {
        modal4.style.display = "none";
    }
}

function windowLoad() {

    //adding an on click listener to login button
    //document.getElementById("login").addEventListener("click", onLogin);
    //document.getElementById("create").addEventListener("click", onCreate);
    //document.getElementById("forgotPass").addEventListener("click", onForgot);
    //document.getElementById("sendReset").addEventListener("click", onReset);
    if(window.location.href.indexOf("main") > -1){
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                //cur = user;
                console.log('uid',user.uid);
                document.getElementById('welcome').innerHTML = "Welcome, " + user.displayName;
            } else {
                // No user is signed in.
                console.log("sample fail");
            }               
        });
        
    }else{
        firebase.auth().signOut().then(function() {
            console.log('Signed Out');
        }, function(error) {
            console.error('Sign Out Error', error);
        });
        //console.log(firebase.auth().currentUser.uid);
    }
}

function onCreate() {
    //get text from textfields
    //call firebase function
    //console.log("Creating");
    //console.log(document.getElementById("uname2").value);
    //console.log(document.getElementById("pwd2").value);
    var email = document.getElementById("uname2").value;
    var password = document.getElementById("pwd2").value;


    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(user){
        //console.log('uid',user.uid);
        var name = document.getElementById("nameID").value;
        firebase.database().ref('users').child(user.uid).child(name).set(0);
        user.updateProfile({
            displayName: name      
        })
        .then(function() {
            console.log("display name updated");
        })
        .catch(function(error) {
            console.log("display name NOT updated");
        });
        modal2.style.display = "none";
        //window.location.href = "main.html";
    })
    .catch(function(error) {
        if(error.code != 18){
            alert(error.message);
            return null;
        }else{
            console.log("YUPPPPP");
        }
    });

    //window.location.href = "main.html";

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .catch(function(error) {
        console.log(error.message);
    });
}


function onLogin() {

    var email = document.getElementById("uname").value;
    var password = document.getElementById("pwd").value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(user) {
        window.location.href = "main.html";
    })
    .catch(function(error) {
        console.log(error.code);
        if (error.code == 'auth/user-not-found') {
            alert('There is no existing account with this email. Please create a new account.');
        }
        else if (error.code == 'auth/wrong-password'){
            alert('You have entered an incorrect password. Please enter the password again');
        }
        else if(error.code != 18){
            alert(error.message);
        }
    });

}

function onForgot(){
    modal.style.display = "none";
    modal3.style.display = "block";
}
        
function onReset(){
    firebase.auth().sendPasswordResetEmail(document.getElementById("uname3").value)
    .then(function() {
        modal3.style.display = "none";
        document.getElementById("reset2").innerHTML = "An email containing password reset link has been sent to your email id ";
        modal4.style.display = "block";
    })  
    .catch(function(error) {
        modal3.style.display = "none";
        document.getElementById("reset2").innerHTML = error.message;
        modal4.style.display = "block";
    });
}





window.onload = windowLoad;
