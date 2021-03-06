const select = document.querySelector('.search__select');
const selectList = document.querySelector('.search__list');
const searchWrapper = document.querySelector('.search');
const selectClose = document.querySelector('.search__close');

const closeSearch = () => {
    selectList.classList.remove('active');
    searchWrapper.classList.remove('active');
}

const openSearch = () => {
    selectList.classList.add('active');
    if(selectList.firstChild) searchWrapper.classList.add('active');
    else searchWrapper.classList.remove('active');
    if(select.value) selectClose.classList.add('active');
    else selectClose.classList.remove('active');
}

select.addEventListener('click', () => {
    openSearch();
});


selectClose.addEventListener('click', () => {
    select.value = null;
    sortSelect(stations);
    openSearch();
    select.focus();
});

document.addEventListener('click', function (e) {
    if (e.target.closest('.search__list-el')) {
        const target = e.target.closest('.search__list-el');
        select.dataset.id = target.dataset.id;
    }
    if (!e.target.closest('.search__select')) {
        closeSearch();
    }
}, false);

const handleArrowKey = (e) => {
    e.preventDefault();
    const listEl = document.querySelectorAll('.search__list-el');
    for (let i = 0; i < listEl.length; i++) {
        if(listEl[i].classList.contains('active')) {
            listEl[i].classList.remove('active');
            let next;
            if (e.key == 'ArrowDown'){
                next = i + 1;
                if (next == listEl.length) next = 0;
            } else if (e.key == 'ArrowUp') {
                next = i - 1;
                if (next == -1) next = listEl.length -1;
            }
            listEl[next].classList.add('active');
            listEl[next].scrollIntoView({block: 'nearest', inline: 'start'});
            break;
        } else if ( i == listEl.length -1) {
            if (e.key == 'ArrowDown'){
                listEl[0].classList.add('active');
                listEl[0].scrollIntoView();
            } else if (e.key == 'ArrowUp') {
                listEl[listEl.length -1].classList.add('active');
                listEl[listEl.length -1].scrollIntoView({block: 'nearest', inline: 'start'});
            }
        }
    }
}

document.addEventListener('keydown', function (e) {
    if (selectList.classList.contains('active')) {
        if (e.key == 'ArrowUp' || e.key== 'ArrowDown') handleArrowKey(e);
        if (e.key == 'Enter') {
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
        if (e.key == 'Escape') {
            closeSearch();
        }
    } else {
        if (e.key == 'Enter') {
            const popupSub = document.querySelector('.popup[data-id="sub"]');
            const popupUnsub = document.querySelector('.popup[data-id="unsub"]');
            if(!popupSub.classList.contains('active') && !popupUnsub.classList.contains('active') ){
                select.focus();
                openSearch();
            }
        }
    }
});

document.addEventListener('mousemove', (e) => {
    const lastActive = document.querySelector('.search__list-el.active');
    if (lastActive) lastActive.classList.remove('active');
    if (e.target.closest('.search__list-el')) {
        const target = e.target.closest('.search__list-el');
        target.classList.add('active');
    }
}, false);

const sortSelect = (stations) => {
    let sortedStations = stations;
    if (select.value) {
        sortedStations = stations.filter(a => a.city.name.toLowerCase().includes(select.value.toLowerCase()))
        sortedStations.sort((a, b) => {
            if (a.city.name.toLowerCase().startsWith(select.value.toLowerCase())) return -1;
            else if (a.city.name.toLowerCase().startsWith(select.value.toLowerCase())) return 1;
        });
    }

    let sorted = '';
    sortedStations.forEach(station => {
        let city = station.city.name;
        if (select.value) {
            const query = new RegExp(`(${select.value})`, 'i');
            city = station.city.name.replace(query, `<b>$1</b>`);
        }
        sorted += `<li class="search__list-el" data-id="${station.id}">${city}</li>`;
    });
    selectList.innerHTML = sorted;
}

select.addEventListener('input', (e) => {
    sortSelect(stations);
    openSearch();
});