const showBtn = document.querySelector('.popup__btn');
const closeBtn = document.querySelector('.popup__close');
const popup = document.querySelector('.popup');

const tooglePopup = () => popup.classList.toggle('active');

closeBtn.addEventListener('click', tooglePopup);
closeBtn.addEventListener('touch', tooglePopup);
showBtn.addEventListener('click', tooglePopup);
showBtn.addEventListener('touch', tooglePopup);

document.addEventListener('click', function (e) {
    if (e.target.matches('.popup')) tooglePopup();
}, false);

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 27) {
        popup.classList.remove('active');
    }
});