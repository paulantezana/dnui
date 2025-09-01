export class Alert {
  static listen(): void {
    const alertEles: NodeListOf<Element> = document.querySelectorAll('.alert');
    [...alertEles].forEach((item: Element) => {
      const alertEle = item.querySelector('.alert-close') as HTMLElement | null;
      if (alertEle) {
        alertEle.addEventListener('click', () => {
          item.remove();
        });
      }
    });
  }
}
