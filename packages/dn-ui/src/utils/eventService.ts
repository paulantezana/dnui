type EventHandler<T = any> = (payload: T) => void | Promise<void>;

export class EventService {
  private listeners = new Map<string, Set<EventHandler>>();

  on<T = any>(eventName: string, handler: EventHandler<T>) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(handler);
  }

  off<T = any>(eventName: string, handler: EventHandler<T>) {
    const handlers = this.listeners.get(eventName);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(eventName);
      }
    }
  }

  async emit<T = any>(eventName: string, payload: T): Promise<void> {
    const handlers = this.listeners.get(eventName);
    if (!handlers) return;

    const executions = Array.from(handlers).map(handler => handler(payload));
    await Promise.all(executions);
  }
}

export const eventService = new EventService();
