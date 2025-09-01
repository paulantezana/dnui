export const Collapse = {
    storage: [] as Element[],

    init(): void {
      const dataCollapses: NodeListOf<HTMLElement> = document.querySelectorAll('[data-collapsetrigger]');

      for (let i = 0; i < dataCollapses.length; i++) {
        const element = dataCollapses[i];
        const exist = this.storage.find(item => item === element);

        if (!exist) {
          element.addEventListener('click', () => {
            const collapseName = element.dataset.collapsetrigger;
            if (!collapseName) return;

            const collapse = document.querySelector<HTMLElement>(`[data-collapse="${collapseName}"]`);
            if (collapse) {
              collapse.classList.toggle('collapse-expanded');
            }
          });

          this.storage.push(element);
        }
      }
    },

    open(collapseName: string): void {
      const collapse = document.querySelector<HTMLElement>(`[data-collapse="${collapseName}"]`);
      if (collapse) {
        collapse.classList.add('collapse-expanded');
      }
    },

    close(collapseName: string): void {
      const collapse = document.querySelector<HTMLElement>(`[data-collapse="${collapseName}"]`);
      if (collapse) {
        collapse.classList.remove('collapse-expanded');
      }
    },

    reload(): void {
      this.init();
    }
  };
