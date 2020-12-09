const loadSensors = () => {
    const data = new FormData();
    data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/station/sensors/' + select.dataset.id);

    fetch('inc/ajax.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.json())
        .then(response => {
            sensors = response;
            htmlText += `<div class="box box--right box-shadow">`

            sensors.forEach((sensor, index) => {
                loadSensorData(sensor.id, index);
            });
        })
        .catch(error => {
            dataWrapper.innerHTML = `<h2 class="font-bad center">Wystąpił błąd, prosimy spróbować później.</h2>`;
            console.error(error)
        });
}