export const Theme = {
  theme: '',
  init() {
    // Root Element
    const rootElement = document.documentElement;

    // Load saved scheme
    const snSchemeSaved = sessionStorage.getItem(`scheme`);
    if (snSchemeSaved) {
      this.setTheme(snSchemeSaved);
    } else {
      if (rootElement.classList.contains(`theme-light`)) {
        this.setTheme('light');
      } else if (rootElement.classList.contains(`theme-dark`)) {
        this.setTheme('dark');
      } else {
        // rootElement.classList.contains('ssss') // Set custom theme name
      }
    }

    // Listener
    const radioElements = document.getElementsByName('snTheme');
    radioElements.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.setTheme(radio.value);
      });
    });
  },
  setTheme(themeName) {
    document.documentElement.classList.remove(`theme-dark`);
    document.documentElement.classList.remove(`theme-light`);
    const radioElements = document.getElementsByName(`theme`);

    // Set current theme name
    if (themeName === 'light') {
      document.documentElement.classList.add(`theme-light`);
      this.theme = 'light';
    } else if (themeName === 'dark') {
      document.documentElement.classList.add(`theme-dark`);
      this.theme = 'dark';
    } else if (themeName === 'system') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add(`theme-dark`);
        this.theme = 'dark';
      } else {
        document.documentElement.classList.add(`theme-light`);
        this.theme = 'light';
      }
    } else {
      document.documentElement.classList.add(`theme-` + themeName);
      this.theme = themeName;
    }

    // Save in storage
    sessionStorage.setItem(`scheme`, this.theme);

    // Set checked in circle button
    radioElements.forEach(radio => {
      if (radio.value === themeName) {
        radio.checked = true;
      }
    });
  }
}
