"use client";

import React, { useState, useEffect, ChangeEvent, FC } from "react";
import "../styles/pages_css/createUiComp.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const CreateUiComp: FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [cssCode, setCssCode] = useState<string>("");
  const [componentType, setComponentType] = useState<string>("button"); // Set default type to "button"
  const [selectedOption, setSelectedOption] = useState<string>("button");

  const handleShareComponent = async () => {
    if (status === "authenticated" && session?.user?.name) {
      const creatorName = session.user.name;

      const payload = {
        html: htmlCode,
        css: cssCode,
        type: componentType,
        likes: [],
        creatorId: session?.user?.id,
      };

      try {
        const response = await fetch("/api/UiComponent/route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }
        router.push("/");
      } catch (error: any) {
        console.error("Error saving component:", error.message);
      }
    }
  };
  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setComponentType(event.target.value);
    setSelectedOption(event.target.value);
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied / Unauthorized</p>;
  }

  return (
    <div>
      {/* Dropdown for selecting component type */}

      <div className="code-inputs">
        <textarea
          placeholder="Enter HTML code"
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
          className="code-input"
        />
        <textarea
          placeholder="Enter CSS code"
          value={cssCode}
          onChange={(e) => setCssCode(e.target.value)}
          className="code-input"
        />
      </div>

      <div
        className="live-preview"
        dangerouslySetInnerHTML={{ __html: htmlCode }}
      />
      <style>{cssCode}</style>
      {/* <div className="type-selection">
        <label htmlFor="component-type">Type:</label>
        <select
          id="component-type"
          value={componentType}
          onChange={(e) => setComponentType(e.target.value)}
        >
          <option value="button">Button</option>
          <option value="form">Form</option>
          <option value="loader">Loader</option>
          <option value="inputs">Inputs</option>
          <option value="card">Card</option>
        </select>
      </div> */}
      <div className="wrapper">
        <div className="option">
          <input
            checked={selectedOption === "button"}
            onChange={handleOptionChange}
            value="button"
            name="btn"
            type="radio"
            className="input"
          />
          <div className="btn">
            <span className="span">Button</span>
          </div>
        </div>
        <div className="option">
          <input
            checked={selectedOption === "form"}
            onChange={handleOptionChange}
            value="form"
            name="btn"
            type="radio"
            className="input"
          />
          <div className="btn">
            <span className="span">Form</span>
          </div>{" "}
        </div>
        <div className="option">
          <input
            checked={selectedOption === "card"}
            onChange={handleOptionChange}
            value="card"
            name="btn"
            type="radio"
            className="input"
          />
          <div className="btn">
            <span className="span">Card</span>
          </div>
        </div>
      </div>

      <button onClick={handleShareComponent} className="outline_btn">
        Share Component
      </button>
    </div>
  );
};
export default CreateUiComp;
