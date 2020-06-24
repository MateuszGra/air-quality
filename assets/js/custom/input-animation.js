const input = document.querySelector('.form__input');
const placeholder = document.querySelector('.form__placeholder');

input.addEventListener('focus', (e) => {
    placeholder.classList.add('active')
})

input.addEventListener('focusout', (e) => {
    if (input.value == '') {
        placeholder.classList.remove('active')
    }
})