export const Theme = {
  theme: '' as string,

  init(): void {
    const rootElement = document.documentElement;

    // Load saved scheme
    const snSchemeSaved = sessionStorage.getItem('scheme');
    if (snSchemeSaved) {
      this.setTheme(snSchemeSaved);
    } else {
      if (rootElement.classList.contains('theme-light')) {
        this.setTheme('light');
      } else if (rootElement.classList.contains('theme-dark')) {
        this.setTheme('dark');
      } else {
        // Aquí se podría añadir una lógica para un tema personalizado si fuera necesario
      }
    }

    // Listener para radios con name="snTheme"
    const radioElements = document.getElementsByName('snTheme') as NodeListOf<HTMLInputElement>;
    radioElements.forEach((radio: HTMLInputElement) => {
      radio.addEventListener('change', () => {
        this.setTheme(radio.value);
      });
    });
  },

  setTheme(themeName: string): void {
    const root = document.documentElement;
    const radioElements = document.getElementsByName('theme') as NodeListOf<HTMLInputElement>;

    root.classList.remove('theme-dark', 'theme-light');

    if (themeName === 'light') {
      root.classList.add('theme-light');
      this.theme = 'light';
    } else if (themeName === 'dark') {
      root.classList.add('theme-dark');
      this.theme = 'dark';
    } else if (themeName === 'system') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('theme-dark');
        this.theme = 'dark';
      } else {
        root.classList.add('theme-light');
        this.theme = 'light';
      }
    } else {
      root.classList.add(`theme-${themeName}`);
      this.theme = themeName;
    }

    // Guardar tema
    sessionStorage.setItem('scheme', this.theme);

    // Seleccionar el radio correspondiente
    radioElements.forEach((radio: HTMLInputElement) => {
      radio.checked = radio.value === themeName;
    });
  }
};
