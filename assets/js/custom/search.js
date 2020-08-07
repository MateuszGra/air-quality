const select = document.querySelector('.search__select');
const selectList = document.querySelector('.search__list');
const searchWrapper = document.querySelector('.search');


const closeSearch = () => {
    selectList.classList.remove('active');
    searchWrapper.classList.remove('active');
}

const openSearch = () => {
    selectList.classList.add('active');
    if(selectList.firstChild) searchWrapper.classList.add('active');
    else searchWrapper.classList.remove('active');
}

select.addEventListener('click', () => {
    openSearch();
});

document.addEventListener('click', function (e) {
    if (e.target.matches('.search__list-el')) {
        select.dataset.id = e.target.dataset.id;
    }
    if (!e.target.matches('.search__select')) {
        closeSearch();
    }
}, false);


const handleArrowKey = (key) => {
    const listEl = document.querySelectorAll('.search__list-el');
    for (let i = 0; i < listEl.length; i++) {
        if(listEl[i].classList.contains('active')) {
            listEl[i].classList.remove('active');
            let next;
            if (key == 40){
                next = i + 1;
                if (next == listEl.length) next = 0;
            } else if (key == 38) {
                next = i - 1;
                if (next == -1) next = listEl.length -1;
            }
            listEl[next].classList.add('active');
            listEl[next].scrollIntoView({block: 'nearest'});
            break;
        } else if ( i == listEl.length -1) {
            if (key == 40){
                listEl[0].classList.add('active');
                listEl[0].scrollIntoView();
            } else if (key == 38) {
                listEl[listEl.length -1].classList.add('active');
                listEl[listEl.length -1].scrollIntoView({block: 'nearest'});
            }
        }
    }
}

document.addEventListener('keydown', function (e) {
    if (selectList.classList.contains('active')) {
        e.preventDefault();
        if (e.keyCode == 40 || e.keyCode == 38) handleArrowKey(e.keyCode);
        if (e.keyCode == 13) {
            const activeEl = document.querySelector('.search__list-el.active');
            if(activeEl) {
                select.dataset.id = activeEl.dataset.id;
                closeSearch();
            } else {
                const listEl = document.querySelector('.search__list-el');
                if(listEl) select.dataset.id = listEl.dataset.id;
                closeSearch();
            }
        }
    }
});

document.addEventListener('mousemove', (e) => {
    const lastActive = document.querySelector('.search__list-el.active');
    if(lastActive) lastActive.classList.remove('active');
    if (e.target.matches('.search__list-el')) e.target.classList.add('active');
}, false);

const sortSelect = (stations) => {
    let sortedStations = stations;
    if(select.value){
        sortedStations = stations.filter(a => a.city.name.toLowerCase().includes(select.value.toLowerCase()))
        sortedStations.sort((a, b) => {
            if (a.city.name.toLowerCase().startsWith(select.value.toLowerCase())) return -1;
            else if (a.city.name.toLowerCase().startsWith(select.value.toLowerCase())) return 1;
        });
    }


    let sorted = '';
    sortedStations.forEach(station => {
        sorted += `<li class="search__list-el" data-id="${station.id}">${station.city.name}</li>`;
    });
    selectList.innerHTML = sorted;
}

select.addEventListener('input', (e) => {
    sortSelect(stations);
    openSearch();
});