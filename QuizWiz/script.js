

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

var cur = null;



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
        
        
   /* }else{
        firebase.auth().signOut().then(function() {
            console.log('Signed Out');
        }, function(error) {
            console.error('Sign Out Error', error);
        });
        //console.log(firebase.auth().currentUser.uid);
    }*/

    if(window.location.href.indexOf("main") > -1){
        //document.getElementById('welcome').innerHTML = "Welcome, " + cur.displayName;
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
        firebase.database().ref('users').child(user.uid).child("score").set(0);
        firebase.database().ref('users').child(user.uid).child("curQ").set(1);
        user.updateProfile({
            displayName: name      
        })
        .then(function() {
            console.log("display name updated");
            window.location.href = "main.html";
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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        //cur = user;
        if(window.location.href.indexOf("main") > -1){
            console.log('uid',user.uid);
            mainPage(user);
            //document.getElementById('welcome').innerHTML = "Welcome, " + user.displayName;
        }else{
            //window.location.href = "main.html";
        }
    } else {
        // No user is signed in.
        console.log("sample fail");
    }               
});

function mainPage(user){
    document.getElementById('welcome').innerHTML = "Welcome, " + user.displayName;
    var scoreRef = firebase.database().ref('users/' + user.uid + '/score');//.child(user.uid).child();
    var qRef = firebase.database().ref('users/' + user.uid + '/curQ');
    var tRef = firebase.database().ref('users/' + user.uid + '/totalTime');
    scoreRef.on('value', function(snapshot) {
        document.getElementById('score2').innerHTML = snapshot.val();
    });
    cur = user;
    //qRef.
    //tRef.
}

function signOut(){
    firebase.auth().signOut()
    .then(function() {
            console.log('Signed Out');
            window.location.href = "index.html";
    }, function(error) {
            console.error('Sign Out Error', error);
    });
}

function startQuiz(){
    document.getElementById('quizModal').style.display = "block";

    //Serve up the current question if it's not submitted, the next if it is

    firebase.database().ref('users/' + cur.uid + '/curQ').once('value', function(snapshot1){
        console.log('curQ',snapshot1.val());

        //Look for question timestamp, and create one if there isn't one
        firebase.database().ref('users/' + cur.uid + '/timestamp').once('value', function(snapshot2){
            var qnum = snapshot1.val();
            if (snapshot2.val() === null){
                qnum++;
                firebase.database().ref('users').child(cur.uid).child("curQ").set(snapshot2.val() + 1);
                firebase.database().ref('users').child(cur.uid).child("timestamp").set(new Date());
            }

            document.getElementById('qNo').innerHTML = qnum;

            if(snapshot1.val() < 10){
                displayQuestions(snapshot1);
            }else{
                displayFinished(snapshot1);
            }
        });
    });
    
/*    document.getElementById('startQuiz').innerHTML = "Continue Quiz";
    var i = 0;
    for(i = 1; i <= 10; i++){
        var div = document.createElement('div');
        div.className = 'modal';
        div.id='m' + i;
        div.innerHTML = '<div class="modal-content animate">\
                            <div class="imgcontainer">\
                                <span onclick="document.getElementById(\'id04\').style.display='none'" class="close" title="Close Modal">&times;</span>\
                            </div>\
                            <div class="container">\
                                <label id="reset2"><b>An email containing password reset link has been sent to your email id </b></label>\
                            </div>\
                            <div class="container" style="background-color:#f1f1f1">\
                                <button type="button" onclick="document.getElementById('id04').style.display='none'" class="cancelbtn">OKAY</button>\
                            </div>\
                        </div>';
        document.getElementById("quizModals").appendChild();
    }
*/
}

function next(){
    firebase.database().ref('users/' + cur.uid + '/curQ').once('value', function(snapshot1){
        var radios = document.getElementsByName('options');

        firebase.database().ref('answers/' + snapshot1.val()).once('value', function(snapshot3){
            //increase score if correct option selected
            if (radios[snapshot3.val() - 1].checked){
                firebase.database().ref('users/' + cur.uid + '/score').once('value', function(snapshot2){
                    firebase.database().ref('users').child(cur.uid).child("score").set(snapshot2.val() + 1);
                });
            }
            firebase.database().ref('users/' + cur.uid + '/timestamp').once('value', function(snapshot2){
                firebase.database().ref('users').child(cur.uid).child("timestamp").set(new Date());
                firebase.database().ref('users').child(cur.uid).child("curQ").set(snapshot1.val() + 1);
                document.getElementById('qNo').innerHTML = snapshot1.val() + 1;
    
                if(snapshot1.val() < 10){
                    displayQuestions(snapshot1);
                }else{
                    displayFinished(snapshot1);
                }
            });
        });

        /*
        //increase currentQuestion count if not last question
        if(snapshot1.val() < 10){
            firebase.database().ref('users').child(cur.uid).child("curQ").set(snapshot1.val() + 1);
            document.getElementById('qNo').innerHTML = snapshot1.val() + 1;
            firebase.database().ref('questions/' + (snapshot1.val() + 1)).once('value', function(snapshot2){
                document.getElementById('question').innerHTML = snapshot2.child('question').val();
                document.getElementById('opt1').innerHTML = snapshot2.child('options').child(0).val();
                document.getElementById('opt2').innerHTML = snapshot2.child('options').child(1).val();
                document.getElementById('opt3').innerHTML = snapshot2.child('options').child(2).val();
                document.getElementById('opt4').innerHTML = snapshot2.child('options').child(3).val();
                firebase.database().ref('users/' + cur.uid + '/score').once('value', function(snapshot3){
                    document.getElementById('score').innerHTML = snapshot3.val();
                });

            });

        }else{
            //when all questions are done
            firebase.database().ref('users/' + cur.uid + '/score').once('value', function(snapshot3){
                    document.getElementById('question').innerHTML = "Your final score is: " + snapshot3.val();
                    document.getElementById('answers').style.display = "none";
                    document.getElementById('opt1').style.display = "none";
                    document.getElementById('opt2').style.display = "none";
                    document.getElementById('opt3').style.display = "none";
                    document.getElementById('opt4').style.display = "none";
                    document.getElementById('score').style.display = "none";
                    document.getElementById('submit').style.display = "none";
                    //Don't serve up the buttons
            });
        }
        */

    });
}

function displayQuestions(snapshot1) {
    var radios = document.getElementsByName('options');
    document.getElementById('qNo').innerHTML = snapshot1.val() + 1;
    document.getElementById('submit').style.display = "inline";
    document.getElementById('saveclose').style.display = "inline";
    firebase.database().ref('questions/' + (snapshot1.val()+1)).once('value', function(snapshot2){
        document.getElementById('question').innerHTML = snapshot2.child('question').val();
        document.getElementById('opt1').innerHTML = snapshot2.child('options').child(0).val();
        document.getElementById('opt2').innerHTML = snapshot2.child('options').child(1).val();
        document.getElementById('opt3').innerHTML = snapshot2.child('options').child(2).val();
        document.getElementById('opt4').innerHTML = snapshot2.child('options').child(3).val();
        firebase.database().ref('users/' + cur.uid + '/score').once('value', function(snapshot3){
            document.getElementById('score').innerHTML = snapshot3.val();
        });

    });
}

function displayFinished(snapshot1) {
    firebase.database().ref('users/' + cur.uid + '/score').once('value', function(snapshot2){
        document.getElementById('question').innerHTML = "Your final score is: " + snapshot2.val();
        document.getElementById('answers').style.display = "none";
        document.getElementById('opt1').style.display = "none";
        document.getElementById('opt2').style.display = "none";
        document.getElementById('opt3').style.display = "none";
        document.getElementById('opt4').style.display = "none";
        document.getElementById('score').style.display = "none";
        document.getElementById('submit').style.display = "none";
        document.getElementById('saveclose').style.display = "none";
    });
}



window.onload = windowLoad;
