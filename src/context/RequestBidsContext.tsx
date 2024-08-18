import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";

type RequestBids = {
  createdAt: string;
  id: number;
  message: string;
  requestId: number;
  status: string;
  updatedAt: string;
  user: {
    id: string;
    image: string;
    name: string;
    user_review: number;
  };
};

type State = {
  data: RequestBids[];
  isLoading: boolean;
};

type Action =
  | { type: "SET_REQUEST_BIDS"; payload: State }
  | { type: "SET_LOADING"; payload: boolean };

type RequestBidsContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
  // getRequestBids: (requestId: number) => Promise<void>;
};

const initialState: State = {
  data: [],
  isLoading: false,
};

const RequestBidsContext = createContext<RequestBidsContextType | undefined>(
  undefined
);

const requestBidsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_REQUEST_BIDS":
      return { ...state, data: action.payload.data, isLoading: false };
    default:
      return state;
  }
};

export const RequestBidsProvider = ({
  children,
  requestId,
}: {
  children: ReactNode;
  requestId: number;
}) => {
  const [state, dispatch] = useReducer(requestBidsReducer, initialState);

  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: true });
    fetch(`/api/bids/request/${requestId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log({ request_bids_context: data.data });
        dispatch({
          type: "SET_REQUEST_BIDS",
          payload: { data: data.data, isLoading: true },
        });
      })
      .then((error) => {
        console.log(error);
      })
      .finally(() => {
        dispatch({ type: "SET_LOADING", payload: false });
      });
  }, []);

  // const getRequestBids = async (requestId: number) => {
  //   try {
  //     dispatch({ type: "SET_LOADING", payload: true });
  //     const response = await fetch(`/api/bids/request/${requestId}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     dispatch({ type: "SET_REQUEST_BIDS", payload: data.data });
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     dispatch({ type: "SET_LOADING", payload: false });
  //   }
  // };

  return (
    <RequestBidsContext.Provider value={{ state, dispatch }}>
      {children}
    </RequestBidsContext.Provider>
  );
};

export const useRequestBidsContext = () => {
  const context = useContext(RequestBidsContext);
  if (context === undefined) {
    throw new Error(
      "useRequestBidsContext must be used within a RequestBidsProvider"
    );
  }

  return context;
};
