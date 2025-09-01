import { Icon, type IconType } from '../utils/icon';

type MessageOptions = {
  content?: string;
  duration?: number;
};

export const Message = {
  transitionLength: 700,
  scope: undefined as HTMLElement | undefined,

  info({ content = '', duration = 6000 }: MessageOptions): void {
    this.message(content, duration, 'info', 'info');
  },

  success({ content = '', duration = 6000 }: MessageOptions): void {
    this.message(content, duration, 'success', 'success');
  },

  danger({ content = '', duration = 6000 }: MessageOptions): void {
    this.message(content, duration, 'danger', 'danger');
  },

  warning({ content = '', duration = 6000 }: MessageOptions): void {
    this.message(content, duration, 'warning', 'warning');
  },

  message(
    message: string,
    time: number,
    addClass: string = 'default',
    type: IconType = 'question'
  ): void {
    if (!time || time === ('default' as any)) {
      time = 20000;
    }

    this.render();
    if (!this.scope) return;

    const messageEl = document.createElement('div');
    const messageElClose = document.createElement('span');

    messageEl.classList.add('message', addClass);
    messageEl.innerHTML = `
      <span class="message-icon">${Icon[type] ?? ''}</span>
      <span class="message-content">${message}</span>
    `;

    messageElClose.innerHTML = 'x';
    messageElClose.classList.add('message-close');
    messageEl.appendChild(messageElClose);

    this.scope.prepend(messageEl);

    setTimeout(() => {
      messageEl.classList.add('open');
    });

    const removeTimeOut = setTimeout(() => {
      messageEl.classList.remove('open');
    }, time);

    const removeTransitionOut = setTimeout(() => {
      this.scope?.removeChild(messageEl);
    }, time + this.transitionLength);

    messageElClose.addEventListener('click', () => {
      messageEl.classList.remove('open');
      setTimeout(() => {
        this.scope?.removeChild(messageEl);
      }, this.transitionLength);
      clearTimeout(removeTimeOut);
      clearTimeout(removeTransitionOut);
    });
  },

  render(): void {
    if (this.scope === undefined) {
      this.scope = document.createElement('div');
      this.scope.classList.add('message-scope');
      document.body.appendChild(this.scope);
    }
  }
};
