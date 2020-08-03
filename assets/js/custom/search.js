const select = document.querySelector('.search__select');
const selectList = document.querySelector('.search__list');
const searchWrapper = document.querySelector('.search');

const closeSearch = () => {
    selectList.classList.remove('active');
    searchWrapper.classList.remove('active');
}

const openSearch = () => {
    selectList.classList.add('active');
    if(selectList.offsetHeight > 0) searchWrapper.classList.add('active');
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
            listEl[next].scrollIntoView();
            break;
        } else if ( i == listEl.length -1) {
            if (key == 40){
                listEl[0].classList.add('active');
                listEl[0].scrollIntoView();
            } else if (key == 38) {
                listEl[listEl.length -1].classList.add('active');
                listEl[listEl.length -1].scrollIntoView();
            }
        }
    }
}

document.addEventListener('keydown', function (e) {
    if (selectList.classList.contains('active')) {
        if (e.keyCode == 40 || e.keyCode == 38) handleArrowKey(e.keyCode);
        if (e.keyCode == 13) {
            const activeEl = document.querySelector('.search__list-el.active');
            if(activeEl) {
                select.dataset.id = activeEl.dataset.id;
                closeSearch();
            }
        }
    } else {
        if (e.keyCode == 13) {
            openSearch();
            select.focus();
        }
    }
});

document.addEventListener('mousemove', (e) => {
    const lastActive = document.querySelector('.search__list-el.active');
    if(lastActive) lastActive.classList.remove('active');
    if (e.target.matches('.search__list-el')) e.target.classList.add('active');
}, false);

const sortSelect = (stations) => {
    const sortedStations = stations.filter(a => a.city.name.toLowerCase().includes(select.value.toLowerCase()))
    sortedStations.sort((a, b) => {
        if (a.city.name.toLowerCase().startsWith(select.value.toLowerCase())) return -1;
        else if (a.city.name.toLowerCase().startsWith(select.value.toLowerCase())) return 1;
    });


    let sorted = '';
    sortedStations.forEach(station => {
        sorted += `<li class="search__list-el" data-id="${station.id}">${station.city.name}</li>`;
    });
    selectList.innerHTML = sorted;
}

select.addEventListener('input', (e) => {
    openSearch();
    sortSelect(stations);
    if(selectList.offsetHeight == 0) closeSearch();
});