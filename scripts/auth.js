const auth = document.querySelector('.auth');
const authWith = auth.querySelector('.auth__with');
const authWithout = auth.querySelector('.auth__without');
const authProfileSpan = auth.querySelector('.auth__profile span');
const authSignout = auth.querySelector('.auth__signout');

var userInfo;

firebase.auth().onAuthStateChanged(function(user) {
    console.log(user);

    if(user) {
        // si el usuario existe quiere decir que inició sesión, se registró o ya tenía sesión iniciada
        authWith.classList.remove('hidden');
        authWithout.classList.add('hidden');
    
        const db = firebase.firestore();
        const usersRef = db.collection('users');
        usersRef.doc(user.uid).get().then(function (doc) {

          if(doc.exists) {
            const data = doc.data();
            userInfo = data;
            authProfileSpan.innerText = data.firstname;
            console.log(user.uid)
    
            if(data.admin) {
              const showAdmin = document.querySelectorAll('.showadmin');
              showAdmin.forEach(function(elem) {
                elem.classList.remove('hidden');
              });
            }

            var users ={
              id: user.uid,
              firstname : data.firstname,
              lastname : data.lastname,
              direction : data.direction,
              credit: data.credit,
              email : data.email
            }

            var jsonUser = JSON.stringify(users);

            window.localStorage.setItem("userId", jsonUser);
          }
        });
      } else {
        // si no existe quiere decir que no ha iniciado sesión o acaba de cerrar sesión
        authWith.classList.add('hidden');
        authWithout.classList.remove('hidden');

      }
     // window.localStorage.setItem('userId', user.uid);


  });

  // cerrar sesión
authSignout.addEventListener('click', function(event) {
    event.preventDefault();
    location.reload();
    window.localStorage.removeItem('userId');
    firebase.auth().signOut();

  });