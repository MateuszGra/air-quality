const switchImage = () => {
    const wrapper = document.querySelector('.image');
    const quality = wrapper.dataset.q;
    let theme = '';
    if (localStorage.getItem('theme') === 'theme-dark') theme = '_Noc';


    if (quality == 'Bardzo dobry' || quality == 'Dobry') {
        wrapper.innerHTML =
            `
            <img class="image__bg" src="./assets/images/Bardzo-dobry_Tlo${theme}.svg"> 
            <img class="image__cloud" src="./assets/images/Bardzo-dobry_Chmurka${theme}.svg"> 
            <img class="image__addition" src="./assets/images/Bardzo-dobry_Dodatek${theme}.svg"> 
            `
    } else if (quality == 'Umiarkowany' || quality == 'Dostateczny') {
        wrapper.innerHTML =
            `
            <img class="image__bg" src="./assets/images/Umiarkowany_Tlo${theme}.svg"> 
            <img class="image__cloud" src="./assets/images/Umiarkowany_Chmurka${theme}.svg"> 
            `
    } else if (quality == 'Zły' || quality == 'Bardzo zły') {
        wrapper.innerHTML =
            `
            <img class="image__bg" src="./assets/images/Zly_Tlo${theme}.svg"> 
            <img class="image__cloud" src="./assets/images/Zly_Chmurka${theme}.svg"> 
            `
    } else {
        wrapper.innerHTML =
            `
            <img class="image__bg" src="./assets/images/Brak-danych_Tlo${theme}.svg"> 
            <img class="image__cloud" src="./assets/images/Brak-danych-Chmurka${theme}.svg"> 
            `
    }
}