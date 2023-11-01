"use client";

// components/UIComponent.tsx
import "../styles/components_css/uiComponent.css";
import React, { useState } from "react";

type UIComponentProps = {
  html: string;
  css: string;
};

const UIComponent: React.FC<UIComponentProps> = ({ html, css }) => {
  const [isHtmlDisplayed, setIsHtmlDisplayed] = useState(true);

  return (
    <div className="ui-component">
      <style>{css}</style>
      <div className="component-display">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      {/* Buttons to toggle between HTML and CSS */}
      <div className="toggle-buttons">
        <button onClick={() => setIsHtmlDisplayed(true)}>HTML</button>
        <button onClick={() => setIsHtmlDisplayed(false)}>CSS</button>
      </div>

      {/* Code Display Section */}
      <div className="code-display">
        <h4>{isHtmlDisplayed ? "HTML" : "CSS"}</h4>
        <pre>
          <code>{isHtmlDisplayed ? html : css}</code>
        </pre>
      </div>
    </div>
  );
};

export default UIComponent;
