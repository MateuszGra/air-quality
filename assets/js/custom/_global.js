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
        select.value = station;
    } else if (localStorage.getItem('station') != null) {
        select.value = localStorage.getItem('station');
    } else {
        select.value = 117;
    }

    generateSearch(select.value);
    localStorage.setItem('station', select.value);
}

const importStationToPopup = () => {
    const popupStacion = document.querySelector('.js-station');
    popupStacion.textContent = select.options[select.selectedIndex].text;
}

loadStacions();

select.addEventListener('change', () => {
    localStorage.setItem('station', select.value);
    htmlText = ``;
    counter = 0;
    generateSearch(select.value);
    loadQuality();
    importStationToPopup();

});