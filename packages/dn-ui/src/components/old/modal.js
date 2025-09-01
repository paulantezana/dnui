import { Icon } from '../utils/conmon';
import { PREFIX } from '../utils/config';

let closeModal = (m) => {
  m.classList.remove('visible');
  document.body.style.overflow = 'auto';
};

export const Modal = {
  dataModals: null,
  openModals: [],
  scope: undefined,

  init() {
    this.render();

    // modal close the mask
    this.dataModals = document.querySelectorAll('[data-modal]')
    for (let i = 0; i < this.dataModals.length; i++) {
      let maskClose = this.dataModals[i].dataset.maskclose || true;
      if (maskClose === true || maskClose === "true") {
        this.dataModals[i].addEventListener('click', (event) => {
          let modalName = this.dataModals[i].dataset.modal
          this.close(modalName)
        })
      }
    }

    // modal button trigger open
    let triggers = document.querySelectorAll('[data-modaltrigger]')
    for (let i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener('click', (event) => {
        let modalName = triggers[i].dataset.modaltrigger
        this.open(modalName)
      })
    }

    // modal button close
    let closes = document.querySelectorAll('[data-modalclose]')
    for (let i = 0; i < closes.length; i++) {
      closes[i].addEventListener('click', (event) => {
        let modalName = closes[i].dataset.modalclose
        this.close(modalName)
      })
    }

    // Listen keyboart close las open modal
    window.addEventListener('keyup', (event) => {
      if (Modal.openModals.length && event.keyCode === 27) {
        Modal.closeLastModal()
      }
    })
  },

  render() {
    if (this.scope === undefined) {
      this.scope = document.createElement('div');
      this.scope.classList.add(`modal-gScope`);
      document.body.appendChild(this.scope);
    }
  },

  open(modalName, cb) {
    let modal = document.querySelector(`[data-modal="${modalName}"]`)

    // If modal is already open, don't do anything
    if (this.openModals.indexOf(modal) >= 0) return

    if (modal) {
      modal.classList.add('visible')

      // modal prevent events
      let modalContent = modal.querySelector(`.modal`);
      if (modalContent) {
        modalContent.addEventListener('click', (event) => {
          event.stopPropagation()
        })
      }

      // Disable parent scrolling when modal is open
      document.body.style.overflow = 'hidden'

      this.openModals.push(modal)
    } else {
      console.warn('Could not find modal with name "%s"', modalName)
    }

    typeof cb === 'function' && cb()
  },

  close(modalName, cb) {
    let modal = document.querySelector(`[data-modal="${modalName}"]`)

    // If modal is already open, don't do anything
    // if (this.openModals.indexOf(modal) >= 0) return

    if (modal) {
      closeModal(modal)

      this.openModals.pop(modal)
    } else {
      console.warn('Could not find modal with name "%s"', modalName)
    }

    typeof cb === 'function' && cb()
  },

  closeLastModal(cb) {
    let modal = this.openModals.pop()
    closeModal(modal)
    typeof cb === 'function' && cb()
  },

  confirm({
    confirm = true,
    title = '',
    type = 'question',
    content = '',
    input = false,
    inputValue = '',
    inputType = 'text',
    okClassNames = 'primary',
    cancelClassNames = '',
    cancelText = 'Cancelar',
    okText = 'OK',
    onOk = () => { },
    onCancel = () => { }
  }) {
    this.render();

    let uniqueIdName = PREFIX + 'ConfirmModal' + (document.querySelectorAll(`.modal.confirm`).length + 1);
    let divEl = document.createElement('div');

    let cancelTemp = confirm
      ? `<button class="btn ${cancelClassNames}" id="cancel${uniqueIdName}" type="button">${cancelText}</button>`
      : '';

    let inputHtml = input === true ? `<div class="modal-confirmInput"><input type="${inputType}" class="form-control" id="input${uniqueIdName}" value="${inputValue}"></div>` : '';

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

    this.scope.appendChild(divEl);
    this.open(uniqueIdName);

    let inputData = document.getElementById(`input${uniqueIdName}`);
    if (inputData) {
      inputData.focus();
    }
    let btnCancel = document.getElementById(`cancel${uniqueIdName}`);
    if (btnCancel) {
      btnCancel.addEventListener('click', e => {
        e.preventDefault();
        this.close(uniqueIdName);
        this.scope.removeChild(divEl);
        onCancel(inputData ? inputData.value : '');
      });
    }

    let btnOk = document.getElementById(`ok${uniqueIdName}`);
    if (btnOk) {
      btnOk.addEventListener('click', e => {
        e.preventDefault();
        this.close(uniqueIdName);
        this.scope.removeChild(divEl);
        onOk(inputData ? inputData.value : '');
      });
      btnOk.focus();
    }
  },

  info({
    title = '',
    content = '',
    okText = 'OK',
    onOk = () => { },
    ...rest
  }) {
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

  success({
    title = '',
    content = '',
    okText = 'OK',
    onOk = () => { },
    ...rest
  }) {
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

  danger({
    title = '',
    content = '',
    okText = 'OK',
    onOk = () => { },
    ...rest
  }) {
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

  warning({
    title = '',
    content = '',
    okText = 'OK',
    onOk = () => { },
    ...rest
  }) {
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
