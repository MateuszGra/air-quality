const select = document.querySelector('.search__select');
const stationName = document.querySelector('.data__name');
let htmlText = ``;
const dataWrapper = document.querySelector('.data');
let counter = 0;
let stations;
let sensors;
let quality;

const generateSearch = (id) => {
    const string = `?station=${id}`;
    history.pushState(false, '', string);
    importStationToPopup();
}

const loadSelectValue = () => {
    const params = new URLSearchParams(window.location.search);
    const station = params.get('station');

    if (station) {
        select.dataset.id = station;
    } else if (localStorage.getItem('station') != null) {
        select.dataset.id = localStorage.getItem('station');
    } else {
        select.dataset.id = 117;
    }

    generateSearch(select.dataset.id );
    localStorage.setItem('station', select.dataset.id );
}

const importStationToPopup = () => {
    const popupStacion = document.querySelector('.js-station');
    popupStacion.textContent = select.value;
}

loadStacions();

const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type == "attributes") {
        select.value = document.querySelector(`.search__list-el[data-id="${select.dataset.id}"]`).innerText;
        localStorage.setItem('station', select.dataset.id );
        htmlText = ``;
        counter = 0;
        generateSearch(select.dataset.id );
        loadQuality();
        importStationToPopup();
    }
  });
});

observer.observe(select, {
  attributes: true
});