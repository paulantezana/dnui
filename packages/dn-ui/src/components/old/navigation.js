const ActiveParentNavigation = (linkElement, navigationId, iconClassUp, iconClassDown) => {
  // const parentNode = linkElement?.parentElement;
  // if (parentNode?.tagName === 'UL' && parentNode?.id !== navigationId) {
  //   // Open container
  //   parentNode.classList.add('is-show');

  //   // Set icon open
  //   let iconPrevious = parentNode?.previousElementSibling?.querySelector('.toggle');
  //   if (iconPrevious) {

  //     // Remove class down
  //     iconClassDown.split(' ').forEach(iClass => {
  //       iconPrevious.classList.remove(iClass);
  //     });

  //     // Add class up
  //     iconClassUp.split(' ').forEach(iClass => {
  //       iconPrevious.classList.add(iClass);
  //     });
  //   }
  // }

  // // Recursive
  // if (parentNode !== null && parentNode?.id !== navigationId) {
  //   ActiveParentNavigation(parentNode, navigationId, iconClassUp, iconClassDown);
  // }
}

const ActiveNavigation = (links, navigationId = '', iconClassUp = '', iconClassDown = '') => {
  if (links) {
    links.forEach(link => {
      let currentUrl = document.location.href;
      if (currentUrl.endsWith("#")) {
        currentUrl = currentUrl.slice(0, -1);
      }

      if (link.href === currentUrl && link.href !== '#') {
        link.parentNode.classList.add('is-active');
        ActiveParentNavigation(link, navigationId, iconClassUp, iconClassDown);
      }
    });
  }
  return links;
};

const Navigation = ({
  navigationId = "navigation",
  toggleButtonID = "navigation-toggle",
  contextId = "Site",
  toggleClass = "navigation-is-show",
  navigationCloseID = '',
  iconClassDown = 'icon-down',
  iconClassUp = 'icon-up',
  iconDownUpToggle = false,
}) => {

  let NavigationApi = {
    navigation: null,
    context: null,
    toggleAction: null,
    closeAction: null,
    init() {
      this.navigation = document.getElementById(navigationId);
      if (!this.navigation) {
        console.warn(`Not found ${navigationId}`);
        return;
      }

      const toggleSubNavigation = (content, iconToggleEle) => {
        let isShow = content.classList.contains('is-show') ?? false;

        if (isShow) {
          iconClassUp.split(' ').forEach(iClass => {
            iconToggleEle.classList.remove(iClass); // add Icon up
          });
          iconClassDown.split(' ').forEach(iClass => {
            iconToggleEle.classList.add(iClass);
          });
        } else {
          iconClassDown.split(' ').forEach(iClass => {
            iconToggleEle.classList.remove(iClass);
          });
          iconClassUp.split(' ').forEach(iClass => {
            iconToggleEle.classList.add(iClass); // add Icon up
          });
        }

        content.classList.toggle('is-show'); // add class show navigation
      }

      // Get all sub navigation
      let items = this.navigation.querySelectorAll("li"); // select all items
      for (let ele of items) {
        if (ele.childElementCount === 2) { // if subnavigation
          let toggle = ele.firstElementChild; // First element
          let content = ele.lastElementChild; // Second element

          // Creando un nuevo elemento e insertando justo despues del enlace
          let iconToggleEle = document.createElement('i');
          iconClassDown.split(' ').forEach(iClass => {
            iconToggleEle.classList.add(iClass);
          });

          iconToggleEle.classList.add('toggle');
          toggle.appendChild(iconToggleEle);
          toggle.classList.add('is-toggle');

          if (iconDownUpToggle) {
            iconToggleEle.addEventListener('click', e => {
              e.preventDefault();
              toggleSubNavigation(content, iconToggleEle);
            });
          } else {
            toggle.addEventListener('click', e => {
              e.preventDefault();
              toggleSubNavigation(content, iconToggleEle);
            });
          }
        }
      }

      // get context
      this.context = document.getElementById(contextId);

      // Toggle navigation
      this.toggleAction = document.getElementById(toggleButtonID);
      if (this.toggleAction) {
        this.toggleAction.addEventListener('click', () => {
          this.toggle();
        });
      }

      // Navigation close remove class
      if (navigationCloseID !== '') {
        this.closeAction = document.getElementById(navigationCloseID);
        if (this.closeAction) {
          this.closeAction.addEventListener('click', () => {
            this.close();
          });

          // Set stop propagation
          if (this.closeAction.hasChildNodes()) {
            [...this.closeAction.children].forEach(item => {
              item.addEventListener('click', e => {
                e.stopPropagation();
              });
            });
          }

          // Set Stop propagation
          this.navigation.addEventListener('click', e => {
            e.stopPropagation();
          });
        }
      }

      // actives
      this.setActive();
    },
    open() {
      if (this.context)
        this.context.classList.add(toggleClass);
    },
    close() {
      if (this.context)
        this.context.classList.remove(toggleClass);
    },
    toggle() {
      if (this.context)
        this.context.classList.toggle(toggleClass);
    },
    setActive() {
      if (this.navigation)
        ActiveParentNavigation([...this.navigation.querySelectorAll('a')], navigationId, iconClassUp, iconClassDown);
    }
  }

  NavigationApi.init();
  return NavigationApi;
};

export { Navigation, ActiveNavigation }
