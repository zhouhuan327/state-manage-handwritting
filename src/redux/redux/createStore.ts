type Action<S = any> = { type: string; payload?: S };
type Reducer<S = any> = (state: S, action: Action<S>) => S;
export type Store<S = any> = {
  getState(): S;
  dispatch(action: Action): void;
  subscribe(listener: () => void): () => void;
};

function createStore<S = any>(
  preloadedState: S,
  reducer: Reducer<S>
): Store<S> {
  
  let state = preloadedState as S; // 状态树
  const listeners: Array<() => void> = [];  // 订阅者的回调函数

  // 返回状态树
  const getState = () => state;
  // 订阅
  const subscribe = (fn: any) => {
    listeners.push(fn);
    // 取消订阅
    return () => {
      const index = listeners.find((item) => item === fn);
      listeners.splice(index as unknown as number, 1);
    };
  };

  const dispatch = (action) => {
    // 获得新的状态树
    state = reducer(state, action);
    // 通知所有订阅者
    listeners.forEach((fn) => fn());
  };

  
  return { dispatch, subscribe, getState };
}
export default createStore