export function Input(): void {
  const togglePassword: NodeListOf<HTMLElement> = document.querySelectorAll('.togglePassword');

  togglePassword.forEach((item: HTMLElement) => {
    let state = 0;

    item.addEventListener('click', () => {
      const input = item.previousElementSibling as HTMLInputElement | null;

      if (input && (input.type === 'password' || input.type === 'text')) {
        input.type = state === 0 ? 'text' : 'password';
        state = state === 0 ? 1 : 0;
      }
    });
  });
}
