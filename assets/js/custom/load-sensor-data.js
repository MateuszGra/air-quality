const sensorsData = [];

const decimal = (n, k) => {
    const factor = Math.pow(10, k + 1);
    n = Math.round(Math.round(n * factor) / 10);
    return n / (factor / 10);
}

const sensorTemplate = (value, element) => {
    let maxValue;
    let unit = 'µg/m3';
    switch (element.param.idParam) {
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
    if (percent < 40) color = 'bg-good';
    else if (percent < 100) color = 'bg-neutral';
    else color = 'bg-bad';

    const sensor = {
        percent: percent,
        HTML: `
        <div class="sensor">
            <p>
                <span class="sensor__label" data-id="${element.param.idParam}">${element.param.paramName}: </span>
                <span>${decimal(value, 5)} ${unit}</span>
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
    sensorsData.push(sensor);
}

const loadSensorData = (id, index) => {
    const data = new FormData();
    data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/data/getData/' + id);

    fetch('inc/ajax.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.json())
        .then(response => {
            const sensorData = response;
            let value = false;

            for (let i = 0; i < sensorData.values.length; i++) {
                if (sensorData.values[i].value != null) {
                    value = sensorData.values[i].value;
                    break;
                }
            }

            if (value) sensorTemplate(value, sensors[index]);

            counter++;
            if (counter == sensors.length) {
                sensorsData.sort((a, b) => b.percent - a.percent);
                sensorsData.forEach(sensor => {
                    htmlText += sensor.HTML;
                });
                sensorsData.splice(0, sensorsData.length)
                htmlText += `
                    </div>
                </div>
                `
                dataWrapper.innerHTML = htmlText;
                switchImage();
            }
        })
        .catch(error => console.log(error));
}