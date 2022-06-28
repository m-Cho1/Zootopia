const $refreshBtn = document.querySelector('#refresh-btn');
const $ul = document.querySelector('#animal-list');
const $favoriteBtn = document.querySelector('#favorites-btn');
const $favoriteUl = document.querySelector('#favorites-list');
const $noFavMessage = document.querySelector('#no-favorite-message');
const $modalText = document.querySelector('#modal-text');
const $racoonImgInModal = document.querySelector('#racoon');
const $parrotImgInModal = document.querySelector('#parrot');
const $deleteBtnInModal = document.querySelector('#delete-btn-in-modal');
const $mainLogo = document.querySelector('#logo-title');
const $footer = document.querySelector('#footer');
const $hereBtn = document.querySelector('#switch-to-main-btn');
const $btnContainerInFooter = document.querySelector('.button-container');

window.addEventListener('DOMContentLoaded', event => {
  event.preventDefault();
  $footer.classList.add('hidden');
  $btnContainerInFooter.classList.add('hidden');
  carouselImg();
  viewSwap('carousel');
  $favoriteBtn.classList.add('hidden');
  $refreshBtn.classList.add('hidden');
  $backToListBtn.classList.add('hidden');
  loadAnimalList();
  for (let i = 0; i < data.favorites.length; i++) {
    const favorite = renderFavorites(data.favorites[i]);
    $favoriteUl.appendChild(favorite);
  }
});

// click event handler in carousel page:
$hereBtn.addEventListener('click', () => {
  viewSwap('main-list');
  $footer.classList.remove('hidden');
  $btnContainerInFooter.classList.remove('hidden');
  $favoriteBtn.classList.remove('hidden');
  $refreshBtn.classList.remove('hidden');
  $backToListBtn.classList.add('hidden');
});

// carousel img request from API:
const carouselAnimal = [];

function carouselImg(event) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://zoo-animal-api.herokuapp.com/animals/rand/10');
  xhr.responseType = 'json';
  xhr.addEventListener('load', xhrLoadFunc);

  function xhrLoadFunc(event) {
    // console.log('xhr status : ', xhr.status);
    // console.log('xhr response : ', xhr.response);
    const response = xhr.response;
    for (let i = 0; i < response.length; i++) {
      const imgLink = response[i].image_link;
      carouselAnimal.push(imgLink);
    }
  }
  xhr.send();
}

// carousel function:
const $imgCarousel = document.querySelector('#img-carousel');
let counter = 0;
setInterval(() => {
  $imgCarousel.setAttribute('src', carouselAnimal[counter]);
  counter++;
  if (counter >= carouselAnimal.length) {
    counter = 0;
  }
}, 2000);

// added click event to logo:
$mainLogo.addEventListener('click', event => {
  viewSwap('main-list');
  $favoriteBtn.classList.remove('hidden');
  $refreshBtn.classList.remove('hidden');
  $backToListBtn.classList.add('hidden');
  resetCurrentAnimalData();
});

let currentAnimalList;

// loading animal list in main page:
function loadAnimalList(event) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://zoo-animal-api.herokuapp.com/animals/rand/10');
  xhr.responseType = 'json';
  xhr.addEventListener('load', xhrLoadFunc);

  function xhrLoadFunc(event) {
    // console.log('xhr status : ', xhr.status);
    // console.log('xhr response : ', xhr.response);
    const response = xhr.response;
    for (let i = 0; i < response.length; i++) {
      const animal = response[i];
      $ul.appendChild(renderAnimal(animal));
    }
    currentAnimalList = response;
  }
  xhr.send();
}

// refreshing animal list button function
$refreshBtn.addEventListener('click', refreshAnimalList);
function refreshAnimalList(event) {
  if ($ul.children.length !== 0) {
    loadAnimalList();
    $ul.replaceChildren();
  }
}

// render animal DOM tree
function renderAnimal(event) {
  var $li = document.createElement('li');
  $li.setAttribute('class', 'list-style');

  var $cardWrapper = document.createElement('div');
  $cardWrapper.setAttribute('class', 'card-wrapper');
  $li.appendChild($cardWrapper);

  var $card = document.createElement('div');
  $card.setAttribute('class', 'card');
  $cardWrapper.appendChild($card);

  var $img = document.createElement('img');
  $img.setAttribute('class', 'style-animal-img');
  $img.setAttribute('src', event.image_link);
  $img.setAttribute('alt', 'animal image');
  $img.setAttribute('name', event.name);
  $card.appendChild($img);

  var $animalName = document.createElement('p');
  $animalName.setAttribute('class', 'style-text');
  $animalName.textContent = event.name;
  $card.appendChild($animalName);

  return $li;
}

// swapping views:
var $views = document.querySelectorAll('[data-view]');
function viewSwap(view) {
  for (var i = 0; i < $views.length; i++) {
    var currentView = $views[i];
    if (view === currentView.getAttribute('data-view')) {
      currentView.classList.remove('hidden');
    } else {
      currentView.classList.add('hidden');
    }
  }
}

// hiding buttons in footer:
var $backToListBtn = document.querySelector('#back-to-list-btn');
var $backToMainBtn = document.querySelector('#back-to-main-btn1');
$backToMainBtn.addEventListener('click', changeButtons);
$backToListBtn.addEventListener('click', changeButtons);
function changeButtons() {
  resetCurrentAnimalData();
  $refreshBtn.classList.remove('hidden');
  $backToListBtn.classList.add('hidden');
  $favoriteBtn.classList.remove('hidden');
  $div.replaceChildren();
  viewSwap('main-list');
}

// reset currentAnimalData:
function resetCurrentAnimalData() {
  currentAnimalData.animalName = '';
  currentAnimalData.animalType = '';
  currentAnimalData.activeTime = '';
  currentAnimalData.lifeSpan = null;
  currentAnimalData.habitat = '';
  currentAnimalData.diet = '';
  currentAnimalData.geoRange = '';
  currentAnimalData.image = '';
}

// clicking animal to view detail:
var currentAnimalData = {
  animalName: '',
  animalType: '',
  activeTime: '',
  lifeSpan: null,
  habitat: '',
  diet: '',
  geoRange: '',
  image: ''
};

$ul.addEventListener('click', viewAnimal);

function viewAnimal(event) {
  if (event.target.tagName !== 'IMG') {
    return;
  }
  for (var i = 0; i < currentAnimalList.length; i++) {
    var matchAnimal = currentAnimalList[i];
    if (event.target.tagName === 'IMG' && event.target.name === matchAnimal.name) {
      viewSwap('details');
      $refreshBtn.classList.add('hidden');
      $backToListBtn.classList.remove('hidden');
      currentAnimalData.animalName = matchAnimal.name;
      currentAnimalData.animalType = matchAnimal.animal_type;
      currentAnimalData.activeTime = matchAnimal.active_time;
      currentAnimalData.lifeSpan = matchAnimal.lifespan;
      currentAnimalData.habitat = matchAnimal.habitat;
      currentAnimalData.diet = matchAnimal.diet;
      currentAnimalData.geoRange = matchAnimal.geo_range;
      currentAnimalData.image = matchAnimal.image_link;
    }
  }
  if ($div.children.length > 0) {
    $div.replaceChildren();
  }
  renderDetail(currentAnimalData);
}

// render DOM tree for information view:
var $div = document.querySelector('.container-detail');

function renderDetail(event) {
  var $row1 = document.createElement('div');
  $row1.setAttribute('class', 'row');
  $div.appendChild($row1);

  var $columnFull = document.createElement('div');
  $columnFull.setAttribute('class', 'column-full');
  $row1.appendChild($columnFull);

  var $pageTitle = document.createElement('h2');
  $pageTitle.setAttribute('class', 'font-nunito style-title-information');
  $pageTitle.textContent = 'Information';
  $columnFull.appendChild($pageTitle);

  var $row2 = document.createElement('div');
  $row2.setAttribute('class', 'row display-flex flex-wrap');
  $row2.setAttribute('id', 'add-btn');
  $div.appendChild($row2);

  var $columnHalf1 = document.createElement('div');
  $columnHalf1.setAttribute('class', 'column-half padding-bottom display-flex justify-center padding-right');
  $row2.appendChild($columnHalf1);

  var $cardWrapperDetail = document.createElement('div');
  $cardWrapperDetail.setAttribute('class', 'card-wrapper-detail');
  $columnHalf1.appendChild($cardWrapperDetail);

  var $cardImg = document.createElement('div');
  $cardImg.setAttribute('class', 'style-card-detail-img');
  $cardWrapperDetail.appendChild($cardImg);

  var $img = document.createElement('img');
  $img.setAttribute('class', 'style-img-detail-page');
  $img.setAttribute('src', event.image);
  $img.setAttribute('alt', 'image of ' + event.animalName);
  $cardImg.appendChild($img);

  var $imgName = document.createElement('h4');
  $imgName.setAttribute('class', 'font-nunito font-size-img-title');
  $imgName.textContent = event.animalName;
  $cardImg.appendChild($imgName);

  var $columnHalf2 = document.createElement('div');
  $columnHalf2.setAttribute('class', 'column-half display-flex justify-center padding-right padding-bottom-detail-text');
  $row2.appendChild($columnHalf2);

  var $cardDescription = document.createElement('div');
  $cardDescription.setAttribute('class', 'card-detail-text');
  $columnHalf2.appendChild($cardDescription);

  var $descriptionTitle = document.createElement('h3');
  $descriptionTitle.setAttribute('class', 'style-detail-title font-nunito display-flex space-between');
  $descriptionTitle.textContent = 'Description';
  $cardDescription.appendChild($descriptionTitle);

  var $addIcon = document.createElement('i');
  $addIcon.setAttribute('class', 'fa-solid fa-circle-plus padding-right-icon');
  $addIcon.setAttribute('id', 'add');
  $descriptionTitle.appendChild($addIcon);

  var $descriptionList = document.createElement('ul');
  $descriptionList.setAttribute('class', 'description-list font-nunito');
  $cardDescription.appendChild($descriptionList);

  var $animalType = document.createElement('li');
  $animalType.setAttribute('class', 'style-description-list-item');
  var $type = document.createElement('span');
  $type.setAttribute('class', 'style-span-description');
  $type.textContent = 'Animal Type: ';
  $animalType.appendChild($type);
  var $typeDetail = document.createElement('span');
  $typeDetail.textContent = event.animalType;
  $animalType.appendChild($typeDetail);
  $descriptionList.appendChild($animalType);

  var $activeTime = document.createElement('li');
  $activeTime.setAttribute('class', 'style-description-list-item');
  var $time = document.createElement('span');
  $time.setAttribute('class', 'style-span-description');
  $time.textContent = 'Active Time: ';
  $activeTime.appendChild($time);
  var $timeDetail = document.createElement('span');
  $timeDetail.textContent = event.activeTime;
  $activeTime.appendChild($timeDetail);
  $descriptionList.appendChild($activeTime);

  var $lifespan = document.createElement('li');
  $lifespan.setAttribute('class', 'style-description-list-item');
  var $life = document.createElement('span');
  $life.setAttribute('class', 'style-span-description');
  $life.textContent = 'Lifespan: ';
  $lifespan.appendChild($life);
  var $lifeDetail = document.createElement('span');
  $lifeDetail.textContent = event.lifeSpan + ' years';
  $lifespan.appendChild($lifeDetail);
  $descriptionList.appendChild($lifespan);

  var $habitat = document.createElement('li');
  $habitat.setAttribute('class', 'style-description-list-item');
  var $environment = document.createElement('span');
  $environment.setAttribute('class', 'style-span-description');
  $environment.textContent = 'Habitat: ';
  $habitat.appendChild($environment);
  var $environmentDetail = document.createElement('span');
  $environmentDetail.textContent = event.habitat;
  $habitat.appendChild($environmentDetail);
  $descriptionList.appendChild($habitat);

  var $diet = document.createElement('li');
  $diet.setAttribute('class', 'style-description-list-item');
  var $food = document.createElement('span');
  $food.setAttribute('class', 'style-span-description');
  $food.textContent = 'Diet: ';
  $diet.appendChild($food);
  var $foodDetail = document.createElement('span');
  $foodDetail.textContent = event.diet;
  $diet.appendChild($foodDetail);
  $descriptionList.appendChild($diet);

  var $geoRange = document.createElement('li');
  $geoRange.setAttribute('class', 'style-description-list-item');
  var $location = document.createElement('span');
  $location.setAttribute('class', 'style-span-description');
  $location.textContent = 'Geo-range: ';
  $geoRange.appendChild($location);
  var $locationDetail = document.createElement('span');
  $locationDetail.textContent = event.geoRange;
  $geoRange.appendChild($locationDetail);
  $descriptionList.appendChild($geoRange);

  return $row2;
}

// modal popup when + button clicked:
var $modalContainer = document.querySelector('.overlay');
$div.addEventListener('click', function (event) {
  if (event.target.tagName !== 'I') {
    return;
  }
  if (event.target.tagName === 'I') {
    $modalContainer.classList.remove('hidden');
    $modalText.textContent = 'Add to favorites?';
    $racoonImgInModal.classList.remove('hidden');
    $parrotImgInModal.classList.add('hidden');
    $confirmModalBtn.classList.remove('hidden');
    $deleteBtnInModal.classList.add('hidden');
  }
});

// remove modal when cancel is clicked:
var $cancelModal = document.querySelector('#cancel-btn');
$cancelModal.addEventListener('click', function (event) {
  $modalContainer.classList.add('hidden');
});

// add current animal to data.favorites:
var $confirmModalBtn = document.querySelector('#confirm-btn');
$confirmModalBtn.addEventListener('click', addToFavorites);

function addToFavorites(event) {
  for (var i = 0; i < data.favorites.length; i++) {
    var findDuplicate = data.favorites[i].animalName;
    if (currentAnimalData.animalName === findDuplicate) {
      alert('This animal is already added!');
      $modalContainer.classList.add('hidden');
      return;
    }
  }
  var favoriteAnimal = Object.create(currentAnimalData);
  favoriteAnimal.favoriteId = data.nextFavoriteId;
  favoriteAnimal.animalName = currentAnimalData.animalName;
  favoriteAnimal.activeTime = currentAnimalData.activeTime;
  favoriteAnimal.animalType = currentAnimalData.animalType;
  favoriteAnimal.diet = currentAnimalData.diet;
  favoriteAnimal.geoRange = currentAnimalData.geoRange;
  favoriteAnimal.habitat = currentAnimalData.habitat;
  favoriteAnimal.image = currentAnimalData.image;
  favoriteAnimal.lifeSpan = currentAnimalData.lifeSpan;
  data.favorites.unshift(favoriteAnimal);
  var newFavorite = renderFavorites(data.favorites[0]);
  $favoriteUl.prepend(newFavorite);
  data.nextFavoriteId++;
  viewSwap('main-list');
  $modalContainer.classList.add('hidden');
  $refreshBtn.classList.remove('hidden');
  $backToListBtn.classList.add('hidden');
  $favoriteBtn.classList.remove('hidden');
  resetCurrentAnimalData();
}

// favorites page view function:
$favoriteBtn.addEventListener('click', viewFavorites);
function viewFavorites(event) {
  if (data.favorites.length === 0) {
    $noFavMessage.classList.remove('hidden');
  } else {
    $noFavMessage.classList.add('hidden');
  }
  viewSwap('favorites');
  $refreshBtn.classList.add('hidden');
  $favoriteBtn.classList.add('hidden');
  $backToListBtn.classList.remove('hidden');
}

// DOM tree for rendering favorite animals:
function renderFavorites(event) {
  var $li = document.createElement('li');
  $li.setAttribute('id', event.favoriteId);
  $li.setAttribute('class', 'list-style-favorites');

  var $row = document.createElement('div');
  $row.setAttribute('class', 'row display-flex-favorites-list');
  $li.appendChild($row);

  var $columnHalf1 = document.createElement('div');
  $columnHalf1.setAttribute('class', 'column-half padding-bottom padding-right-favorites');
  $row.appendChild($columnHalf1);

  var $cardWrapperImg = document.createElement('div');
  $cardWrapperImg.setAttribute('class', 'card-wrapper-favorites');
  $columnHalf1.appendChild($cardWrapperImg);

  var $cardImg = document.createElement('div');
  $cardImg.setAttribute('class', 'style-card-favorites-img');
  $cardWrapperImg.appendChild($cardImg);

  var $imgFavorite = document.createElement('img');
  $imgFavorite.setAttribute('src', event.image);
  $imgFavorite.setAttribute('alt', event.animalName);
  $imgFavorite.setAttribute('class', 'style-img-favorites-page');
  $cardImg.appendChild($imgFavorite);

  var $imgName = document.createElement('h4');
  $imgName.setAttribute('class', 'font-nunito font-size-img-title text-center-favorites');
  $imgName.textContent = event.animalName;
  $cardImg.appendChild($imgName);

  var $columnHalf2 = document.createElement('div');
  $columnHalf2.setAttribute('class', 'column-half padding-bottom padding-left-favorites');
  $row.appendChild($columnHalf2);

  var $cardDetails = document.createElement('div');
  $cardDetails.setAttribute('class', 'favorite-card-detail-text');
  $columnHalf2.appendChild($cardDetails);

  var $descriptionTitle = document.createElement('h3');
  $descriptionTitle.setAttribute('class', 'style-detail-title font-nunito display-flex space-between');
  $descriptionTitle.textContent = 'Description';
  $cardDetails.appendChild($descriptionTitle);

  var $descriptionUl = document.createElement('ul');
  $descriptionUl.setAttribute('class', 'description-list font-nunito');
  $cardDetails.appendChild($descriptionUl);

  var $animalType = document.createElement('li');
  $animalType.setAttribute('class', 'style-description-list-item');
  var type = document.createElement('sapn');
  type.setAttribute('class', 'style-span-description');
  type.textContent = 'Animal Type: ';
  $animalType.appendChild(type);
  var typeDetail = document.createElement('span');
  typeDetail.textContent = event.animalType;
  $animalType.appendChild(typeDetail);
  $descriptionUl.appendChild($animalType);

  var $activeTime = document.createElement('li');
  $activeTime.setAttribute('class', 'style-description-list-item');
  var time = document.createElement('span');
  time.setAttribute('class', 'style-span-description');
  time.textContent = 'Active Time: ';
  $activeTime.appendChild(time);
  var timeDetail = document.createElement('span');
  timeDetail.textContent = event.activeTime;
  $activeTime.appendChild(timeDetail);
  $descriptionUl.appendChild($activeTime);

  var $lifespan = document.createElement('li');
  $lifespan.setAttribute('class', 'style-description-list-item');
  var life = document.createElement('span');
  life.setAttribute('class', 'style-span-description');
  life.textContent = 'Lifespan: ';
  $lifespan.appendChild(life);
  var lifeDetail = document.createElement('span');
  lifeDetail.textContent = event.lifeSpan + ' years';
  $lifespan.appendChild(lifeDetail);
  $descriptionUl.appendChild($lifespan);

  var $habitat = document.createElement('li');
  $habitat.setAttribute('class', 'style-description-list-item');
  var environment = document.createElement('span');
  environment.setAttribute('class', 'style-span-description');
  environment.textContent = 'Habitat: ';
  $habitat.appendChild(environment);
  var environmentDetail = document.createElement('span');
  environmentDetail.textContent = event.habitat;
  $habitat.appendChild(environmentDetail);
  $descriptionUl.appendChild($habitat);

  var $geoRange = document.createElement('li');
  $geoRange.setAttribute('class', 'style-description-list-item padding-bottom');
  var location = document.createElement('span');
  location.setAttribute('class', 'style-span-description');
  location.textContent = 'Geo-range: ';
  $geoRange.appendChild(location);
  var locationDetail = document.createElement('span');
  locationDetail.textContent = event.geoRange;
  $geoRange.appendChild(locationDetail);
  $descriptionUl.appendChild($geoRange);

  var $deleteIcon = document.createElement('i');
  $deleteIcon.setAttribute('class', 'fa-solid fa-trash-can padding-right-icon style-icon-delete');
  $deleteIcon.setAttribute('id', 'delete-icon');
  $descriptionTitle.appendChild($deleteIcon);

  return $li;
}

var currentDeleteAnimal = function deleteAnimalCheck(event) {
  // checking only delete button is clicked:
  if (event.target.tagName !== 'I') {
    return;
  }
  if (event.target.tagName === 'I') {
    $modalContainer.classList.remove('hidden');
    $confirmModalBtn.classList.add('hidden');
    $deleteBtnInModal.classList.remove('hidden');
    $modalText.textContent = 'Delete this animal?';
    $racoonImgInModal.classList.add('hidden');
    $parrotImgInModal.classList.remove('hidden');
  }
  var closestElement = event.target.closest('.list-style-favorites');

  // actually deleting list in favorites page:
  $deleteBtnInModal.addEventListener('click', deleteAnimal);
  function deleteAnimal(event) {
    var currentTarget = closestElement.id;
    for (var i = 0; i < data.favorites.length; i++) {
      var currentAnimal = data.favorites[i].favoriteId;
      if (currentAnimal === parseInt(currentTarget)) {
        data.favorites.splice(i, 1);
        closestElement.remove();
      }
    }
    $modalContainer.classList.add('hidden');
    if (data.favorites.length === 0) {
      $noFavMessage.classList.remove('hidden');
    } else {
      $noFavMessage.classList.add('hidden');
    }
  }
};
$favoriteUl.addEventListener('click', currentDeleteAnimal);
