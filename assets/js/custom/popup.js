const showBtn = document.querySelectorAll('.popup-show-js');
const closeBtn = document.querySelectorAll('.popup-close-js');

const openPopup = (id) => {
    document.body.classList.add('block');
    const popup = document.getElementById(id);
    popup.classList.add('active');
}

const closePopup = (id) => {
    document.body.classList.remove('block');
    const popup = document.getElementById(id);
    popup.classList.remove('active');
    returnHTML.innerHTML = '';
}

closeBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        closePopup(btn.dataset.id);
    });
});

showBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        openPopup(btn.dataset.id);
    });
});

document.addEventListener('click', function (e) {
    if (e.target.matches('.popup')) {
        closePopup(e.target.dataset.id);
    }
}, false);

document.addEventListener('keydown', function (e) {
    if (e.key == 'Escape') {
        closeBtn.forEach(btn => {
            closePopup(btn.dataset.id);
        });
    }
});