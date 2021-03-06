const form = document.querySelector('.form');
const returnHTML = document.querySelector('.form-return-js');
let vError;

const createTooltip = (text, parent) => {
    vError = document.createElement('div');
    vError.classList.add('form__tooltip');
    vError.textContent = text;
    parent.appendChild(vError);
    return false;
}

const validation = () => {
    const input = document.querySelector('.form__input');
    const inputLabel = document.querySelector('.form__input-label');
    const checkboxLabel = document.querySelector('.form__checkbox-label');

    if (input.value == '') {
        input.focus();
        return createTooltip('To pole jest wymagane.', inputLabel)
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!input.value.match(emailPattern)) {
        input.focus();
        return createTooltip('Błędny adres e-mail.', inputLabel)
    }

    const checkbox = document.querySelector('.form__checkbox');
    if (checkbox.checked == false) {
        return createTooltip('Wymagana zgoda', checkboxLabel)
    }

    return true;
}

const addToDataBase = () => {
    returnHTML.innerHTML = '';
    const email = document.querySelector('.form__input');
    const loader = document.querySelector('.form__loader');
    loader.classList.add('active');
    const data = new FormData();
    data.append('email', email.value);
    data.append('id', select.dataset.id);

    fetch('inc/subscription.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.text())
        .then(response => {
            returnHTML.innerHTML = response;
            form.reset();
            loader.classList.remove('active');
        })
        .catch(error => console.log(error));
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validation()) {
        addToDataBase();
    }
})

document.addEventListener('click', () => {
    if (vError) vError.remove();
})