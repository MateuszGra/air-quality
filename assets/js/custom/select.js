const icon = document.querySelector('.search__icon');

select.addEventListener('focusout', () => {
    icon.classList.remove('active')
});

select.addEventListener('click', () => {
    icon.classList.toggle('active')
});

select.addEventListener('touch', () => {
    icon.classList.toggle('active')
});