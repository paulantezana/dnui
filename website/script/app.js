import '@dnui/ui';
import './theme';

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
