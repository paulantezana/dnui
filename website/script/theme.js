(() => {
  const Theme = {
    theme: '',
    init() {
      // Root Element
      const rootElement = document.documentElement;

      // Load saved scheme
      const snSchemeSaved = sessionStorage.getItem(`pd-scheme`);
      if (snSchemeSaved) {
        this.setTheme(snSchemeSaved);
      } else {
        if (rootElement.classList.contains(`pd-theme-light`)) {
          this.setTheme('light');
        } else if (rootElement.classList.contains(`pd-theme-dark`)) {
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
      document.documentElement.classList.remove(`pd-theme-dark`);
      document.documentElement.classList.remove(`pd-theme-light`);
      const radioElements = document.getElementsByName(`pd-theme`);

      // Set current theme name
      if (themeName === 'light') {
        document.documentElement.classList.add(`pd-theme-light`);
        this.theme = 'light';
      } else if (themeName === 'dark') {
        document.documentElement.classList.add(`pd-theme-dark`);
        this.theme = 'dark';
      } else if (themeName === 'system') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add(`pd-theme-dark`);
          this.theme = 'dark';
        } else {
          document.documentElement.classList.add(`pd-theme-light`);
          this.theme = 'light';
        }
      } else {
        document.documentElement.classList.add(`pd-theme-` + themeName);
        this.theme = themeName;
      }

      // Save in storage
      sessionStorage.setItem(`pd-scheme`, this.theme);

      // Set checked in circle button
      radioElements.forEach(radio => {
        if (radio.value === themeName) {
          radio.checked = true;
        }
      });
    }
  }

  Theme.init();
})();
