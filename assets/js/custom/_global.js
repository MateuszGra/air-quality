const select = document.querySelector('.search__select');
const stationName = document.querySelector('.data__name');
let htmlText = ``;
const dataWrapper = document.querySelector('.data');
let counter = 0;
let stations;
let sensors;
let quality;

const createSelect = (stations) => {

    stations.sort((a, b) => a.city.name.localeCompare(b.city.name));
    stations.forEach(station => {
        const option = document.createElement('option');
        option.text = station.city.name;
        if (station.addressStreet != null) {
            option.text += ' ' + station.addressStreet;
        }
        option.value = station.id;
        select.add(option);
    });
}

const generateSearch = (id) => {
    const string = `?station=${id}`;
    history.pushState(false, '', string);
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


loadStacions();

select.addEventListener('change', () => {
    localStorage.setItem('station', select.value);
    htmlText = ``;
    counter = 0;
    generateSearch(select.value);
    loadQuality();
});