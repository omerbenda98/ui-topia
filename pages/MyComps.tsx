"use client";

import Feed from "@components/Feed";
import React, { useEffect, useState } from "react";

const MyComps = () => {
  const [myComponentsData, setMyComponentsData] = useState([]);
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

  return (
    <div>
      <Feed components={myComponentsData} />
    </div>
  );
};

export default MyComps;
