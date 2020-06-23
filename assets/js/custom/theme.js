const themeBtn = document.querySelector('.theme-switch');

const setTheme = (themeName) => {
    localStorage.setItem('theme', themeName);
    let root = document.documentElement;

    if (themeName == 'theme-light') {
        root.style.setProperty('--color-bg', '#F5F9FF');
        root.style.setProperty('--color-blur-light', '#FFFFFF');
        root.style.setProperty('--color-font', '#576A8A');
        root.style.setProperty('--color-blur-dark', '#D6E0F0');
        root.style.setProperty('--color-deep', 'transparent linear-gradient(180deg, #D6E0F0 0%, #D6E0F0 1%, #FFFFFF 100%) 0% 0% no-repeat padding-box');
    } else {
        root.style.setProperty('--color-bg', '#2B2F35');
        root.style.setProperty('--color-blur-light', '#3B3E42');
        root.style.setProperty('--color-font', '#F5F9FF');
        root.style.setProperty('--color-blur-dark', '#181C22');
        root.style.setProperty('--color-deep', 'transparent linear-gradient(360deg, #21262e 0%, #10131858 53%, #202020 100%) 0% 0% no-repeat padding-box');
    }

}

const toggleTheme = () => {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
        themeBtn.classList.remove('active')
    } else {
        setTheme('theme-dark');
        themeBtn.classList.add('active')
    }
    switchImage();
}


if (localStorage.getItem('theme') === 'theme-dark') {
    setTheme('theme-dark');
    themeBtn.classList.add('active')
} else {
    setTheme('theme-light');
    themeBtn.classList.remove('active')
}

themeBtn.addEventListener('click', toggleTheme);
themeBtn.addEventListener('touch', toggleTheme);