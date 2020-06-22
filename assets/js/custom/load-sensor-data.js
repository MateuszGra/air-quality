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