export default class EventBus {
    public _eventTree: Record<string, any> = {}
    /**
   * Register an event listener.
   * @param eventName event name
   * @param cb callback
   */
    on(eventName: string, cb: Function) {
        const fns = this._eventTree[eventName];
        if (Array.isArray(fns)) {
            fns.push(cb);
        } else {
            this._eventTree[eventName] = [cb];
        }
    }

    /**
     * Emit an event.
     * @param eventName event name
     * @param payload arguments forwarded to listeners
     */
    emit(eventName: string, ...payload: any) {
        const fns = this._eventTree[eventName];
        if (Array.isArray(fns)) {
            fns.forEach((fn) => fn(...payload));
        }
    }

    /**
     * Remove a listener.
     * @param eventName event name
     * @param cb the callback to remove
     */
    off(eventName: string, cb: Function) {
        const fns = this._eventTree[eventName];
        const index = fns.find((fn: Function) => fn === cb);
        if (Array.isArray(fns) && index) {
            fns.splice(index, 1);
        }
    }
}
