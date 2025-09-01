import { computePosition, autoUpdate, offset, flip, shift } from '@floating-ui/dom';

class Menu {
  static openMenu = { element: null, type: null, key: null }; // Track the currently open menu and its type

  static listen() {
    document.querySelectorAll('[data-menutrigger]').forEach(trigger => {
      const menuName = trigger.getAttribute('data-menutrigger');
      const menu = document.querySelector(`[data-menu="${menuName}"]`);

      if (menu && !trigger.classList.contains('listen')) {
        trigger.classList.add('listen');
        trigger.addEventListener('click', (event) => {
          event.stopPropagation();
          event.preventDefault();

          if (Menu.openMenu.element === menu) {
            Menu.closeLastMenu();
          } else {
            Menu.closeLastMenu();

            menu.classList.add('show');
            Menu.computePosition({ trigger, menu });
            Menu.openMenu = { element: menu, type: 'toggle' };
          }
        });

        if (menu.classList.contains('no-closable')) {
          menu.addEventListener('click', e => {
            e.stopPropagation();
          });
        }
      }
    });

    // Auto close
    document.addEventListener('click', () => {
      Menu.closeLastMenu();
    });

    window.addEventListener('resize', () => {
      Menu.closeLastMenu();
    });
  }

  static portal(trigger, menuDomOrHtml, options = {}) {
    const { key = null, toggle = true } = options;
    const isDomElement = !!trigger.parentNode;

    Menu.createScope();

    if (key && Menu.openMenu.key && Menu.openMenu.key === key && isDomElement && toggle) {
      // Same Dom Element Origin
      Menu.closeLastMenu();
      return;
    }

    Menu.closeLastMenu();

    let menuContainer = document.createElement('div');
    menuContainer.classList.add(`menu-overlay`);

    if (menuDomOrHtml instanceof Element) {
      menuContainer.appendChild(menuDomOrHtml);
    } else {
      menuContainer.innerHTML = menuDomOrHtml;
    }
    Menu.scope.appendChild(menuContainer)
    menuContainer.classList.add('show');

    if (!isDomElement) {
      Menu.computeVirtualPosition({ position: trigger, menu: menuContainer });
    } else {
      Menu.computePosition({ trigger, menu: menuContainer });
    }

    Menu.openMenu = { element: menuContainer, type: 'portal', key };
  }

  static computePosition({ trigger, menu, options = {} }) {
    computePosition(trigger, menu, {
      placement: 'bottom-start',
      middleware: [
        // offset(options.offset || 0),
        flip(),
      ],
    }).then(({ x, y }) => {
      Object.assign(menu.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });




    // Auto-update position
    // Menu.cleanup = autoUpdate(trigger, menu, () => {
    //   computePosition(trigger, menu, {
    //     middleware: [
    //       offset(options.offset || 0),
    //       flip(),
    //       shift(),
    //     ],
    //   }).then(({ x, y }) => {
    //     Object.assign(menu.style, {
    //       left: `${x}px`,
    //       top: `${y}px`,
    //     });
    //   });
    // });
  }

  static computeVirtualPosition({ position, menu, options = {} }) {
    const virtualEl = {
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: position.x,
          y: position.y,
          top: position.y,
          left: position.x,
          right: position.x,
          bottom: position.y,
        };
      },
    };

    computePosition(virtualEl, menu, {
      placement: 'bottom-start',
      middleware: [
        // offset(options.offset || 5),
        flip(),
      ],
    }).then(({ x, y }) => {
      console.log('COMPUTE_', x, y);
      Object.assign(menu.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });

    // Auto-update position
    // Menu.cleanup = autoUpdate({
    //   getBoundingClientRect: () => ({
    //     x: position.x,
    //     y: position.y,
    //     width: 0,
    //     height: 0,
    //   })
    // }, menu, () => {
    //   computePosition({
    //     getBoundingClientRect: () => ({
    //       x: position.x,
    //       y: position.y,
    //       width: 0,
    //       height: 0,
    //     })
    //   }, menu, {
    //     middleware: [
    //       offset(options.offset || 5),
    //       flip(),
    //       shift(),
    //     ],
    //   }).then(({ x, y }) => {
    //     Object.assign(menu.style, {
    //       left: `${x}px`,
    //       top: `${y}px`,
    //     });
    //   });
    // });
  }

  static createScope() {
    if (Menu.scope === undefined) {
      Menu.scope = document.createElement('div');
      Menu.scope.classList.add('MenuScope');
      document.body.appendChild(Menu.scope);
    }
  }

  static closeLastMenu() {
    if (Menu.openMenu.element) {
      if (Menu.openMenu.type === 'portal') {
        Menu.scope.removeChild(Menu.openMenu.element);
      }
      else {
        Menu.openMenu.element.classList.remove('show');
      }
      Menu.openMenu = { element: null, type: null };
    }

    // if (Menu.cleanup) {
    //   Menu.cleanup();
    //   Menu.cleanup = null;
    // }
  }
}

export default Menu;
