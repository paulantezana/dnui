export function Ripple(): void {
  const buttons = document.getElementsByClassName('.btn');

  // Iteramos con una conversión de HTMLCollection a Array
  Array.prototype.forEach.call(buttons, function (b: HTMLButtonElement) {
    b.addEventListener('click', createRipple);
  });

  function createRipple(this: HTMLElement, e: MouseEvent): void {
    const existingRipple = this.querySelector('.ripple');
    if (existingRipple) {
      this.removeChild(existingRipple);
    }

    const circle = document.createElement('div');
    circle.classList.add('ripple');
    this.appendChild(circle);

    const d = Math.max(this.clientWidth, this.clientHeight);
    circle.style.width = `${d}px`;
    circle.style.height = `${d}px`;

    const rect = this.getBoundingClientRect();
    const left = e.clientX - rect.left - d / 2;
    const top = e.clientY - rect.top - d / 2;

    circle.style.left = `${left}px`;
    circle.style.top = `${top}px`;
  }

}
