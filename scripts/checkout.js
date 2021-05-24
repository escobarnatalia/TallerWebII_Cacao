
const db = firebase.firestore();
const productsList = document.querySelector('.productList__box');


var userData = JSON.parse(localStorage.getItem("userId"));

var userId = userData.id;

var productsRef = db.collection('users').doc(userId).collection('carrito');
let totalPrice = 0;
const name = document.querySelector('.name');
const loader = document.querySelector(".loader");
const total =document.querySelector(".total");
const btn = document.querySelector(".btn");
let confirmarPedido = false;
let pedido=[];
const direction = document.querySelector('.direction');
const credit = document.querySelector('.credit');




//var userInfo = db.collection('users').doc(userId);


var pedidosUsers = db.collection('Pedidos');
    // Create a root reference
    var storageRef = firebase.storage().ref();
    //agregar a lalista de pedidos y carrito
var userInfo = db.collection('users').doc(userId);



    if(userId!=null){
      var carritoUser = db.collection('users').doc(userId).collection('carrito');
    }
    //leer los ususarios de firebase

    function getUsers(){

      userInfo.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            var user= doc.data();
            console.log(user.lastname)

            var temp = {
          
              firstname: user.firstname,
              lastname :user.lastname,
              direction :user.direction,
              credit: user.credit
            }

            direction.innerText= user.direction;
            credit.innerText=user.credit;
           // userData.push(temp)
            console.log(temp.firstname)
            //nombre=userData[0].firstname;
            name.innerText = temp.firstname+" "+ temp.lastname;


        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    }

    
    
    getUsers();
  console.log(userData.firstname)
    



    



  



  // creación de nuevos productos a partir de la lista
  function renderProducts (list) {
    productsList.innerHTML = '';
    list.forEach(function (elem) {
      const newProduct = document.createElement('div');
      newProduct.classList.add('product');
      const url =`producto.html?${elem.id}-${elem.title}`
      newProduct.setAttribute('href', url);
   
      newProduct.innerHTML = `

      
      
      <div class="product__box">
      <img class="product__img" src="${elem.img}" alt="">
      
      <div class="product__info ">
        <h3 class="product__title">${elem.title}</h3>
        <p class="product__price">$ ${elem.price}</p>
        </div>
        
      </div>
        

      `;
      if(elem.storageImg) {
        storageRef.child(elem.storageImg).getDownloadURL().then(function(url) {
          // Or inserted into an <img> element:
          var img = newProduct.querySelector('img');
          img.src = url;
        }).catch(function(error) {
          // Handle any errors
        });
     
    } 
      
      productsList.appendChild(newProduct);

      totalPrice += parseInt(elem.price);

      console.log(totalPrice)
      total.innerText = `$ ${totalPrice}`;



      var compra= {
        id:userId,
        firstname: userData.firstname,
        lastname: userData.lastname,
        direction: userData.direction,
        credit:userData.credit,
        email: userData.email,  
        title: elem.title,
       // img: form.image.value,
        price: elem.price,
        storageImg: elem.storageImg
      };

      pedido.push(compra)
      
    });
   
  }
 // console.log(elem.price)

    //leer los productos de firebase

  function getProducts(){

    productsRef.get().then((querySnapshot) => {
      var objects = [];
      querySnapshot.forEach((doc) => {
          const obj = doc.data();
          obj.id= doc.id;
          objects.push(obj);
          console.log(`${doc.id} => ${doc.data()}`);
      });
      renderProducts(objects);
    // loader.classList.remove("loader--show")
  });

  }




  getProducts();

  var imagePath ='';
 // agregar pedido

  btn.addEventListener('click',function(){
    //console.log('hola');
    console.log(confirmarPedido)
    confirmarPedido=true;

    pedido.forEach((doc) => {
      pedidosUsers.add(doc).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);

        alert("Compra relizada con exito")
        location.href='catalogue.html';
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
  
    });
  });

  

  })

  console.log(pedido)

  btn.addEventListener('click',function(){
    //  location.href='perfil.html';
     });