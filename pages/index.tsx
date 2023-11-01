"use client";

import "../styles/page.css";
import React, { useEffect, useState } from "react";
import Feed from "@components/Feed";
import { useSession } from "next-auth/react";

const Home: React.FC = () => {
  const [componentsData, setComponentsData] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetch("/api/UiComponent/getAllComponents");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }
        setComponentsData(data);
      } catch (error: any) {
        console.error("Error fetching components:", error.message);
      }
    };

    fetchComponents();
  }, []);
  return (
    <section className="section">
      <h1 className="heading">
        Discover & Share
        <br />
        <span className="gradient-text"> Ui - Components</span>
      </h1>
      <p className="description">
        UI-topia is an 2222 open-source UI Components app for the modern world
        to discover, create, and share creative Components using only html and
        css
      </p>
      <Feed components={componentsData} />
    </section>
  );
};

export default Home;
