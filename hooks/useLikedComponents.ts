// hooks/useLikedComponents.ts
import { useState, useEffect } from "react";
import { component } from "@utils/component";

const useLikedComponents = () => {
  const [likedComponentsArr, setLikedComponentsArr] = useState<component[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLikedComponents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/likedComponents/getLikedComponents`);
        if (!response.ok) {
          throw new Error("Failed to fetch liked components");
        }
        const data = await response.json();
        setLikedComponentsArr(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedComponents();
  }, []);

  return { likedComponentsArr, isLoading, error };
};

export default useLikedComponents;
