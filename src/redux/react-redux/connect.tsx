import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Store } from "../redux/createStore";
const AppContext = createContext(undefined as unknown as Store);
const Provider = (props: any) => {
  const { value, children, ...rest } = props;
  // 把store透传给所有子组件
  return (
    <AppContext.Provider value={value} {...rest}>
      {children}
    </AppContext.Provider>
  );
};

function connect(mapStateToProps?: any, mapDispatchToProps?: any) {
  return function HOC(component) {
    // 包裹组件，主要为了获取组件上下文
    const WrapperComponent = (props: any) => {
      const { dispatch, getState, subscribe } = useContext(AppContext);
      const state = getState();
      // 强制更新组件
      const [, forceUpdate] = useState({});
      // 获得最终子组件的的props
      function childPropsSelector(state) {
        // 注入到props中的状态
        // 可能是整个store, 也可能是被mapState 返回的几个特定状态
        const stateProps = mapStateToProps ? mapStateToProps(state) : state;
        // 注入到props中改变状态的函数
        // 可以是原本的dispatch,也可以是mapDispatch 返回的特定更新状态的函数
        const dispatchProps = mapDispatchToProps
          ? mapDispatchToProps(dispatch)
          : dispatch;
        return { ...stateProps, ...dispatchProps, ...props };
      }
      const actualChildProps = childPropsSelector(state);
      const prePropsRef = useRef({})
      useEffect(() => {
        prePropsRef.current = prePropsRef
      } , [actualChildProps])
      // 订阅store
      useEffect(() => {
        const unsubscribe = subscribe(() => {
          const state = getState();
          const actualChildProps = childPropsSelector(state);
          if (!isShadowEqual(prePropsRef.current, actualChildProps)) {
            forceUpdate({});
          }
        });
        return unsubscribe;
      }, []);

      return React.createElement(component, actualChildProps, props.children);
    };
    return WrapperComponent;
  };
}

function isShadowEqual(origin: any, next: any) {
  if (Object.is(origin, next)) {
    return true;
  }
  if (
    origin &&
    typeof origin === "object" &&
    next &&
    typeof next === "object"
  ) {
    if (
      [...Object.keys(origin), ...Object.keys(next)].every(
        (k) =>
          origin[k] === next[k] &&
          origin.hasOwnProperty(k) &&
          next.hasOwnProperty(k)
      )
    ) {
      return true;
    }
  }
  return false;
}
export { connect, Provider };
