import { createContext, Dispatch, useReducer } from "react";
type StoreState = { latLong: string; coffeeStores: any[] };
export const StoreContext = createContext<{
  state: StoreState;
  dispatch:Dispatch<ActionType>
}>({
  state: {
    latLong: "",
    coffeeStores: [],
  },
  dispatch:()=>{}
});
export const ACTION_TYPES = {
  SET_LAT_LONG:"SET_LAT_LONG",
  SET_COFFEE_STORES:"SET_COFFEE_STORES"
} as const;
type ActionType = {
  type: keyof typeof ACTION_TYPES,
  payload:Partial<StoreState>
};
const storeReducer = (state:StoreState, action:ActionType):StoreState => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return { ...state, latLong: action.payload.latLong||'' };
    }
    case ACTION_TYPES.SET_COFFEE_STORES: {
      return { ...state, coffeeStores: action.payload.coffeeStores||[] };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const StoreProvider = ({ children }: { children?: React.ReactNode }) => {
  const initialState:StoreState = {
    latLong: "",
    coffeeStores: [],
  };
  const [state, dispatch] = useReducer(storeReducer, initialState);
  return (
    <StoreContext.Provider value={{ state ,dispatch}}>
      {children}
    </StoreContext.Provider>
  );
};
export default StoreProvider;