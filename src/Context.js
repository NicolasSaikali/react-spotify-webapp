import React from "react";

export const defaultGlobalState = {
  user: {
    id: null,
    wishlist: [],
  },
};

export const globalStateContext = React.createContext(defaultGlobalState);
export const dispatchStateContext = React.createContext(undefined);

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (state, newValue) => ({ ...state, newValue }),
    defaultGlobalState
  );
  return (
    <globalStateContext.Provider value={state}>
      <dispatchStateContext.Provider value={dispatch}>
        {children}
      </dispatchStateContext.Provider>
    </globalStateContext.Provider>
  );
};
