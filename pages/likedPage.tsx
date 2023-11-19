"use client";

import { useSession } from "next-auth/react";
import Feed from "@components/Feed";
import React, { useEffect, useState } from "react";
import { component } from "@utils/component";

const likedPage = () => {
  const [likedComponents, setLikedComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState<component | null>(
    null
  );
  const { data: session, status } = useSession();
  useEffect(() => {
    const fetchLikedComponents = async () => {
      const response = await fetch("/api/UiComponent/getLikedComponents");
      if (response.ok) {
        const data = await response.json();
        setLikedComponents(data);
      } else {
        // Handle errors
        console.error("Failed to fetch liked components");
      }
    };

    fetchLikedComponents();
  }, []);

  const handleComponentSelect = (component: component) => {
    setSelectedComponent(component);
  };

  return (
    <div>
      <Feed
        components={likedComponents}
        likedComponents={likedComponents}
        userid={session && session.user.id}
        onComponentSelect={handleComponentSelect}
      />
    </div>
  );
};

export default likedPage;
