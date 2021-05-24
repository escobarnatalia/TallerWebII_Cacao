const burguer = document.querySelector('.hero__burguer');
const menu = document.querySelector('.hero__menu');
var menuN = 0;

burguer.addEventListener('click', function(){

    if(menuN==0){
        menu.classList.remove("hidden"); 
        menuN++;
    }else{
        menu.classList.add("hidden");
        menuN=0;
    }
    

} )