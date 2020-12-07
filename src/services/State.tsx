import React, { createContext, ProviderProps, useReducer } from "react";

export enum ActionType {
  SET_COUNT = "SET_COUNT",
  SET_USERS = "SET_USERS"
}

interface IAppContext {
  count: number
  users: string[]
}

interface IReducer extends IAppContext {
  type: ActionType
}

const initialState: any = {
  count: 0,
  users: []
}

const AppContext = createContext(initialState);

const reducer: React.Reducer<IAppContext, IReducer> = (state: IAppContext, action: IReducer) => {
  switch(action.type) {
    case ActionType.SET_COUNT: {
      return { ...state, count: action.count }
    }
    case ActionType.SET_USERS: {
      return { ...state, users: action.users }
    }
  }
  return state;
};

function AppContextProvider(props: any) {
  const fullInitialState = {
    ...initialState,
  }

  let [state, dispatch] = useReducer(reducer, fullInitialState);
  let value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };