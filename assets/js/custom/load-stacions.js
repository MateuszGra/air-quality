const createSelect = (stations) => {
    stations.sort((a, b) => a.city.name.localeCompare(b.city.name));
    stations.forEach(station => {
        selectList.innerHTML += `<li class="search__list-el" data-id="${station.id}">${station.city.name}</li>`;
    });
}

const loadStacions = () => {
    dataWrapper.innerHTML = `
    <div class="loader">
        <img class="loader__cloud-1" src="assets/images/Loader1.svg">
        <img class="loader__cloud-2" src="assets/images/Loader2.svg">
    </div>`
    
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
            selectClose.classList.add('active');
        })
        .catch(error => console.log(error));
}