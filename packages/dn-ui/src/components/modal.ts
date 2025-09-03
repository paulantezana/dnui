import { Icon, type IconType } from '../utils/icon';

let closeModal = (m: HTMLElement) => {
  m.classList.remove('visible');
  document.body.style.overflow = 'auto';
};

type ModalCallback = (value?: string) => void;

interface ConfirmOptions {
  confirm?: boolean;
  title?: string;
  type?: IconType;
  content?: string;
  input?: boolean;
  inputValue?: string;
  inputType?: string;
  okClassNames?: string;
  cancelClassNames?: string;
  cancelText?: string;
  okText?: string;
  onOk?: ModalCallback;
  onCancel?: ModalCallback;
}

interface InfoOptions {
  title?: string;
  content?: string;
  okText?: string;
  onOk?: ModalCallback;
  [key: string]: any;
}

export const Modal = {
  dataModals: null as NodeListOf<HTMLElement> | null,
  openModals: [] as HTMLElement[],
  scope: undefined as HTMLDivElement | undefined,

  init() {
    this.render();

    // modal close the mask
    this.dataModals = document.querySelectorAll<HTMLElement>('[data-modal]');
    for (let i = 0; i < this.dataModals.length; i++) {
      const maskClose = this.dataModals[i].dataset.maskclose ?? 'true';
      if (maskClose === 'true') {
        this.dataModals[i].addEventListener('click', () => {
          const modalName = this.dataModals![i].dataset.modal;
          if (modalName) this.close(modalName);
        });
      }
    }

    // modal button trigger open
    const triggers = document.querySelectorAll<HTMLElement>('[data-modaltrigger]');
    for (let i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener('click', () => {
        const modalName = triggers[i].dataset.modaltrigger;
        if (modalName) this.open(modalName);
      });
    }

    // modal button close
    const closes = document.querySelectorAll<HTMLElement>('[data-modalclose]');
    for (let i = 0; i < closes.length; i++) {
      closes[i].addEventListener('click', () => {
        const modalName = closes[i].dataset.modalclose;
        if (modalName) this.close(modalName);
      });
    }

    // Listen keyboard close last open modal
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (Modal.openModals.length && event.key === 'Escape') {
        Modal.closeLastModal();
      }
    });
  },

  render() {
    if (this.scope === undefined) {
      this.scope = document.createElement('div');
      this.scope.classList.add(`modal-gScope`);
      document.body.appendChild(this.scope);
    }
  },

  open(modalName: string, cb?: () => void) {
    const modal = document.querySelector<HTMLElement>(`[data-modal="${modalName}"]`);

    if (!modal || this.openModals.includes(modal)) return;

    modal.classList.add('visible');

    const modalContent = modal.querySelector<HTMLElement>('.modal');
    if (modalContent) {
      modalContent.addEventListener('click', (event: Event) => {
        event.stopPropagation();
      });
    }

    document.body.style.overflow = 'hidden';
    this.openModals.push(modal);

    if (typeof cb === 'function') cb();
  },

  close(modalName: string, cb?: () => void) {
    const modal = document.querySelector<HTMLElement>(`[data-modal="${modalName}"]`);
    if (modal) {
      closeModal(modal);
      this.openModals = this.openModals.filter(m => m !== modal);
    } else {
      console.warn('Could not find modal with name "%s"', modalName);
    }

    if (typeof cb === 'function') cb();
  },

  closeLastModal(cb?: () => void) {
    const modal = this.openModals.pop();
    if (modal) closeModal(modal);
    if (typeof cb === 'function') cb();
  },

  confirm({
    confirm = true,
    title = '',
    type = 'question',
    content = '',
    input = false,
    inputValue = '',
    inputType = 'text',
    okClassNames = 'btn-primary',
    cancelClassNames = '',
    cancelText = 'Cancelar',
    okText = 'OK',
    onOk = () => { },
    onCancel = () => { }
  }: ConfirmOptions) {
    this.render();

    const uniqueIdName = 'confirm-modal' + (document.querySelectorAll(`.modal.confirm`).length + 1);
    const divEl = document.createElement('div');

    const cancelTemp = confirm
      ? `<button class="btn ${cancelClassNames}" id="cancel${uniqueIdName}" type="button">${cancelText}</button>`
      : '';

    const inputHtml = input
      ? `<div class="modal-confirmInput"><input type="${inputType}" class="form-control" id="input${uniqueIdName}" value="${inputValue}"></div>`
      : '';

    divEl.innerHTML = `
      <div class="modal-wrapper" data-modal="${uniqueIdName}" >
        <div class="modal confirm">
          <div class="modal-body confirm">
            <div class="modal-confirmIcon ${type}">${Icon[type]}</div>
            <div class="modal-confirmTile">${title}</div>
            <div class="modal-confirmContent">${content}</div>
            ${inputHtml}
            <div class="modal-confirmBtns">
              ${cancelTemp}
              <button class="btn ${okClassNames}" id="ok${uniqueIdName}" type="button">${okText}</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.scope!.appendChild(divEl);
    this.open(uniqueIdName);

    const inputData = document.getElementById(`input${uniqueIdName}`) as HTMLInputElement | null;
    if (inputData) inputData.focus();

    const btnCancel = document.getElementById(`cancel${uniqueIdName}`);
    if (btnCancel) {
      btnCancel.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.close(uniqueIdName);
        this.scope!.removeChild(divEl);
        onCancel(inputData ? inputData.value : '');
      });
    }

    const btnOk = document.getElementById(`ok${uniqueIdName}`);
    if (btnOk) {
      btnOk.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.close(uniqueIdName);
        this.scope!.removeChild(divEl);
        onOk(inputData ? inputData.value : '');
      });
      (btnOk as HTMLElement).focus();
    }
  },

  info({ title = '', content = '', okText = 'OK', onOk = () => { }, ...rest }: InfoOptions) {
    this.confirm({
      confirm: false,
      type: 'info',
      title,
      content,
      okText,
      onOk,
      ...rest
    });
  },

  success({ title = '', content = '', okText = 'OK', onOk = () => { }, ...rest }: InfoOptions) {
    this.confirm({
      confirm: false,
      type: 'success',
      title,
      content,
      okText,
      onOk,
      ...rest
    });
  },

  danger({ title = '', content = '', okText = 'OK', onOk = () => { }, ...rest }: InfoOptions) {
    this.confirm({
      confirm: false,
      type: 'danger',
      title,
      content,
      okText,
      onOk,
      ...rest
    });
  },

  warning({ title = '', content = '', okText = 'OK', onOk = () => { }, ...rest }: InfoOptions) {
    this.confirm({
      confirm: false,
      type: 'warning',
      title,
      content,
      okText,
      onOk,
      ...rest
    });
  }
};
