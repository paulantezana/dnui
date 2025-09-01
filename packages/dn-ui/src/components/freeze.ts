export type FreezeOptions = {
  selector?: string;
  text?: string;
};

export const Freeze = {
  scope: undefined as HTMLElement | undefined,

  unFreeze(selector: string): void {
    const parentSelector: Element | Document = document.querySelector(selector) || document;
    const element = parentSelector.querySelector('.freeze-wrapper') as HTMLElement | null;

    if (element) {
      element.classList.add("is-unfreezing");

      setTimeout(() => {
        element.classList.remove("is-unfreezing");
        if (element.parentElement) {
          element.parentElement.removeChild(element);
        }
      }, 250);
    }
  },

  freeze(options: FreezeOptions = {}): void {
    this.render();

    if (!this.scope) return;

    const parent = document.querySelector(options.selector || '') || document.body;

    this.scope.setAttribute("data-text", options.text || "loading");

    if (document.querySelector(options.selector || '')) {
      this.scope.style.position = "absolute";
      (parent as HTMLElement).style.position = "relative";
    }

    parent.appendChild(this.scope);
  },

  render(): void {
    if (this.scope === undefined) {
      this.scope = document.createElement('div');
      this.scope.classList.add('freeze-wrapper');
      document.body.appendChild(this.scope);
    }
  }
};
