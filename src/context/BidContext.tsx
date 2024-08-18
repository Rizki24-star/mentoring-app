import { Bids } from "@prisma/client";
import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type MyBid = {
  createdAt: string;
  id: number;
  message: string;
  request: {
    reward: string;
    tags: { id: number; name: string }[];
    title: string;
  };
  requestId: number;
  status: string;
  updatedAt: string;
  userId: string;
};

type State = {
  bids: MyBid[];
  isLoading: boolean;
};

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

type RequestBid = {
  requestId: number;
  message: string;
};

type Action =
  | { type: "SET_BID"; payload: State }
  | { type: "CREATE_BID"; payload: MyBid }
  | { type: "GET_BID_REQUEST"; payload: RequestBids[] }
  | { type: "DELETE_BID"; payload: number }
  | { type: "SET_LOADING"; payload: boolean };

type BidContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
  createBid: (req: RequestBid) => Promise<void>;
  getRequestBids: (requestId: string) => Promise<void>;
};

const initialState: State = { bids: [], isLoading: false };

const BidContext = createContext<BidContextType | undefined>(undefined);

const bidReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_BID":
      return { ...state, bids: action.payload.bids, isLoading: false };
    case "CREATE_BID":
      return {
        ...state,
        bids: [...state.bids, action.payload],
        isLoading: false,
      };
    case "GET_BID_REQUEST":
      return {
        ...state,

        isLoading: false,
      };

    // case "DELETE_BID":
    // return state.filter((item) => item.id !== action.payload);
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const BidsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(bidReducer, initialState);

  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: true });
    fetch("/api/bids")
      .then((response) => response.json())
      .then((data) => {
        console.log({ bids: data.data });

        dispatch({
          type: "SET_BID",
          payload: { bids: data.data, isLoading: true },
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        dispatch({ type: "SET_LOADING", payload: false });
      });
  }, []);

  const createBid = async (req: RequestBid) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch("/api/bids/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });

      const data = await response.json();
      dispatch({ type: "CREATE_BID", payload: data.data });
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const getRequestBids = async (requestId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch(`/api/bids/request/${requestId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      dispatch({ type: "GET_BID_REQUEST", payload: data.data });
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <BidContext.Provider value={{ state, dispatch, createBid, getRequestBids }}>
      {children}
    </BidContext.Provider>
  );
};

export const useBidContext = () => {
  const context = useContext(BidContext);
  if (context === undefined) {
    throw new Error("useBidContext must be used within a BidProvider");
  }

  return context;
};
