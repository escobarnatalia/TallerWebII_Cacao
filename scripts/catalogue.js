const downBtn = document.querySelectorAll('.filterform__btn');
const options = document.querySelectorAll('.filterform_options')
const productsList = document.querySelector('.productsList');
const admin =document.querySelector('.auth__profile')
let number = 0;
let selectedItem = null;
//firebase
const db = firebase.firestore();
const productsRef = db.collection("productos"); 
// Create a root reference
var storageRef = firebase.storage().ref();





  // lista filtros
for (let i = 0; i < downBtn.length; i++) {
downBtn[i].addEventListener('click', function(){
    if(number==0){
        options[i].classList.remove("hidden"); 
        number++;
    }
    else{
        options[i].classList.add("hidden");
        number=0;
    }
} )
}



  // creación de nuevos productos a partir de la lista
  function renderProducts (list) {
    console.log("PINTAR")
    productsList.innerHTML = '';
    list.forEach(function (elem) {
  
      const newProduct = document.createElement('div');
      console.log("render") 
      newProduct.classList.add('product');
      const url =`product.html?${elem.id}-${elem.title}`
      newProduct.setAttribute('href', url);
      
    
      newProduct.innerHTML = `
      <a href="${url}" class="link" >
      <img class="product__img" src="${elem.img}" alt="">
      </a>  
        <p class="product__title">${elem.title}</p>
        <p class="product__price">$ ${elem.price}</p>
        <p class="product__elem">${elem.nuts}</p>
        <p class="product__elem">Dark ${elem.dark}</p>
        <p class="product__elem">${elem.healthy}</p>
        <a href="${url}" class="link" >
        <button class="product__btn btn">SHOW MORE</button>
        </a>
        <button class="product__delete hidden showadmin">Eliminar</button>
        <button class="product__edit hidden showadmin">Editar</button>
   
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

      const editBtn = newProduct.querySelector('.product__edit');
      editBtn.addEventListener('click',function(){
        form.title.value=elem.title;
        //form.image.value=elem.img;
        form.price.value=elem.price;
        form.details.value=elem.details;
        selectedItem =elem;
      });
     
      if(userInfo && userInfo.admin) {
        deleteBtn.classList.remove('hidden');
        editBtn.classList.remove('hidden');


        admin.setAttribute('href', "index.html");

      }


    });
    
  }

  //leer productos de firebase
  let objectsList =[]
  function getProducts(){

    productsRef.get().then((querySnapshot) => {
       objectsList = [];
      querySnapshot.forEach((doc) => {
          const obj = doc.data();
          obj.id= doc.id;
          objectsList.push(obj);
          console.log(`${doc.id} => ${doc.data()}`);
      });
     renderProducts(objectsList);
     //loader.classList.remove("loader--show")
console.log(objectsList)
  });

  }

  getProducts();





  var imagePath ='';


// agregar nuevo producto
  const form = document.querySelector('.form__auth');
  form.addEventListener('submit', function (event) {
    event.preventDefault();

//para probar la subida de la imagen  
    const newProduct = {
      title: form.title.value,
      price: form.price.value,
      details: form.details.value,
      nuts: form.nuts.value,
      dark: form.dark.value,
     healthy: form.healthy.value,
      storageImg: imagePath,
     
    };

  //  loader.classList.add("loader--show");



    function handleThen(docRef) {
        
     getProducts();
      form.title.value = ''; 
      form.price.value = '';  
      form.details.value = '';
      form.nuts.value = '';
      form.dark.value = '';
      form.healthy.value = '';
      selectedItem =null;

  }



  function handleCatch  (error) {
    console.error("Error adding document: ", error);
}

// si existe, es decir que va a editar
    if(selectedItem){
      productsRef.doc(selectedItem.id).set(newProduct).
      then(handleThen)
    .catch(handleCatch);

    }
    else{
      
    //si no existe es porque es un nuevo producto


    productsRef.add(newProduct)
  .then(handleThen)
  .catch(handleCatch);
  }
  });

  form.imageFile.addEventListener('change', function(){
    // Create a reference to 'mountains.jpg'
        var newImageRef = storageRef.child(`productos/${Math.floor(Math.random()*999999999)}.png`);
    
        var file = form.imageFile.files[0];// use the Blob or File API
    
        // Create file metadata including the content type     
    // Upload the file and metadata
 
        newImageRef.put(file).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
      imagePath= snapshot.metadata.fullPath
    });
})

 //filtros

 const filterFormS = document.querySelector('.filterFormS');
  
 filterFormS.addEventListener('input', function() {
 
   let copy = objectsList.slice();
 
   const order = filterFormS.order.value;
   switch(order){
     case 'price_asc':
       copy.sort(function(a, b){
         return a.price - b.price;
       });
       break;
     case 'price_desc':
       copy.sort(function(a, b){
         return b.price - a.price;
       });
       break;

       case 'alfabeticA':
         copy.sort(function (a, b) {
           return a.title.localeCompare(b.title);
         });
         break;

         case 'alfabeticZ':
           copy.sort(function (a, b) {
             return b.title.localeCompare(a.title);
           });
           break;

   }

   renderProducts(copy);
 });
   
  const filterForm = document.querySelector('.filterform');

  filterForm.addEventListener('input', function() {
 
 //nuts
    let copy = objectsList.slice();
   const nutsFilter = filterForm.nuts.value;
   if(nutsFilter != '') {
     copy = copy.filter(function(elem){
       if(elem.nuts===nutsFilter) {

         return true;
       }
       return false;
     });
   }
//dark
   const darkFilter = filterForm.dark.value;
   if(darkFilter != '') {
     copy = copy.filter(function(elem){
       if(elem.dark===darkFilter) {

         return true;
       }
       return false;
     });
   }
   //healthy
   const healthyFilter = filterForm.healthy.value;
   if(healthyFilter != '') {
     copy = copy.filter(function(elem){
       if(elem.healthy===healthyFilter) {

         return true;
       }
       return false;
     });
   }


   renderProducts(copy);
  });
  
/*
/*
   const conectivityFilter = filterForm.conectivity.value;
   if(conectivityFilter != '') {
     copy = copy.filter(function(elem){
       if(elem.conectivity===conectivityFilter) {
         return true;
       }
       return false;
     });
   }

   const colorFilter = filterForm.color.value;
   if(colorFilter != '') {
     copy = copy.filter(function(elem){
       if(elem.color===colorFilter) {
         return true;
       }
       return false;
     });
   }
   
   renderProducts(copy);
 });

*/
