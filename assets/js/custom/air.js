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


const loadSelectValue = () => {
    if (localStorage.getItem('station') != null) {
        select.value = localStorage.getItem('station');
    } else {
        select.value = 117;
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
                    break;
                }
            }

            let maxValue;
            let unit = 'µg/m3';
            switch (sensors[index].param.idParam) {
                case 1:
                    maxValue = 350;
                    break;
                case 3:
                    maxValue = 50;
                    break;
                case 5:
                    maxValue = 120;
                    break;
                case 6:
                    maxValue = 200;
                    break;
                case 8:
                    maxValue = 10000;
                    unit = 'mg/m3';
                    break;
                case 10:
                    maxValue = 5;
                    break;
                case 69:
                    maxValue = 25;
                    break;
            }

            const percent = Math.round(value / maxValue * 100);

            let color = '';
            if (percent < 40) {
                color = 'bg-good';
            } else if (percent < 100) {
                color = 'bg-neutral';
            } else {
                color = 'bg-bad';
            }


            if (value != 'brak danych') {
                htmlText += `
            <div class="sensor">
                <p>
                    <span class="sensor__label" data-id="${sensors[index].param.idParam}">${sensors[index].param.paramName}: </span>
                    <span>${value} ${unit}</span>
                </p>
                <div class="sensor__row">
                    <div class="sensor__bar">
                        <div class="sensor__indicator ${color}" style="width: ${percent}%"></div>
                    </div>

                    <span class="sensor__percent ${color}" >${percent}%</span>
                </div>
            </div>
            `
            }

            counter++;
            if (counter == sensors.length) {
                htmlText += `</div>`
                dataWrapper.innerHTML = htmlText;
            }
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
            htmlText += `<div class="box box--right">`

            sensors.forEach((sensor, index) => {
                loadSensorData(sensor.id, index);
            });
        })
        .catch(error => console.log(error));
}

const loadQuality = () => {
    dataWrapper.innerHTML = `
    <div class="loader">
        <img class="loader__cloud-1" src="./assets/images/Loader1.svg">
        <img class="loader__cloud-2" src="./assets/images/Loader2.svg">
    </div>`

    const data = new FormData();
    data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/' + select.value);

    fetch('inc/ajax.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.text())
        .then(response => {
            quality = JSON.parse(response);
            let color = '';

            switch (quality.stIndexLevel.indexLevelName) {
                case 'Bardzo dobry':
                case 'Dobry':
                    color = 'font-good';
                    break;
                case 'Umiarkowany':
                case 'Dostateczny':
                    color = 'font-neutral';
                    break;
                case 'Zły':
                case 'Bardzo zły':
                    color = 'font-bad';
                    break;
            }

            htmlText += `
            <div class="box box--left">
                <p>
                    <span>Indeks jakości powietrza:</span>
                    <span class="quality ${color}">${quality.stIndexLevel.indexLevelName}</span>
                </p>
                <p>
                    <span>Data pomiaru:</span>
                    <span class="date">${quality.stCalcDate}</span>
                </p>
            </div>
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