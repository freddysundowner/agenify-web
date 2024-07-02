import { useEffect, useState } from "react";

const useDataLoader = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListings(); // Fetch the JSON file
        const jsonData = await response.json(); // Parse the JSON data
        console.log(jsonData);
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();

    return () => {}; // Cleanup function
  }, [url]);

  return { data, loading, error };
};

export default useDataLoader;
