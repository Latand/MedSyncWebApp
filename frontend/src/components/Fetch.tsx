import { useFetch } from "../hooks";

interface FetchProps<T = unknown> {
    uri: string;
    renderSuccess: (data: T) => React.ReactElement;
    loadingFallback?: React.ReactElement;
    renderError?: (error: string) => React.ReactElement;
}

export const Fetch = <T = unknown,>({
    uri,
    renderSuccess,
    loadingFallback = <p>Loading...</p>,
    renderError = error => <pre>{error}</pre>
}: FetchProps<T>) => {
    const { status, data, error } = useFetch<T>(uri);

    if (status === "idle") return;
    if (status === "pending") return loadingFallback;
    if (status === "rejected") return renderError(error.message);

    return renderSuccess(data);
};
