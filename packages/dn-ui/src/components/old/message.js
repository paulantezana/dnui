import { Icon } from '../utils/conmon';

export const Message = {
  transitionLength: 700,
  scope: undefined,
  info({ content = '', duration = 6000 }) {
    this.message(content, duration, 'info', 'info');
  },
  success({ content = '', duration = 6000 }) {
    this.message(content, duration, 'success', 'success');
  },
  danger({ content = '', duration = 6000 }) {
    this.message(content, duration, 'danger', 'danger');
  },
  warning({ content = '', duration = 6000 }) {
    this.message(content, duration, 'warning', 'warning');
  },
  message(message, time, addClass = 'default', type = 'question') {
    if (!time || time === 'default') {
      time = 20000;
    }
    this.render();

    // Create elements
    let messageEl = document.createElement('div');
    let messageElClose = document.createElement('span');

    // Append elements
    messageEl.classList.add(`message`, addClass);
    messageEl.innerHTML = `<span class="message-icon">${Icon[type]}</span><span class="message-content">${message}</span>`;
    // --
    messageElClose.innerHTML = 'x';
    messageElClose.classList.add(`message-close`);
    messageEl.appendChild(messageElClose);
    // --
    this.scope.prepend(messageEl);

    // Timers
    setTimeout(
      () => messageEl.classList.add('open')
    );
    let removeTimeOut = setTimeout(
      () => messageEl.classList.remove('open'),
      time
    );
    let removeTransitionOut = setTimeout(
      () => this.scope.removeChild(messageEl),
      time + this.transitionLength
    );

    // Listeners
    messageElClose.addEventListener('click', () => {
      messageEl.classList.remove('open');
      setTimeout(
        () => this.scope.removeChild(messageEl),
        this.transitionLength
      );
      clearTimeout(removeTimeOut);
      clearTimeout(removeTransitionOut);
    });
  },
  render() {
    if (this.scope === undefined) {
      this.scope = document.createElement('div');
      this.scope.classList.add(`message-scope`);
      document.body.appendChild(this.scope);
    }
  }
}
