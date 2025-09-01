export const LoadingState = (state: boolean, className: string, idName: string | null = null): void => {
  const actions: NodeListOf<HTMLElement> = document.querySelectorAll(`.${className}`);
  const submitBtn: HTMLElement | null = idName ? document.getElementById(idName) : null;

  if (state) {
    if (submitBtn) {
      submitBtn.setAttribute("disabled", "disabled");
      submitBtn.classList.add("loading");
    }
    actions.forEach((item) => {
      item.setAttribute("disabled", "disabled");
    });
  } else {
    if (submitBtn) {
      submitBtn.removeAttribute("disabled");
      submitBtn.classList.remove("loading");
    }
    actions.forEach((item) => {
      item.removeAttribute("disabled");
    });
  }
};
