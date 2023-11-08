"use client";

import { useSession } from "next-auth/react";

import Feed from "@components/Feed";
import React, { useEffect, useState } from "react";

const likedPage = () => {
  const [likedComponents, setLikedComponents] = useState([]);
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

  return (
    <div>
      <Feed
        components={likedComponents}
        likedComponents={likedComponents}
        userid={session && session.user.id}
      />
    </div>
  );
};

export default likedPage;
