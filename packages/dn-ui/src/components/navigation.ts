// ========== TIPOS ==========
type IconClass = string;
type HTMLElementOrNull = HTMLElement | null;

type NavigationConfig = {
  navigationId?: string;
  toggleButtonId?: string;
  contextId?: string;
  contextToggleClass?: string;
  backdropCloseId?: string;
  iconClassDown?: IconClass;
  iconClassUp?: IconClass;
  iconDownUpToggle?: boolean;
  collapseShowClass?: string;
};

// ========== FUNCIONES AUXILIARES ==========
const ActiveParentNavigation = (
  linkElement: Element,
  navigationId: string,
  iconClassUp: IconClass,
  iconClassDown: IconClass,
  collapseShowClass: string,
): void => {
  const parentNode = linkElement?.parentElement;

  if (parentNode?.tagName === 'UL' && parentNode?.id !== navigationId) {
    // Abrir contenedor
    parentNode.classList.add(collapseShowClass);

    // Alternar icono
    const iconPrevious = parentNode.previousElementSibling?.querySelector('.toggle') as HTMLElement | null;
    if (iconPrevious) {
      iconClassDown.split(' ').forEach(cls => iconPrevious.classList.remove(cls));
      iconClassUp.split(' ').forEach(cls => iconPrevious.classList.add(cls));
    }
  }

  // Recursividad
  if (parentNode && parentNode.id !== navigationId) {
    ActiveParentNavigation(parentNode, navigationId, iconClassUp, iconClassDown, collapseShowClass);
  }
};

const ActiveNavigation = (
  links: NodeListOf<HTMLAnchorElement> | HTMLAnchorElement[],
  navigationId = '',
  iconClassUp = '',
  iconClassDown = '',
  collapseShowClass = '',
): typeof links => {
  const currentUrl = document.location.href.replace(/#$/, '');

  links.forEach((link) => {
    if (link.href === currentUrl && link.href !== '#') {
      link.parentElement?.classList.add('is-active');
      ActiveParentNavigation(link, navigationId, iconClassUp, iconClassDown, collapseShowClass);
    }
  });

  return links;
};

// ========== MAIN NAVIGATION ==========

const Navigation = ({
  navigationId = "dnNavigation",
  toggleButtonId = "dnNavigationToggle",
  contextId = "siteLayout",
  contextToggleClass = "navigation-is-show",
  backdropCloseId = 'dnNavigationBackdrop',
  iconClassDown = 'icon-down',
  iconClassUp = 'icon-up',
  collapseShowClass = 'block',
  iconDownUpToggle = false,
}: NavigationConfig = {}) => {

  const NavigationApi = {
    navigation: null as HTMLElementOrNull,
    context: null as HTMLElementOrNull,
    toggleAction: null as HTMLElementOrNull,
    closeAction: null as HTMLElementOrNull,

    init(): void {
      this.navigation = document.getElementById(navigationId);
      if (!this.navigation) {
        console.warn(`Not found ${navigationId}`);
        return;
      }

      const toggleSubNavigation = (content: Element, iconToggleEle: HTMLElement): void => {
        const isShow = content.classList.contains(collapseShowClass);

        if (isShow) {
          iconClassUp.split(' ').forEach(cls => iconToggleEle.classList.remove(cls));
          iconClassDown.split(' ').forEach(cls => iconToggleEle.classList.add(cls));
        } else {
          iconClassDown.split(' ').forEach(cls => iconToggleEle.classList.remove(cls));
          iconClassUp.split(' ').forEach(cls => iconToggleEle.classList.add(cls));
        }

        content.classList.toggle(collapseShowClass);
      };

      // Subnavegaciones
      const items = this.navigation.querySelectorAll("li");
      items.forEach(ele => {
        if (ele.childElementCount === 2) {
          const toggle = ele.firstElementChild as HTMLElement;
          const content = ele.lastElementChild as HTMLElement;

          const iconToggleEle = document.createElement('i');
          iconClassDown.split(' ').forEach(cls => iconToggleEle.classList.add(cls));
          iconToggleEle.classList.add('toggle');
          toggle.appendChild(iconToggleEle);
          toggle.classList.add('is-toggle');

          const handler = (e: Event) => {
            e.preventDefault();
            toggleSubNavigation(content, iconToggleEle);
          };

          if (iconDownUpToggle) {
            iconToggleEle.addEventListener('click', handler);
          } else {
            toggle.addEventListener('click', handler);
          }
        }
      });

      this.context = document.getElementById(contextId);

      this.toggleAction = document.getElementById(toggleButtonId);
      this.toggleAction?.addEventListener('click', () => {
        this.toggle();
      });

      if (backdropCloseId) {
        this.closeAction = document.getElementById(backdropCloseId);
        if (this.closeAction) {
          this.closeAction.addEventListener('click', () => {
            this.close();
          });

          if (this.closeAction.hasChildNodes()) {
            [...this.closeAction.children].forEach(child => {
              child.addEventListener('click', e => e.stopPropagation());
            });
          }

          this.navigation.addEventListener('click', e => e.stopPropagation());
        }
      }

      this.setActive();
    },

    open(): void {
      this.context?.classList.add(contextToggleClass);
    },

    close(): void {
      this.context?.classList.remove(contextToggleClass);
    },

    toggle(): void {
      this.context?.classList.toggle(contextToggleClass);
    },

    setActive(): void {
      if (this.navigation) {
        ActiveNavigation(
          Array.from(this.navigation.querySelectorAll('a')),
          navigationId,
          iconClassUp,
          iconClassDown,
          collapseShowClass
        );
      }
    }
  };

  NavigationApi.init();
  return NavigationApi;
};

export { Navigation, ActiveNavigation };
