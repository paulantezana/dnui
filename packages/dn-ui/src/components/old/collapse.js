export const Collapse = {
  storage: [],
  init() {
    let dataCollapses = document.querySelectorAll('[data-collapsetrigger]');
    for (let i = 0; i < dataCollapses.length; i++) {
      let exist = this.storage.find(item => item === dataCollapses[i]);
      if (!exist) {
        dataCollapses[i].addEventListener('click', (e) => {
          let collapseName = dataCollapses[i].dataset.collapsetrigger;
          let collapse = document.querySelector(`[data-collapse="${collapseName}"]`);
          collapse.classList.toggle(`collapse-expanded`);
        });
        this.storage.push(dataCollapses[i]);
      }
    }
  },
  open(collapseName) {
    let collapse = document.querySelector(`[data-collapse="${collapseName}"]`);
    collapse.classList.add(`collapse-expanded`);
  },
  close(collapseName) {
    let collapse = document.querySelector(`[data-collapse="${collapseName}"]`);
    collapse.classList.remove(`collapse-expanded`);
  },
  reload() {
    this.init();
  }
};
