(function () {
  'use strict';

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
          } else ;
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
    };

    Theme.init();
  })();

  document.addEventListener("DOMContentLoaded", () => {

    // Primary Menu
    PdNavigation({
      navigationId: "SiteMenu",
      toggleButtonID: "SiteMenu-toggle",
      toggleClass: "SiteMenu-is-show",
      contextId: "Site",
      parentClose: true,
      navigationCloseID: "SiteMenu-wrapper",
      iconClassDown: 'fas fa-chevron-down',
      iconClassUp: 'fas fa-chevron-up',
    });

    // Aside menu
    PdNavigation({
      navigationId: 'AsideMenu',
      toggleButtonID: 'AsideMenu-toggle',
      toggleClass: 'AsideMenu-is-show',
      navigationCloseID: 'AsideMenu-close',
    });

    // Code Box
    let codeBox = document.querySelectorAll('.CodeBox');

    if (codeBox) {
      codeBox.forEach(item => {
        let codeBoxShow = item.querySelector('.CodeBox-show');
        let codeBoxCode = item.querySelector('.CodeBox-code');
        let codeBoxCopy = item.querySelector('.CodeBox-copy');

        if (codeBoxShow && codeBoxCode) {
          codeBoxShow.addEventListener('click', () => {
            codeBoxCode.classList.toggle('is-expand');
          });

          if (codeBoxCopy) {
            codeBoxCopy.addEventListener('click', () => {
              let range = document.createRange();
              range.selectNode(codeBoxCode);
              window.getSelection().removeAllRanges();
              window.getSelection().addRange(range);
              document.execCommand("copy");
              window.getSelection().removeAllRanges();

              SnMessage.success({ content: 'copy success' });
            });
          }
        }

      });
    }
  });

})();
//# sourceMappingURL=app.js.map
