import { computePosition, flip } from '@floating-ui/dom';
import type { OpenMenu, VirtualPosition, MenuOptions, ComputeOptions } from './menuType';

export class Menu {
  static openMenu: OpenMenu = null;
  static scope: HTMLElement;

  public static listen(): void {
    document.querySelectorAll<HTMLElement>('[data-menutrigger]').forEach(trigger => {
      const menuName = trigger.getAttribute('data-menutrigger');
      const menu = document.querySelector<HTMLElement>(`[data-menu="${menuName}"]`);

      if (menu && !trigger.classList.contains('listen')) {
        trigger.classList.add('listen');
        trigger.addEventListener('click', () => {
          const sameTrigger = Menu.openMenu?.trigger?.contains(trigger);

          if (sameTrigger) { // Cerrar cuando el overlay ya esta abierto y es el mismo trigger
            Menu.closeLastMenu();
          } else {
            Menu._openBasic(trigger, menu);
          }
        });
      }
    });

    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!Menu.openMenu) {
        return;
      }

      const sameTrigger = Menu.openMenu.trigger?.contains(target);
      const sameOverlay = Menu.openMenu.overlay?.contains(target);

      if (Menu.openMenu.autoClose) { // Cerrar automaticamente
        if (!sameTrigger) { // No cerrar cuando se hace click en el mismo trigger (cerrar la abrir)
          Menu.closeLastMenu();
        }
      } else {
        if (!sameOverlay) { // No cerrar cunado se hace click en el overlay
          if (!sameTrigger) { // No cerrar cuando se hace click en el mismo trigger (cerrar la abrir)
            Menu.closeLastMenu();
          }
        }
      }
    }, {
      capture: true, // Importante para que capture el click antes del trigger
    });

    window.addEventListener('resize', () => {
      Menu.closeLastMenu();
    });
  }

  private static _openBasic(trigger: HTMLElement, overlay: HTMLElement): void {
    const shouldClose = overlay.getAttribute('data-menuautoclose') !== 'false';
    overlay.classList.add('show');
    Menu.computePosition({ trigger, overlay });
    Menu.openMenu = { overlay: overlay, trigger: trigger, type: 'toggle', autoClose: shouldClose };
  }

  public static open(menuName: string): void {
    const trigger = document.querySelector<HTMLElement>(`[data-menutrigger="${menuName}"]`);
    const overlay = document.querySelector<HTMLElement>(`[data-menu="${menuName}"]`);
    if (trigger && overlay) {
      if (Menu.openMenu?.overlay === overlay) {
        Menu.closeLastMenu();
      } else {
        Menu.closeLastMenu();

        setTimeout(() => {
          const shouldClose = overlay.getAttribute('data-menuautoclose') !== 'false';

          overlay.classList.add('show');
          overlay.style.left = '50%';
          overlay.style.top = '50%';
          overlay.style.transform = 'translate(-50%, -50%)';
          // Menu.computePosition({ trigger, menu });
          Menu.openMenu = { overlay, trigger, type: 'toggle', autoClose: shouldClose };
        }, 10);
      }
    }
  }

  public static portal(
    trigger: HTMLElement | VirtualPosition,
    menuDomOrHtml: HTMLElement | string,
    options: MenuOptions = {}
  ): void {
    const { key = null, toggle = true, autoClose = true } = options;
    const isDomElement = !!(trigger as any).parentNode;

    Menu.createScope();

    if (
      key &&
      Menu.openMenu?.key &&
      Menu.openMenu.key === key &&
      isDomElement &&
      toggle
    ) {
      Menu.closeLastMenu();
      return;
    }

    Menu.closeLastMenu();

    const menuContainer = document.createElement('div');
    menuContainer.classList.add('menu-overlay');

    if (menuDomOrHtml instanceof Element) {
      menuContainer.appendChild(menuDomOrHtml);
    } else {
      menuContainer.innerHTML = menuDomOrHtml;
    }

    Menu.scope.appendChild(menuContainer);
    menuContainer.classList.add('show');

    if (!isDomElement) {
      Menu.computeVirtualPosition({ position: trigger as VirtualPosition, menu: menuContainer });
    } else {
      Menu.computePosition({ trigger: trigger as HTMLElement, overlay: menuContainer });
    }

    Menu.openMenu = { overlay: menuContainer, trigger: trigger as HTMLElement, type: 'portal', key, autoClose };
  }

  private static computePosition({
    trigger,
    overlay,
    // options = {},
  }: {
    trigger: HTMLElement;
    overlay: HTMLElement;
    options?: ComputeOptions;
  }): void {
    computePosition(trigger, overlay, {
      placement: 'bottom-start',
      middleware: [flip()],
    }).then(({ x, y }) => {
      Object.assign(overlay.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }

  private static computeVirtualPosition({
    position,
    menu,
    // options = {},
  }: {
    position: VirtualPosition;
    menu: HTMLElement;
    options?: ComputeOptions;
  }): void {
    const virtualEl = {
      getBoundingClientRect(): DOMRect {
        return {
          width: 0,
          height: 0,
          x: position.x,
          y: position.y,
          top: position.y,
          left: position.x,
          right: position.x,
          bottom: position.y,
          toJSON: () => '',
        } as DOMRect;
      },
    };

    computePosition(virtualEl, menu, {
      placement: 'bottom-start',
      middleware: [flip()],
    }).then(({ x, y }) => {
      Object.assign(menu.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }

  private static createScope(): void {
    if (!Menu.scope) {
      Menu.scope = document.createElement('div');
      Menu.scope.classList.add('MenuScope');
      document.body.appendChild(Menu.scope);
    }
  }

  public static closeLastMenu(): void {
    if (!Menu.openMenu) {
      return;
    }

    if (!Menu.openMenu.overlay) {
      return;
    }

    if (Menu.openMenu.type === 'portal') {
      Menu.scope.removeChild(Menu.openMenu.overlay);
    } else {
      Menu.openMenu.overlay.classList.remove('show');

      // Remove inline styles
      Menu.openMenu.overlay.style.left = '';
      Menu.openMenu.overlay.style.top = '';
      Menu.openMenu.overlay.style.transform = '';
    }

    Menu.openMenu = null;
  }
}

export default Menu;
