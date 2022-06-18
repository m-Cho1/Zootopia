var $refreshBtn = document.querySelector('#refresh-btn');
var $ul = document.querySelector('#animal-list');

var currentAnimalList;

window.addEventListener('DOMContentLoaded', function (event) {
  event.preventDefault();
  loadAnimalList();
  viewSwap('main-list');
  $refreshBtn.classList.remove('hidden');
  $backToListBtn.classList.add('hidden');
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
  // data.view = view;
}

// hiding buttons in footer:
var $backToListBtn = document.querySelector('#back-to-list-btn');
$backToListBtn.addEventListener('click', function () {
  resetCurrentAnimalData();
  $refreshBtn.classList.remove('hidden');
  $backToListBtn.classList.add('hidden');
  $div.replaceChildren();
  viewSwap('main-list');
});

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
  $descriptionTitle.setAttribute('class', 'style-detail-title font-nunito');
  $descriptionTitle.textContent = 'Description';
  $cardDescription.appendChild($descriptionTitle);

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

  return $row1;
}
