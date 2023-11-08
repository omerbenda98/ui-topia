"use client";

import "../styles/page.css";
import React, { useEffect, useState } from "react";
import Feed from "@components/Feed";
import { useSession } from "next-auth/react";
import TypeSelect from "@components/TypeSelect";
import { ComponentType } from "@utils/componentType";
import { component } from "@utils/component";

const Home: React.FC = () => {
  const [componentsData, setComponentsData] = useState<component[]>([]);
  const [likedComponents, setLikedComponents] = useState([]);
  const [selectedType, setSelectedType] = useState(ComponentType.All);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetch("/api/UiComponent/getAllComponents");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }
        if (data.length === 0) {
          // No components in database, fetch initial data from JSON
          const initialDataResponse = await fetch("/initialData.json");
          const initialData = await initialDataResponse.json();

          for (const component of initialData) {
            await fetch("/api/UiComponent/route", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(component),
            });
          }

          setComponentsData(initialData);
        } else {
          setComponentsData(data);
        }
      } catch (error: any) {
        console.error("Error fetching components:", error.message);
      }
    };

    fetchComponents();
  }, []);

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
  const handleTypeSelect = (type: ComponentType) => {
    setSelectedType(type);
  };

  useEffect(() => {
    console.log("Selected Type has changed to:", selectedType);
  }, [selectedType]);
  const filteredComponents = componentsData.filter((component) => {
    return (
      selectedType === ComponentType.All || component.type === selectedType
    );
  });

  return (
    <section className="section">
      <h1 className="heading">
        Discover & Share
        <br />
        <span className="gradient-text"> Ui - Components</span>
      </h1>
      <p className="description">
        UI-topia is an open-source UI Components app for the modern world to
        discover, create, and share creative Components using only html and css
      </p>
      <TypeSelect onTypeSelect={handleTypeSelect} />
      <Feed
        components={filteredComponents}
        likedComponents={likedComponents}
        userid={session && session.user.id}
      />
    </section>
  );
};

export default Home;
