import { useReducer, useEffect } from "react"
import axios, { AxiosRequestConfig } from "axios"

type Status = "idle" | "pending" | "fulfilled" | "rejected";

interface InitialState {
    status: Extract<Status, "idle">;
    error: null;
    data: null;
}

interface LoadingState {
    status: Extract<Status, "pending">;
    error: null;
    data: null;
}

interface SuccessState<T> {
    status: Extract<Status, "fulfilled">;
    error: null;
    data: T;
}

interface ErrorState {
    status: Extract<Status, "rejected">;
    error: Error;
    data: null;
}

type State<T> = InitialState | LoadingState | SuccessState<T> | ErrorState;

type Action<T> =
    | { type: "pending" }
    | { type: "fulfilled"; payload: T }
    | { type: "rejected"; payload: Error };

export const useFetch = <T = unknown>(
  query: string,
  requestConfig?: Omit<AxiosRequestConfig, "signal">
): State<T> => {
  const initialState: State<T> = {
    status: "idle",
    error: null,
    data: null
  }

  const reducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
    case "pending":
      return { ...state, status: "pending", error: null, data: null }
    case "fulfilled":
      return {
        ...state,
        status: "fulfilled",
        error: null,
        data: action.payload
      }
    case "rejected":
      return {
        ...state,
        status: "rejected",
        error: action.payload,
        data: null
      }
    default:
      return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!query) return

    const controller = new AbortController()
    const signal = controller.signal;

    (async () => {
      dispatch({ type: "pending" })

      try {
        const { data } = await axios.get<T>(query, {
          ...requestConfig,
          signal
        })

        dispatch({ type: "fulfilled", payload: data })
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request was canceled", error)
        }

        dispatch({
          type: "rejected",
          payload: error as Error
        })
      }
    })()

    return () => {
      controller.abort()
    }
  }, [query, requestConfig])

  return state
}
