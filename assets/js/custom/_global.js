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

    localStorage.setItem('station', select.dataset.id );
}

const importStationToPopup = () => {
    const popupStacion = document.querySelector('.js-station');
    const station = stations.filter(obj => {
        return obj.id == select.dataset.id;
    })
    popupStacion.textContent = station[0].city.name;
}

loadStacions();

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type == "attributes") {
        const listEl = document.querySelector(`.search__list-el[data-id="${select.dataset.id}"]`);
        if(listEl) {
            select.value = listEl.innerText;
            localStorage.setItem('station', select.dataset.id );
            htmlText = ``;
            counter = 0;
            generateSearch(select.dataset.id );
            loadQuality();
            importStationToPopup();
        } else {
            dataWrapper.innerHTML = `<h2 class="error">Brak wyników wyszukiwania :(</h2>`
        }
    }
  });
});

observer.observe(select, {
  attributes: true
});