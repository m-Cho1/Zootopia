var $refreshBtn = document.querySelector('#refresh-btn');
var $ul = document.querySelector('#animal-list');
var $favoriteBtn = document.querySelector('#favorites-btn');
var $favoriteUl = document.querySelector('#favorites-list');
var $noFavMessage = document.querySelector('#no-favorite-message');
var $modalText = document.querySelector('#modal-text');
var $deleteBtnModal = document.querySelector('#delete-btn');
var $racoonImgInModal = document.querySelector('#racoon');
var $parrotImgInModal = document.querySelector('#parrot');

var currentAnimalList;

window.addEventListener('DOMContentLoaded', function (event) {
  event.preventDefault();
  loadAnimalList();
  viewSwap('main-list');
  $favoriteBtn.classList.remove('hidden');
  $refreshBtn.classList.remove('hidden');
  $backToListBtn.classList.add('hidden');
  for (var i = 0; i < data.favorites.length; i++) {
    var favorite = renderFavorites(data.favorites[i]);
    $favoriteUl.appendChild(favorite);
  }
});

// loading animal list
function loadAnimalList(event) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://zoo-animal-api.herokuapp.com/animals/rand/10');
  xhr.responseType = 'json';
  xhr.addEventListener('load', xhrLoadFunc);

  function xhrLoadFunc(event) {
    // console.log('xhr status : ', xhr.status);
    // console.log('xhr response : ', xhr.response);
    var response = xhr.response;
    for (var i = 0; i < response.length; i++) {
      var animal = response[i];
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
  $addIcon.setAttribute('class', 'fa-solid fa-circle-plus');
  $addIcon.setAttribute('id', 'add');
  $descriptionTitle.appendChild($addIcon);

  var $descriptionList = document.createElement('ul');
  $descriptionList.setAttribute('class', 'description-list font-nunito');
  $cardDescription.appendChild($descriptionList);

  var $animalType = document.createElement('li');
  $animalType.setAttribute('class', 'style-description-list-item');
  $animalType.textContent = 'Animal Type : ' + event.animalType;
  $descriptionList.appendChild($animalType);

  var $activeTime = document.createElement('li');
  $activeTime.setAttribute('class', 'style-description-list-item');
  $activeTime.textContent = 'Active Time : ' + event.activeTime;
  $descriptionList.appendChild($activeTime);

  var $lifespan = document.createElement('li');
  $lifespan.setAttribute('class', 'style-description-list-item');
  $lifespan.textContent = 'Lifespan : ' + event.lifeSpan + ' years';
  $descriptionList.appendChild($lifespan);

  var $habitat = document.createElement('li');
  $habitat.setAttribute('class', 'style-description-list-item');
  $habitat.textContent = 'Habitat : ' + event.habitat;
  $descriptionList.appendChild($habitat);

  var $diet = document.createElement('li');
  $diet.setAttribute('class', 'style-description-list-item');
  $diet.textContent = 'Diet : ' + event.diet;
  $descriptionList.appendChild($diet);

  var $geoRange = document.createElement('li');
  $geoRange.setAttribute('class', 'style-description-list-item');
  $geoRange.textContent = 'Geo-range : ' + event.geoRange;
  $descriptionList.appendChild($geoRange);

  return $row2;
}

// modal popup when user + button clicked:
var $modalContainer = document.querySelector('.overlay');
$div.addEventListener('click', function (event) {
  if (event.target.tagName !== 'I') {
    return;
  }
  if (event.target.tagName === 'I') {
    $modalContainer.classList.remove('hidden');
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
  $descriptionTitle.setAttribute('class', 'style-detail-title font-nunito');
  $descriptionTitle.textContent = 'Description';
  $cardDetails.appendChild($descriptionTitle);

  var $descriptionUl = document.createElement('ul');
  $descriptionUl.setAttribute('class', 'description-list font-nunito');
  $cardDetails.appendChild($descriptionUl);

  var $animalType = document.createElement('li');
  $animalType.setAttribute('class', 'style-description-list-item');
  $animalType.textContent = 'Animal Type: ' + event.animalType;
  $descriptionUl.appendChild($animalType);

  var $activeTime = document.createElement('li');
  $activeTime.setAttribute('class', 'style-description-list-item');
  $activeTime.textContent = 'Active Time: ' + event.activeTime;
  $descriptionUl.appendChild($activeTime);

  var $lifespan = document.createElement('li');
  $lifespan.setAttribute('class', 'style-description-list-item');
  $lifespan.textContent = 'Lifespan: ' + event.lifeSpan + ' years';
  $descriptionUl.appendChild($lifespan);

  var $habitat = document.createElement('li');
  $habitat.setAttribute('class', 'style-description-list-item');
  $habitat.textContent = 'Habitat: ' + event.habitat;
  $descriptionUl.appendChild($habitat);

  var $geoRange = document.createElement('li');
  $geoRange.setAttribute('class', 'style-description-list-item padding-bottom');
  $geoRange.textContent = 'Geo-range: ' + event.geoRange;
  $descriptionUl.appendChild($geoRange);

  var $deleteBtnContainer = document.createElement('div');
  $deleteBtnContainer.setAttribute('class', 'style-delete-btn-container');
  $descriptionUl.appendChild($deleteBtnContainer);

  var $deleteBtn = document.createElement('button');
  $deleteBtn.setAttribute('class', 'style-delete-button');
  $deleteBtn.setAttribute('id', 'delete-btn');
  $deleteBtn.textContent = 'Delete';
  $deleteBtnContainer.appendChild($deleteBtn);

  return $li;
}

// delete animal in favorites page:
$favoriteUl.addEventListener('click', deleteAnimalCheck);
function deleteAnimalCheck(event) {
  if (event.target.tagName !== 'BUTTON') {
    return;
  }
  if (event.target.tagName === 'BUTTON') {
    $modalContainer.classList.remove('hidden');
    $confirmModalBtn.classList.add('hidden');
    $deleteBtnModal.classList.remove('hidden');
    $modalText.textContent = 'Delete this animal?';
    $racoonImgInModal.classList.add('hidden');
    $parrotImgInModal.classList.remove('hidden');
  }
}

function deleteAnimal(event) {
  // create function that deletes animal in data.favortites and remove DOM tree for selected animal here.
}
