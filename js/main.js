var $refreshBtn = document.querySelector('#refresh-btn');
var $ul = document.querySelector('#animal-list');

function loadAnimalList(event) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://zoo-animal-api.herokuapp.com/animals/rand/10');
  xhr.responseType = 'json';
  xhr.addEventListener('load', xhrLoadFunc);

  function xhrLoadFunc(event) {
    console.log('xhr status : ', xhr.status);
    console.log('xhr response : ', xhr.response);
    var response = xhr.response;
    for (var i = 0; i < response.length; i++) {
      var animal = response[i];
      $ul.appendChild(renderAnimal(animal));
    }
  }
  xhr.send();
}
loadAnimalList();

$refreshBtn.addEventListener('click', refreshAnimalList);
function refreshAnimalList(event) {
  if ($ul.children.length !== 0) {
    loadAnimalList();
    $ul.replaceChildren();
  }
}

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
  $card.appendChild($img);

  var $animalName = document.createElement('p');
  $animalName.setAttribute('class', 'style-text');
  $animalName.textContent = event.name;
  $card.appendChild($animalName);

  return $li;
}
