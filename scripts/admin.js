const db = firebase.firestore();

const productsList = document.querySelector('.productList__box');

var userData = JSON.parse(localStorage.getItem("userId"));

var userId = userData.id;

const productsRef = db.collection('Pedidos')
var totalPrice = 0;
const loader = document.querySelector(".loader");
const total =document.querySelector(".total");
let selectedItem = null;

     // Create a root reference
     var storageRef = firebase.storage().ref();
    const btn =document.querySelector(".btn");

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
      
      <div class="product__info">
      <h3 class="product__title">${elem.title}</h3>
      <p class="product__price">$ ${elem.price}</p>
      <p class=""> ${elem.firstname}</p>
      <p class=""> ${elem.lastname}</p>
      <p class="">Dirección ${elem.direction}</p>
      <p class="">Tarjeta de crédito ${elem.credit}</p>
      <p class="">Email ${elem.email}</p>

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


    });
   
  }
 // console.log(elem.price)

    //leer los productos de firebase

  function getProducts(){


/*
    productsRef.where("id", "==", userId)
    .onSnapshot(function(querySnapshot) {
        var objects = [];
        querySnapshot.forEach(function(doc) {
           // cities.push(doc.data().name);
           const obj = doc.data();
          obj.id= doc.id;
          objects.push(obj);
          console.log(`${doc.id} => ${doc.data()}`);

        });
        renderProducts(objects);
       // console.log("Current cities in CA: ", cities.join(", "));
    });
*/


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


 