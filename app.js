//gsap
// gsap preloader 
let ld = gsap.timeline();
ld.from(".preloader__top",0.7,{ width: "0%", },0.5)
ld.from(".preloader__low",0.7, { width: "0%", },0.5)
ld.to(".preloader__top",0.7,{y:-50, },"+=0.5")
ld.to(".preloader__text",0.7,{scaleY:1, },"+=0.5")
ld.to(".preloader__icon",0.2,{scale:1.2, },"+=0.1")
ld.to(".preloader",0.5,{y:"-100%", },"+=0.4")
ld.from(".search__text",0.5,{scaleY:0, },"+=0.4")

//gsap loader
let tl = gsap.timeline();
tl.to(".search__images-arrow", 0.5, { right: "-100%", }, 0)
tl.to(".search__images-sky", 0.5, { left: "-100%", }, 0)
tl.to(".search__images-future", 0.5, { left: "-100%", }, 0)
tl.to(".search__images-gucci", 0.5, { right: "-100%", }, 0)
tl.to(".search__images-girl", 0.5, { scaleY: 0, })
tl.pause()

// fetch set
const options = {
  method: 'GET',
  headers: {
    Authorization: '563492ad6f91700001000001802d53788a6c4bfab6f2a71f8051d161',
    "Content-Type": "application/json"
  }
};



function sendRequest(options, url, body = null) {
  return fetch(url, options).then(response => {
    return response.json()
  })
}


// loading photos 
const searchBtn = document.querySelector(".search__btn")
const mainImg = document.querySelector(".search__images")
const loader = document.querySelector(".search__loader")
const input = document.querySelector(".search__input-search")
const loadBtn = document.querySelector(".gallery__btn")
const htmlEl = document.querySelector(".gallery__items")
let pageNumber = 1;

async function loadPhotos(input) {
  const reqUrl = `https://api.pexels.com/v1/search?query=${input}&per_page=10&page=${pageNumber}`
  const data = await sendRequest(options, reqUrl)
  // check data result
  if (data.total_results === 0) {
    // display error msg
    htmlEl.innerHTML = `<div class="gallery__error"><i class='bx bx-search-alt gallery__error-icon'></i>Sorry,nothing found  <span class="gallery__error-txt"> "${input}"<span></div>`
  }
  // check load more btn
  if (data.total_results > 10) loadBtn.classList.add("active")
  if (loadBtn.classList.contains("active") && data.photos.length === 0) {
    //display more btn
    loadBtn.classList.remove("active")
    htmlEl.innerHTML += `<div class="gallery__msg"><i class='bx bx-search-alt gallery__error-icon'></i>All images loaded</div>`
  }

  displayImages(data)

}

// display img
function displayImages(data) {

  data.photos.forEach(photo => {
    htmlEl.innerHTML += `
                    <div class="gallery__item">
                        <div class="gallery__item-wrapper">
                            <img class="gallery__item-img" src="${photo.src.medium}" alt="">
                            <i data-id="${photo.id}"class='bx bx-heart gallery__item-icon'></i>
                        </div>
                    </div>`


  });
  //get all btns
  getBtns()
}


// search

searchBtn.addEventListener("click", () => {
  // check first page animation
  if (!mainImg.classList.contains("hide")) tl.play()
  // check input
  if (!input.value) {
    // display msg
    htmlEl.innerHTML = `<div class="gallery__error"><i class='bx bx-search-alt gallery__error-icon'></i>Please enter a value.</div>`
  } else {
    //update counter / load next page
    pageNumber = 1;
    htmlEl.innerHTML = "";
    loader.classList.add("show")
    loadBtn.classList.remove("active")
    //loader animation off
    setTimeout(() => {
      loader.classList.remove("show")
    }, 1500)
    //load photos data
    loadPhotos(input.value)

  }
})
// load more imgs
if (loadBtn) {
  loadBtn.addEventListener("click", () => {
    pageNumber++;
    loadPhotos(input.value);
  })
}

// ==== LIKED COLLECTION ====
let collection = []
// check localstorage
let storage = JSON.parse(localStorage.getItem("collection"))
if(storage){
 collection = [...storage]
}


//get like btns
function getBtns(){
   const likeBtn = document.querySelectorAll(".gallery__item-icon")
   likeBtn.forEach((btn)=>{
     btn.addEventListener("click",(e)=>{
       let nodeList = e.target.parentElement.childNodes
       let imgSrc = nodeList[1].getAttribute("src")
       let imgs = {
         id:e.target.dataset.id,
         img:imgSrc,
       }
       collection =[...collection,imgs]
       //// add to storage
       addStorage()
      
      
     })
   })
}
// likes collection toggle 

let likeToggle = document.querySelector(".header__nav-like")
let likePage = document.querySelector(".collection")
let closeBtn = document.querySelector(".collection__close")

likeToggle.addEventListener("click",()=>{
  likePage.classList.add("active")
  displayCollecion();
  // get delete btns
  delItem()
})
closeBtn.addEventListener("click",()=>{
  likePage.classList.remove("active")
})

//add to localstorage
function addStorage(){
   localStorage.setItem("collection", JSON.stringify(collection))
}

// display liked imgs
function displayCollecion(){
  let collectionGallery = document.querySelector(".collection__items")
  let items = collection.map((img)=>{

    return `<div class="collection__item">
    <img src="${img.img}" alt="">
    <i data-id="${img.id}"class='bx bx-x-circle collection__item-del' ></i>
</div>`
    
  })
  items = items.join("")
  collectionGallery.innerHTML = items;
}


// delete item 

function delItem(){
  let delBtn = document.querySelectorAll(".collection__item-del");
//get all btn 
delBtn.forEach((btn)=>{
  btn.addEventListener("click",(e)=>{
    //filter delete item
    let id = e.target.dataset.id
    let filterCollection = collection.filter((photos)=> photos.id !== id)
    localStorage.setItem("collection", JSON.stringify(filterCollection))
    collection = [...filterCollection]
    // update item list
    displayCollecion();
  })
})
}

