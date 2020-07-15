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

const loadStacions = () => {
    const data = new FormData();
    data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/station/findAll');

    fetch('inc/ajax.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.json())
        .then(response => {
            stations = response;

            createSelect(stations);
            loadSelectValue();
            loadQuality();
        })
        .catch(error => console.log(error));
}