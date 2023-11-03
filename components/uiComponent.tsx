"use client";

import React, { useState } from "react";
import styled, { css } from "styled-components";

type UIComponentProps = {
  html: string;
  css: string;
};

// Define the type for the props you expect to receive
interface StyledComponentProps {
  cssString: string;
}

// Use the interface to type the props in the styled component
const StyledUIComponent = styled.div<StyledComponentProps>`
  ${(props) => css`
    ${props.cssString}
  `}
`;

const UIComponent: React.FC<UIComponentProps> = ({ html, css }) => {
  const [isHtmlDisplayed, setIsHtmlDisplayed] = useState(true);

  return (
    // Pass the CSS as a named prop to avoid conflicts with the styled-components props
    <StyledUIComponent cssString={css} className="ui-component">
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
    </StyledUIComponent>
  );
};

export default UIComponent;
