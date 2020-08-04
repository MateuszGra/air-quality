const loadQuality = () => {
    const loader = document.querySelector('.loader');
    if(!loader){
        dataWrapper.innerHTML = `
        <div class="loader">
            <img class="loader__cloud-1" src="assets/images/Loader1.svg">
            <img class="loader__cloud-2" src="assets/images/Loader2.svg">
        </div>`
    }

    const data = new FormData();
    data.append('url', 'http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/' + select.dataset.id);

    fetch('inc/ajax.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.json())
        .then(response => {
            quality = response;
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
            <div class="data__wrapper">
                <div class="box box--left box-shadow">
                    <p class="station">${select.value}</p>
                    <p>
                        <span>Indeks jakości powietrza:</span>
                        <span class="quality ${color}">${quality.stIndexLevel.indexLevelName}</span>
                    </p>
                    <div class="image"></div>
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