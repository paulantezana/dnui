export const Tab = {
  storage: [] as HTMLElement[],

  listen(): void {
    const tabs = document.querySelectorAll<HTMLElement>('.tab');

    tabs.forEach(tab => {
      const alreadyInitialized = this.storage.includes(tab);
      if (alreadyInitialized) return;

      const snTabHeader = tab.firstElementChild as HTMLElement | null;
      const snTabBody = tab.lastElementChild as HTMLElement | null;

      if (!snTabHeader || !snTabBody) return;

      const dnTabTitles = Array.from(snTabHeader.children) as HTMLElement[];
      const dnTabContents = Array.from(snTabBody.children) as HTMLElement[];

      const openTab = (index: number): void => {
        dnTabTitles.forEach(title => title.classList.remove('is-active'));
        dnTabContents.forEach(content => content.classList.remove('is-active'));

        if (dnTabTitles[index]) dnTabTitles[index].classList.add('is-active');
        if (dnTabContents[index]) dnTabContents[index].classList.add('is-active');
      };

      dnTabTitles.forEach((title, index) => {
        title.addEventListener('click', () => {
          openTab(index);
        });
      });

      openTab(0); // Activar la primera pestaña por defecto
      this.storage.push(tab);
    });
  },

  reload(): void {
    this.listen();
  }
};
