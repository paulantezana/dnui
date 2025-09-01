// event-interfaces.ts
export interface AgEvent<T extends string = string> {
  type: T;
  event?: Event;
  eventPath?: EventTarget[];
  [key: string]: any;
}

export type IEventListener<T extends string> = (event: AgEvent<T>) => void;

export type IGlobalEventListener<T extends string> = (
  eventType: T,
  event: AgEvent<T>
) => void;

export interface IEventEmitter<T extends string> {
  addEventListener(
    eventType: T,
    listener: IEventListener<T>,
    async?: boolean,
    options?: AddEventListenerOptions
  ): void;
  removeEventListener(
    eventType: T,
    listener: IEventListener<T>,
    async?: boolean,
    options?: AddEventListenerOptions
  ): void;
}

export interface IFrameworkOverrides {
  wrapIncoming<T extends Function>(func: T): T;
}
