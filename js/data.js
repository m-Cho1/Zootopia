/* exported data */

var data = {
  favorites: [],
  nextFavoriteId: 1
};

var previousDataEntriesJSON = localStorage.getItem('data-local-storage');
if (previousDataEntriesJSON !== null) {
  data = JSON.parse(previousDataEntriesJSON);
}

window.addEventListener('beforeunload', beforeUnloadFunc);

function beforeUnloadFunc(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('data-local-storage', dataJSON);
}
