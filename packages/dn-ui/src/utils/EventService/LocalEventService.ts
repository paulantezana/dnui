import type { AgEvent, IFrameworkOverrides, IEventListener, IGlobalEventListener, IEventEmitter } from './event-interfaces';

export class LocalEventService<TEventType extends string> implements IEventEmitter<TEventType> {
  private allSyncListeners = new Map<TEventType, Set<IEventListener<TEventType>>>();
  private allAsyncListeners = new Map<TEventType, Set<IEventListener<TEventType>>>();

  private globalSyncListeners = new Set<IGlobalEventListener<TEventType>>();
  private globalAsyncListeners = new Set<IGlobalEventListener<TEventType>>();

  private frameworkOverrides?: IFrameworkOverrides;

  private asyncFunctionsQueue: (() => void)[] = [];
  private scheduled = false;

  // using an object performs better than a Set for the number of different events we have
  private firedEvents: { [key in TEventType]?: boolean } = {};

  public setFrameworkOverrides(frameworkOverrides: IFrameworkOverrides): void {
    this.frameworkOverrides = frameworkOverrides;
  }

  addEventListener(eventType: TEventType, listener: IEventListener<TEventType>, async = false): void {
    this.getListeners(eventType, async, true).add(listener);
  }

  removeEventListener(eventType: TEventType, listener: IEventListener<TEventType>, async = false): void {
    const listeners = this.getListeners(eventType, async, false);
    if (!listeners) return;

    listeners.delete(listener);
    if (listeners.size === 0) {
      (async ? this.allAsyncListeners : this.allSyncListeners).delete(eventType);
    }
  }

  dispatchEvent(event: AgEvent<TEventType>): void {
    this.dispatchToListeners(event, true);
    this.dispatchToListeners(event, false);
    this.firedEvents[event.type] = true;
  }

  dispatchEventOnce(event: AgEvent<TEventType>): void {
    if (!this.firedEvents[event.type]) {
      this.dispatchEvent(event);
    }
  }

  noRegisteredListenersExist(): boolean {
    return (
      this.allSyncListeners.size === 0 &&
      this.allAsyncListeners.size === 0 &&
      this.globalSyncListeners.size === 0 &&
      this.globalAsyncListeners.size === 0
    );
  }

  addGlobalListener(listener: IGlobalEventListener<TEventType>, async = false): void {
    this.getGlobalListeners(async).add(listener);
  }

  removeGlobalListener(listener: IGlobalEventListener<TEventType>, async = false): void {
    this.getGlobalListeners(async).delete(listener);
  }

  private getListeners(eventType: TEventType, async: boolean, autoCreate: boolean): Set<IEventListener<TEventType>> {
    const map = async ? this.allAsyncListeners : this.allSyncListeners;
    let listeners = map.get(eventType);
    if (!listeners && autoCreate) {
      listeners = new Set();
      map.set(eventType, listeners);
    }
    return listeners!;
  }

  private getGlobalListeners(async: boolean): Set<IGlobalEventListener<TEventType>> {
    return async ? this.globalAsyncListeners : this.globalSyncListeners;
  }

  private dispatchToListeners(event: AgEvent<TEventType>, async: boolean): void {
    const eventType = event.type;

    if (async && event.event instanceof Event) {
      event.eventPath = event.event.composedPath();
    }

    const runCallback = (fn: () => void) => {
      const wrapped = this.frameworkOverrides
        ? () => this.frameworkOverrides!.wrapIncoming(fn)()
        : fn;

      async ? this.dispatchAsync(wrapped) : wrapped();
    };

    const originalListeners = this.getListeners(eventType, async, false);
    if (originalListeners?.size) {
      const listeners = new Set(originalListeners);
      for (const listener of listeners) {
        if (!originalListeners.has(listener)) continue;
        runCallback(() => listener(event));
      }
    }

    const globalListeners = this.getGlobalListeners(async);
    if (globalListeners.size) {
      for (const listener of new Set(globalListeners)) {
        runCallback(() => listener(eventType, event));
      }
    }
  }

  // this gets called inside the grid's thread, for each event that it
  // wants to set async. the grid then batches the events into one setTimeout()
  // because setTimeout() is an expensive operation. ideally we would have
  // each event in it's own setTimeout(), but we batch for performance.
  private dispatchAsync(func: () => void): void {
    // add to the queue for executing later in the next VM turn
    this.asyncFunctionsQueue.push(func);

    // check if timeout is already scheduled. the first time the grid calls
    // this within it's thread turn, this should be false, so it will schedule
    // the 'flush queue' method the first time it comes here. then the flag is
    // set to 'true' so it will know it's already scheduled for subsequent calls.
    if (!this.scheduled) {
      // if not scheduled, schedule one
      const flush = () => {
        window.setTimeout(this.flushAsyncQueue.bind(this), 0);
      };
      this.frameworkOverrides ? this.frameworkOverrides.wrapIncoming(flush) : flush();
      // mark that it is scheduled
      this.scheduled = true;
    }
  }

  // this happens in the next VM turn only, and empties the queue of events
  private flushAsyncQueue(): void {
    this.scheduled = false;

    // we take a copy, because the event listener could be using
    // the grid, which would cause more events, which would be potentially
    // added to the queue, so safe to take a copy, the new events will
    // get executed in a later VM turn rather than risk updating the
    // queue as we are flushing it.
    const queueCopy = this.asyncFunctionsQueue.slice();
    this.asyncFunctionsQueue = [];

    // execute the queue
    queueCopy.forEach((func) => func());
  }
}
