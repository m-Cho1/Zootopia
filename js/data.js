/* exported data */

let data = {
  favorites: [],
  nextFavoriteId: 1
};

const previousDataEntriesJSON = localStorage.getItem('data-local-storage');
if (previousDataEntriesJSON !== null) {
  data = JSON.parse(previousDataEntriesJSON);
}

window.addEventListener('beforeunload', beforeUnloadFunc);

function beforeUnloadFunc(event) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('data-local-storage', dataJSON);
}
