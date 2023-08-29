const firebaseConfig = {
    apiKey: "AIzaSyApPcPxkZzu-iGxbX7k7RpqgLKhoJaC3fI",
    authDomain: "spawtest-39058.firebaseapp.com",
    databaseURL: "https://spawtest-39058-default-rtdb.firebaseio.com",
    projectId: "spawtest-39058",
    storageBucket: "spawtest-39058.appspot.com",
    messagingSenderId: "787760711143",
    appId: "1:787760711143:web:a1197cbd9e9479de552942"
  };

  //initialize firebase
  firebase.initializeApp(firebaseConfig);

  // reference for database
  var spawtestDB = firebase.database().ref('spawtest')

document.getElementById('spawtest').addEventListener('submit', submitForm);


function submitForm(e){
    e.preventDefault();

    var name = getElementVal('name');
    var email = getElementVal('email');

    saveMessages(name, email);

    // enable alert
    document.querySelector('.alert').style.display = 'block';

    // remove the alert
    setTimeout(()=>{
        document.querySelector('.alert').style.display = 'none';
    }, 3000
    )
    
    document.getElementById("spawtest").reset()
}


const saveMessages = (name, email) => {
    var newForm = spawtestDB.push();

    newForm.set({
        name : name,
        email : email,
    })
};

const getElementVal = (id) =>  {
    return document.getElementById(id).value;
};