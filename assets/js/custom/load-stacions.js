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