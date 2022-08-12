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
const $loader = document.querySelector('.lds-spinner');
const $networkMessage = document.querySelector('.network-message');

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
    if (xhr.status === 200) {
      const response = xhr.response;
      for (let i = 0; i < response.length; i++) {
        const animal = response[i];
        $ul.appendChild(renderAnimal(animal));
      }
      $loader.className = 'lds-spinner hidden';
      $ul.classList.remove('hidden');
      currentAnimalList = response;
      if (response.length === 0) {
        $loader.className = 'lds-spinner hidden';
        $networkMessage.classList.remove('hidden');
      }
    } else {
      $networkMessage.classList.remove('hidden');
    }
  }
  xhr.send();
}

// refreshing animal list button function
$refreshBtn.addEventListener('click', refreshAnimalList);
function refreshAnimalList(event) {
  if ($ul.children.length !== 0) {
    loadAnimalList();
    $ul.replaceChildren();
  } else {
    $loader.classList.remove('hidden');
  }
}

// render animal DOM tree
function renderAnimal(event) {
  const $li = document.createElement('li');
  $li.setAttribute('class', 'list-style');

  const $cardWrapper = document.createElement('div');
  $cardWrapper.setAttribute('class', 'card-wrapper');
  $li.appendChild($cardWrapper);

  const $card = document.createElement('div');
  $card.setAttribute('class', 'card');
  $cardWrapper.appendChild($card);

  const $img = document.createElement('img');
  $img.setAttribute('class', 'style-animal-img');
  $img.setAttribute('src', event.image_link);
  $img.setAttribute('alt', 'animal image');
  $img.setAttribute('name', event.name);
  $card.appendChild($img);

  const $animalName = document.createElement('p');
  $animalName.setAttribute('class', 'style-text');
  $animalName.textContent = event.name;
  $card.appendChild($animalName);

  return $li;
}

// swapping views:
const $views = document.querySelectorAll('[data-view]');
function viewSwap(view) {
  for (let i = 0; i < $views.length; i++) {
    const currentView = $views[i];
    if (view === currentView.getAttribute('data-view')) {
      currentView.classList.remove('hidden');
    } else {
      currentView.classList.add('hidden');
    }
  }
}

// hiding buttons in footer:
const $backToListBtn = document.querySelector('#back-to-list-btn');
const $backToMainBtn = document.querySelector('#back-to-main-btn1');
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
const currentAnimalData = {
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
  for (let i = 0; i < currentAnimalList.length; i++) {
    const matchAnimal = currentAnimalList[i];
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
const $div = document.querySelector('.container-detail');

function renderDetail(event) {
  const $row1 = document.createElement('div');
  $row1.setAttribute('class', 'row');
  $div.appendChild($row1);

  const $columnFull = document.createElement('div');
  $columnFull.setAttribute('class', 'column-full');
  $row1.appendChild($columnFull);

  const $pageTitle = document.createElement('h2');
  $pageTitle.setAttribute('class', 'font-nunito style-title-information');
  $pageTitle.textContent = 'Information';
  $columnFull.appendChild($pageTitle);

  const $row2 = document.createElement('div');
  $row2.setAttribute('class', 'row display-flex flex-wrap');
  $row2.setAttribute('id', 'add-btn');
  $div.appendChild($row2);

  const $columnHalf1 = document.createElement('div');
  $columnHalf1.setAttribute('class', 'column-half padding-bottom display-flex justify-center padding-right');
  $row2.appendChild($columnHalf1);

  const $cardWrapperDetail = document.createElement('div');
  $cardWrapperDetail.setAttribute('class', 'card-wrapper-detail');
  $columnHalf1.appendChild($cardWrapperDetail);

  const $cardImg = document.createElement('div');
  $cardImg.setAttribute('class', 'style-card-detail-img');
  $cardWrapperDetail.appendChild($cardImg);

  const $img = document.createElement('img');
  $img.setAttribute('class', 'style-img-detail-page');
  $img.setAttribute('src', event.image);
  $img.setAttribute('alt', 'image of ' + event.animalName);
  $cardImg.appendChild($img);

  const $imgName = document.createElement('h4');
  $imgName.setAttribute('class', 'font-nunito font-size-img-title');
  $imgName.textContent = event.animalName;
  $cardImg.appendChild($imgName);

  const $columnHalf2 = document.createElement('div');
  $columnHalf2.setAttribute('class', 'column-half display-flex justify-center padding-right padding-bottom-detail-text');
  $row2.appendChild($columnHalf2);

  const $cardDescription = document.createElement('div');
  $cardDescription.setAttribute('class', 'card-detail-text');
  $columnHalf2.appendChild($cardDescription);

  const $descriptionTitle = document.createElement('h3');
  $descriptionTitle.setAttribute('class', 'style-detail-title font-nunito display-flex space-between');
  $descriptionTitle.textContent = 'Description';
  $cardDescription.appendChild($descriptionTitle);

  const $addIcon = document.createElement('i');
  $addIcon.setAttribute('class', 'fa-solid fa-circle-plus padding-right-icon');
  $addIcon.setAttribute('id', 'add');
  $descriptionTitle.appendChild($addIcon);

  const $descriptionList = document.createElement('ul');
  $descriptionList.setAttribute('class', 'description-list font-nunito');
  $cardDescription.appendChild($descriptionList);

  const $animalType = document.createElement('li');
  $animalType.setAttribute('class', 'style-description-list-item');
  const $type = document.createElement('span');
  $type.setAttribute('class', 'style-span-description');
  $type.textContent = 'Animal Type: ';
  $animalType.appendChild($type);
  const $typeDetail = document.createElement('span');
  $typeDetail.textContent = event.animalType;
  $animalType.appendChild($typeDetail);
  $descriptionList.appendChild($animalType);

  const $activeTime = document.createElement('li');
  $activeTime.setAttribute('class', 'style-description-list-item');
  const $time = document.createElement('span');
  $time.setAttribute('class', 'style-span-description');
  $time.textContent = 'Active Time: ';
  $activeTime.appendChild($time);
  const $timeDetail = document.createElement('span');
  $timeDetail.textContent = event.activeTime;
  $activeTime.appendChild($timeDetail);
  $descriptionList.appendChild($activeTime);

  const $lifespan = document.createElement('li');
  $lifespan.setAttribute('class', 'style-description-list-item');
  const $life = document.createElement('span');
  $life.setAttribute('class', 'style-span-description');
  $life.textContent = 'Lifespan: ';
  $lifespan.appendChild($life);
  const $lifeDetail = document.createElement('span');
  $lifeDetail.textContent = event.lifeSpan + ' years';
  $lifespan.appendChild($lifeDetail);
  $descriptionList.appendChild($lifespan);

  const $habitat = document.createElement('li');
  $habitat.setAttribute('class', 'style-description-list-item');
  const $environment = document.createElement('span');
  $environment.setAttribute('class', 'style-span-description');
  $environment.textContent = 'Habitat: ';
  $habitat.appendChild($environment);
  const $environmentDetail = document.createElement('span');
  $environmentDetail.textContent = event.habitat;
  $habitat.appendChild($environmentDetail);
  $descriptionList.appendChild($habitat);

  const $diet = document.createElement('li');
  $diet.setAttribute('class', 'style-description-list-item');
  const $food = document.createElement('span');
  $food.setAttribute('class', 'style-span-description');
  $food.textContent = 'Diet: ';
  $diet.appendChild($food);
  const $foodDetail = document.createElement('span');
  $foodDetail.textContent = event.diet;
  $diet.appendChild($foodDetail);
  $descriptionList.appendChild($diet);

  const $geoRange = document.createElement('li');
  $geoRange.setAttribute('class', 'style-description-list-item');
  const $location = document.createElement('span');
  $location.setAttribute('class', 'style-span-description');
  $location.textContent = 'Geo-range: ';
  $geoRange.appendChild($location);
  const $locationDetail = document.createElement('span');
  $locationDetail.textContent = event.geoRange;
  $geoRange.appendChild($locationDetail);
  $descriptionList.appendChild($geoRange);

  return $row2;
}

// modal popup when + button clicked:
const $modalContainer = document.querySelector('.overlay');
$div.addEventListener('click', event => {
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
const $cancelModal = document.querySelector('#cancel-btn');
$cancelModal.addEventListener('click', event => {
  $modalContainer.classList.add('hidden');
});

// add current animal to data.favorites:
const $confirmModalBtn = document.querySelector('#confirm-btn');
$confirmModalBtn.addEventListener('click', addToFavorites);

function addToFavorites(event) {
  for (let i = 0; i < data.favorites.length; i++) {
    const findDuplicate = data.favorites[i].animalName;
    if (currentAnimalData.animalName === findDuplicate) {
      alert('This animal is already added!');
      $modalContainer.classList.add('hidden');
      return;
    }
  }
  const favoriteAnimal = Object.create(currentAnimalData);
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
  const newFavorite = renderFavorites(data.favorites[0]);
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
  const $li = document.createElement('li');
  $li.setAttribute('id', event.favoriteId);
  $li.setAttribute('class', 'list-style-favorites');

  const $row = document.createElement('div');
  $row.setAttribute('class', 'row display-flex-favorites-list');
  $li.appendChild($row);

  const $columnHalf1 = document.createElement('div');
  $columnHalf1.setAttribute('class', 'column-half padding-bottom padding-right-favorites');
  $row.appendChild($columnHalf1);

  const $cardWrapperImg = document.createElement('div');
  $cardWrapperImg.setAttribute('class', 'card-wrapper-favorites');
  $columnHalf1.appendChild($cardWrapperImg);

  const $cardImg = document.createElement('div');
  $cardImg.setAttribute('class', 'style-card-favorites-img');
  $cardWrapperImg.appendChild($cardImg);

  const $imgFavorite = document.createElement('img');
  $imgFavorite.setAttribute('src', event.image);
  $imgFavorite.setAttribute('alt', event.animalName);
  $imgFavorite.setAttribute('class', 'style-img-favorites-page');
  $cardImg.appendChild($imgFavorite);

  const $imgName = document.createElement('h4');
  $imgName.setAttribute('class', 'font-nunito font-size-img-title text-center-favorites');
  $imgName.textContent = event.animalName;
  $cardImg.appendChild($imgName);

  const $columnHalf2 = document.createElement('div');
  $columnHalf2.setAttribute('class', 'column-half padding-bottom padding-left-favorites');
  $row.appendChild($columnHalf2);

  const $cardDetails = document.createElement('div');
  $cardDetails.setAttribute('class', 'favorite-card-detail-text');
  $columnHalf2.appendChild($cardDetails);

  const $descriptionTitle = document.createElement('h3');
  $descriptionTitle.setAttribute('class', 'style-detail-title font-nunito display-flex space-between');
  $descriptionTitle.textContent = 'Description';
  $cardDetails.appendChild($descriptionTitle);

  const $descriptionUl = document.createElement('ul');
  $descriptionUl.setAttribute('class', 'description-list font-nunito');
  $cardDetails.appendChild($descriptionUl);

  const $animalType = document.createElement('li');
  $animalType.setAttribute('class', 'style-description-list-item');
  const type = document.createElement('sapn');
  type.setAttribute('class', 'style-span-description');
  type.textContent = 'Animal Type: ';
  $animalType.appendChild(type);
  const typeDetail = document.createElement('span');
  typeDetail.textContent = event.animalType;
  $animalType.appendChild(typeDetail);
  $descriptionUl.appendChild($animalType);

  const $activeTime = document.createElement('li');
  $activeTime.setAttribute('class', 'style-description-list-item');
  const time = document.createElement('span');
  time.setAttribute('class', 'style-span-description');
  time.textContent = 'Active Time: ';
  $activeTime.appendChild(time);
  const timeDetail = document.createElement('span');
  timeDetail.textContent = event.activeTime;
  $activeTime.appendChild(timeDetail);
  $descriptionUl.appendChild($activeTime);

  const $lifespan = document.createElement('li');
  $lifespan.setAttribute('class', 'style-description-list-item');
  const life = document.createElement('span');
  life.setAttribute('class', 'style-span-description');
  life.textContent = 'Lifespan: ';
  $lifespan.appendChild(life);
  const lifeDetail = document.createElement('span');
  lifeDetail.textContent = event.lifeSpan + ' years';
  $lifespan.appendChild(lifeDetail);
  $descriptionUl.appendChild($lifespan);

  const $habitat = document.createElement('li');
  $habitat.setAttribute('class', 'style-description-list-item');
  const environment = document.createElement('span');
  environment.setAttribute('class', 'style-span-description');
  environment.textContent = 'Habitat: ';
  $habitat.appendChild(environment);
  const environmentDetail = document.createElement('span');
  environmentDetail.textContent = event.habitat;
  $habitat.appendChild(environmentDetail);
  $descriptionUl.appendChild($habitat);

  const $geoRange = document.createElement('li');
  $geoRange.setAttribute('class', 'style-description-list-item padding-bottom');
  const location = document.createElement('span');
  location.setAttribute('class', 'style-span-description');
  location.textContent = 'Geo-range: ';
  $geoRange.appendChild(location);
  const locationDetail = document.createElement('span');
  locationDetail.textContent = event.geoRange;
  $geoRange.appendChild(locationDetail);
  $descriptionUl.appendChild($geoRange);

  const $deleteIcon = document.createElement('i');
  $deleteIcon.setAttribute('class', 'fa-solid fa-trash-can padding-right-icon style-icon-delete');
  $deleteIcon.setAttribute('id', 'delete-icon');
  $descriptionTitle.appendChild($deleteIcon);

  return $li;
}

const currentDeleteAnimal = function deleteAnimalCheck(event) {
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
  const closestElement = event.target.closest('.list-style-favorites');

  // actually deleting list in favorites page:
  $deleteBtnInModal.addEventListener('click', deleteAnimal);
  function deleteAnimal(event) {
    const currentTarget = closestElement.id;
    for (let i = 0; i < data.favorites.length; i++) {
      const currentAnimal = data.favorites[i].favoriteId;
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
