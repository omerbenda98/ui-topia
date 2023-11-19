"use client";

import { useSession } from "next-auth/react";

import Feed from "@components/Feed";
import React, { useEffect, useState } from "react";
import { component } from "@utils/component";

const MyComps = () => {
  const [myComponentsData, setMyComponentsData] = useState([]);
  const [likedComponents, setLikedComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState<component | null>(
    null
  );
  const { data: session, status } = useSession();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/UiComponent/getMyComponents");
        const data = await response.json();
        setMyComponentsData(data);
      } catch (error: any) {
        console.error("An error occurred:", error.message);
      }
    };

    fetchData();
  }, []);
  const handleComponentSelect = (component: component) => {
    setSelectedComponent(component);
  };

  return (
    <div>
      <Feed
        components={myComponentsData}
        likedComponents={likedComponents}
        userid={session && session.user.id}
        onComponentSelect={handleComponentSelect}
      />
    </div>
  );
};

export default MyComps;
