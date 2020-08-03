const createSelect = (stations) => {
    stations.sort((a, b) => a.city.name.localeCompare(b.city.name));
    stations.forEach(station => {
        selectList.innerHTML += `<li class="search__list-el" data-id="${station.id}">${station.city.name}</li>`;
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
            stations.forEach(station => {
                if (station.addressStreet != null) station.city.name += ' ' + station.addressStreet;
            });

            createSelect(stations);
            loadSelectValue();
        })
        .catch(error => console.log(error));
}