interface TooltipOptions {
  delay?: number;
  distance?: number;
}

export const Tooltip = function (options: TooltipOptions): void {
  const delay = options.delay || 0;
  const dist = options.distance || 10;

  document.body.addEventListener("mouseover", function (e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.hasAttribute("data-tooltip")) return;

    const tooltip = document.createElement("div");
    tooltip.className = "TabTooltip"; // Corregido: antes tenía un punto al inicio (".TabTooltip")
    tooltip.innerHTML = target.getAttribute("data-tooltip") || "";

    document.body.appendChild(tooltip);

    const pos = target.getAttribute("data-position") || "center top";
    const [posHorizontal, posVertical] = pos.split(" ");

    positionAt(target, tooltip, posHorizontal, posVertical);
  });

  document.body.addEventListener("mouseout", function (e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (target.hasAttribute("data-tooltip")) {
      setTimeout(function () {
        const oldTooltip = document.querySelector(".TabTooltip");
        if (oldTooltip) {
          document.body.removeChild(oldTooltip);
        }
      }, delay);
    }
  });

  function positionAt(
    parent: HTMLElement,
    tooltip: HTMLElement,
    posHorizontal: string,
    posVertical: string
  ): void {
    const parentCoords = parent.getBoundingClientRect();
    let left: number;
    let top: number;

    switch (posHorizontal) {
      case "left":
        left = parentCoords.left - dist - tooltip.offsetWidth;
        if (left < 0) {
          left = dist;
        }
        break;

      case "right":
        left = parentCoords.right + dist;
        if (left + tooltip.offsetWidth > document.documentElement.clientWidth) {
          left = document.documentElement.clientWidth - tooltip.offsetWidth - dist;
        }
        break;

      case "center":
      default:
        left = parentCoords.left + (parent.offsetWidth - tooltip.offsetWidth) / 2;
        break;
    }

    switch (posVertical) {
      case "center":
        top = (parentCoords.top + parentCoords.bottom) / 2 - tooltip.offsetHeight / 2;
        break;

      case "bottom":
        top = parentCoords.bottom + dist;
        break;

      case "top":
      default:
        top = parentCoords.top - tooltip.offsetHeight - dist;
        break;
    }

    if (left < 0) {
      left = parentCoords.left;
    }
    if (top < 0) {
      top = parentCoords.bottom + dist;
    }

    tooltip.style.position = "absolute";
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top + window.pageYOffset}px`;
  }
};
