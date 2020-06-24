const themeBtn = document.querySelector('.theme-switch');

const setTheme = (themeName) => {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
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