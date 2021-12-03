import React from "react";

export function createContainer<Value, State = void>(
  useHook: (initialState?: State) => Value
) {
  const Context = React.createContext<Value>(undefined as unknown as Value);

  const Provider: React.FC<{ initialState?: State }> = ({ initialState, children }) => {
    // 使用外部传入的 hook
    const value = useHook(initialState);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };
  const useContainer: () => Value = () => {
    const value = React.useContext(Context)
    return value
  }


  return { Provider, useContainer };
}