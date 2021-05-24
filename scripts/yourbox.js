const db = firebase.firestore();

const productsList = document.querySelector('.productList__box');

var userData = JSON.parse(localStorage.getItem("userId"));

var userId = userData.id;
const productsRef = db.collection('users').doc(userId).collection('carrito')
let totalPrice=0;
const loader = document.querySelector(".loader");
const total =document.querySelector(".total");
let selectedItem = null;

     // Create a root reference
     var storageRef = firebase.storage().ref();
    const btn =document.querySelector(".totalSect__btn");

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
        <button class="product__delete ">Eliminar</button>
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



      //eliminar producto
            const deleteBtn = newProduct.querySelector('.product__delete');

            deleteBtn.addEventListener('click',function(){
        
        
              productsRef.doc(elem.id).delete().then(function() {
                  getProducts();
        
                  console.log("Document successfully deleted!");
              }).catch(function(error) {
                  console.error("Error removing document: ", error);
              });
              })

      

      productsList.appendChild(newProduct);

     
      totalPrice += parseInt(elem.price);

      console.log(totalPrice)
      total.innerText = `$ ${totalPrice}`;

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


 // 
 btn.addEventListener('click',function(){
location.href='checkout.html';
 });
 



