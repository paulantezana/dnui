export const Tab = {
  storage: [],
  listen() {
    let tabs = document.querySelectorAll('.tab');
    for (let i = 0; i < tabs.length; i++) {
      let exist = this.storage.find(item => item === tabs[i]);
      if (!exist) {
        let snTabHeader = tabs[i].firstElementChild;
        if (!snTabHeader) {
          continue;
        }

        let snTabBody = tabs[i].lastElementChild;
        if (!snTabBody) {
          continue;
        }

        let dnTabContents = snTabBody.children;
        let dnTabTitles = snTabHeader.children;

        for (let t = 0; t < dnTabTitles.length; t++) {
          dnTabTitles[t].addEventListener('click', e => {
            openTab(t);
          });
        }

        const openTab = n => {
          for (let t = 0; t < dnTabTitles.length; t++) {
            dnTabTitles[t].classList.remove('is-active');
          }
          for (let c = 0; c < dnTabContents.length; c++) {
            dnTabContents[c].classList.remove('is-active');
          }
          dnTabContents[n].classList.add('is-active');
          dnTabTitles[n].classList.add('is-active');
        }

        openTab(0);

        this.storage.push(tabs[i]);
      }
    }
  },
  reload() {
    this.listen();
  }
}
