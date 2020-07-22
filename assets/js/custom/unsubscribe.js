const params = new URLSearchParams(window.location.search);
const unsubHTML = document.querySelector('.unsub-return-js')
const token = params.get('t');
const id = params.get('un');

if (token && id) {
    openPopup('unsub');
    unsubHTML.innerHTML = `
    <div class="loader loader--no-margin">
        <img class="loader__cloud-1" src="assets/images/Loader1.svg">
        <img class="loader__cloud-2" src="assets/images/Loader2.svg">
    </div>`
    const data = new FormData();
    data.append('token', token);
    data.append('id', id);

    fetch('inc/unsub.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.text())
        .then(response => {
            unsubHTML.innerHTML = response;
        })
        .catch(error => {
            unsubHTML.innerHTML = response;
        });
}