const select = document.querySelector('.select');
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


const loadSelectValue = () => {
    if (localStorage.getItem('station') != null) {
        select.value = localStorage.getItem('station');
    } else {
        select.value = 129;
    }

    localStorage.setItem('station', select.value);
}

const loadSensorData = (id, index) => {
    const data = new FormData();
    data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/data/getData/' + id);

    fetch('inc/ajax.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.text())
        .then(response => {
            const sensorData = JSON.parse(response);
            let value = 'brak danych';

            for (let i = 0; i < sensorData.values.length; i++) {
                if (sensorData.values[i].value != null) {
                    value = sensorData.values[i].value;
                }
            }

            htmlText += `
            <p class="data__sensor">
                <span data-id="${sensors[index].param.idParam}">${sensors[index].param.paramName}: </span>
                <span>${value}</span>
            </p>
            `

            counter++;

            if (counter == sensors.length) dataWrapper.innerHTML = htmlText;
        })
        .catch(error => console.log(error));
}

const loadSensors = () => {
    const data = new FormData();
    data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/station/sensors/' + select.value);

    fetch('inc/ajax.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.text())
        .then(response => {
            sensors = JSON.parse(response);

            console.log(sensors)

            htmlText += `<p>Sensory:</p>`

            sensors.forEach((sensor, index) => {
                loadSensorData(sensor.id, index);
            });
        })
        .catch(error => console.log(error));
}

const loadQuality = () => {
    dataWrapper.innerHTML = '<div class="loader"></div>'

    const data = new FormData();
    data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/' + select.value);

    fetch('inc/ajax.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.text())
        .then(response => {
            quality = JSON.parse(response);

            htmlText += `
            <p class="data__date">
                <span>Data pomiaru: </span>
                <span>${quality.stCalcDate}</span>
            </p>
            <p class="data__quality">
                <span>Index jakości powietrza: </span>
                <span class="js-quality">${quality.stIndexLevel.indexLevelName}</span>
            </p>
            `

            loadSensors();
        })
        .catch(error => console.log(error));
}


const loadStacions = () => {
    const data = new FormData();
    data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/station/findAll');

    fetch('inc/ajax.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.text())
        .then(response => {
            stations = JSON.parse(response);

            createSelect(stations);
            loadSelectValue();
            loadQuality();
        })
        .catch(error => console.log(error));
}

loadStacions();

select.addEventListener('change', () => {

    localStorage.setItem('station', select.value);
    htmlText = ``;
    counter = 0;
    loadQuality();
});