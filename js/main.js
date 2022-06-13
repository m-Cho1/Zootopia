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
// loadAnimalList();

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
  geoRange: ''
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
    }
  }
}
