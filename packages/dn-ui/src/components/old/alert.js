export class Alert {
  static listen() {
    let alertEles = document.querySelectorAll(`.alert`);
    [...alertEles].forEach(item => {
      let alertEle = item.querySelector(`.alert-close`);
      if (alertEle) {
        alertEle.addEventListener('click', () => {
          item.remove();
        });
      }
    });
  }
}
