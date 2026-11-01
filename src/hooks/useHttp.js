import { useState, useCallback } from "react";

//Things to supply: URL, Method, Header, Data: last three as options{}, applyData
const useHttp =  () => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (url, options = {}, applyData) => {

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: options.method || "GET",
        headers: options.headers || {},
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error("Request Failed!");
      }

      const data = await response.json();

      if (applyData)
        applyData(data);

    } catch (err) {
      setError(err.message || "Something went wrong!");
    }

    setIsLoading(false);
  }, []);

  return {isLoading, error, sendRequest};

}

export default useHttp;
