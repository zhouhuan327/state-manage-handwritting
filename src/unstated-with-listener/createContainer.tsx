import React,{ useLayoutEffect } from "react";

export function createContainer<Value, State = void>(
  useHook: (initialState?: State) => Value
) {
  // 存放状态
  const Context = React.createContext<Value>(undefined as unknown as Value)
  // 存放子组件的listener
  const ListenerContext = React.createContext<Set<(value:Value) => void>>(new Set())
 

  function useSelector<Selected>(selector: (value: Value) => Selected): Selected {
    const [, forceUpdate] = React.useReducer((c) => c + 1, 0);
     // 这里的 Context 已经不具备触发更新的特性
    const value = React.useContext(Context);
    const listeners = React.useContext(ListenerContext);
    const selected = selector(value)
    const StoreValue = {
      selector,
      value,
      selected,
    };
    const ref = React.useRef(StoreValue);
    ref.current = StoreValue;
    
    useLayoutEffect(() => {
      function listener(nextValue: Value){
        try {
          const refValue = ref.current
          // 如果前后对比的值一样，则不触发 render
          if(refValue.value === nextValue) {
            return
          }
          const nextSelected = refValue.selector(nextValue)
          // 将选择后的值进行浅对比，一样则不触发 render
          if(isShadowEqual(nextSelected,refValue.selected)) {
            return
          }
        } catch {

        }
        forceUpdate()
      }
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }, [])
    return selected
  }
  const Provider: React.FC<{ initialState?: State }> = ({ initialState, children }) => {
    // 使用外部传入的 hook
    const value = useHook(initialState)
    // 使用 Ref，让 listener Context 不具备触发更新
    const listeners = React.useRef<Set<(listener: Value) =>void>>(new Set()).current;
    // 每次 useHook 里面 setState 就会让本组件更新，使 listeners 触发调用，从而使改变状态的子组件 render
    listeners.forEach((listener) => {
      listener(value);
    });
    return (
    <Context.Provider value={value}>
      <ListenerContext.Provider value={listeners}>
        {children}
      </ListenerContext.Provider>
    </Context.Provider>
    );
  };
  return { Context,Provider, useSelector };
 
}

function isShadowEqual(origin: any, next: any) {
  if (Object.is(origin, next)) {
    return true;
  }
  if (origin && typeof origin === 'object' && next && typeof next === 'object') {
    if (
      [...Object.keys(origin), ...Object.keys(next)].every(
        (k) => origin[k] === next[k] && origin.hasOwnProperty(k) && next.hasOwnProperty(k),
      )
    ) {
      return true;
    }
  }
  return false;
}