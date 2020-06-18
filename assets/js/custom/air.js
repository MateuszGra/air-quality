const select = document.querySelector('.select');
const stationName = document.querySelector('.data__name');
const sensorsDOM = document.querySelector('.data__sensors');
let stations;
let sensors;
let sensorData = [];
let quality;

const createSelect = (stations) => {
    stations.forEach(station => {
        const option = document.createElement('option');
        option.text = station.stationName;
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

const loadSensorData = (id) => {
    const data = new FormData();
    data.append('id', id);

    fetch('inc/sensor-data.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.text())
        .then(response => {
            const respObject = JSON.parse(response);
            sensorData.push(respObject);
            let value = 'brak danych';

            for (let i = 0; i < respObject.values.length; i++) {
                if (respObject.values[i].value != null) {
                    value = respObject.values[i].value;
                    break
                }
            }

            sensorsDOM.innerHTML += `
            <p class="data__sensor">
                <span>${respObject.key}: </span>
                <span>${value}</span>
            </p>
            `
        })
        .catch(error => console.log(error));
}

const loadSensors = () => {
    const data = new FormData();
    data.append('id', select.value);

    fetch('inc/sensors.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.text())
        .then(response => {
            sensors = JSON.parse(response);

            sensors.forEach(sensor => {
                loadSensorData(sensor.id);
            });

        })
        .catch(error => console.log(error));
}

const loadQuality = () => {
    const data = new FormData();
    data.append('id', select.value);

    fetch('inc/quality.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.text())
        .then(response => {
            quality = JSON.parse(response);

            const dateDOM = document.querySelector('.js-date');
            dateDOM.innerText = quality.stCalcDate;

            const indexLevelDOM = document.querySelector('.js-quality');
            indexLevelDOM.innerText = quality.stIndexLevel.indexLevelName;
        })
        .catch(error => console.log(error));
}

fetch('inc/stations.php', {
        method: "GET",
    })
    .then(response => response.text())
    .then(response => {
        stations = JSON.parse(response);

        createSelect(stations);
        loadSelectValue();
        loadSensors();
        loadQuality();
    })
    .catch(error => console.log(error));



select.addEventListener('change', () => {

    localStorage.setItem('station', select.value);
    sensorsDOM.innerHTML = null;
    loadSensors();
    loadQuality();
});