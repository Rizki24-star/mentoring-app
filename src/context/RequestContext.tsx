import { RequestDetail } from "@/types/request";
import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type State = {
  request: RequestDetail[];
  isLoading: boolean;
};

type RequestContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

type Action =
  | { type: "GET_REQUESTS"; payload: RequestDetail[] }
  | { type: "SET_LOADING"; payload: boolean };

const initialState = {
  request: [],
  isLoading: false,
};

const RequestContext = createContext<RequestContextType | undefined>(undefined);

const requestReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "GET_REQUESTS":
      return { ...state, request: action.payload, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(requestReducer, initialState);

  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: true });
    fetch("/api/request")
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "GET_REQUESTS", payload: data.data });
      })
      .catch((error) => console.log(error))
      .finally(() => {
        dispatch({ type: "SET_LOADING", payload: false });
      });
  }, []);

  return (
    <RequestContext.Provider value={{ state, dispatch }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequestContext = () => {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error("useRequestContext must be userd within a RequestProvider");
  }

  return context;
};
