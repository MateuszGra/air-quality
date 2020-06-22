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