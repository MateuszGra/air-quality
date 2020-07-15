const showBtn = document.querySelectorAll('.popup-show-js');
const closeBtn = document.querySelectorAll('.popup-close-js');

const openPopup = (id) => {
    const popup = document.getElementById(id);
    popup.classList.add('active');
}

const closePopup = (id) => {
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

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 27) {
        closeBtn.forEach(btn => {
            closePopup(btn.dataset.id);
        });
    }
});