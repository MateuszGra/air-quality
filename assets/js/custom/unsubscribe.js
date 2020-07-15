const params = new URLSearchParams(window.location.search);
const unsub = params.get('unsub');

if (unsub) {
    const data = new FormData();
    data.append('hash', unsub);

    fetch('inc/unsub.php', {
            method: "POST",
            body: data,
        })
        .then(response => response.text())
        .then(response => {
            console.log(response);
        })
        .catch(error => console.log(error));
}