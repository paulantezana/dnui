export type OpenMenu = {
  overlay: HTMLElement | null;
  trigger: HTMLElement | null;
  type: 'toggle' | 'portal' | null;
  key?: string | null;
  autoClose?: boolean;
} | null;

export type VirtualPosition = {
  x: number;
  y: number;
};

export type MenuOptions = {
  key?: string | null;
  toggle?: boolean;
  autoClose?: boolean;
};

export type ComputeOptions = {
  offset?: number;
};
