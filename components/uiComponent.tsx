"use client";

import React, { useState } from "react";
import "../styles/components_css/uiComponent.css";
import styled, { css } from "styled-components";
import LikeBtn from "./LikeBtn";
import { component } from "@utils/component";
import HtmlCssToggle from "./HtmlCssToggle";

// Use the interface to type the props in the styled component
const StyledUIComponent = styled.div<{ $cssstring: string }>`
  ${({ $cssstring }) => css`
    ${$cssstring}
  `}
`;
const UIComponent: React.FC<component> = ({
  _id,
  html,
  css,
  userid,
  type,
  likedComponents,
  likes,
}) => {
  const [isHtmlDisplayed, setIsHtmlDisplayed] = useState(true);
  const [likesAmount, setLikesAmount] = useState(likes.length);

  const handleLike = async () => {
    try {
      // Call the API endpoint with a PUT request
      // const likes = likedComponents.find((comp) => comp.compId === compId);

      const response = await fetch("/api/UiComponent/likeClick", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          _id, // the ID of the component to like
          userid,
          type,
          html,
          css,
          likedComponents,
          likes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to like the component");
      }

      // Here you can handle the response and update UI accordingly
      const updatedLikes = await response.json();
      setLikesAmount(updatedLikes.length);
      // ... update state to reflect the new like status if needed ...
    } catch (error) {
      console.error("Error liking the component:", error);
      // If the error is an instance of the Error class, log its message
      if (error instanceof Error) {
        console.error(error.message);
      }
      // ... handle the error in UI if needed ...
    }
  };

  return (
    // Pass the CSS as a named prop to avoid conflicts with the styled-components props
    <StyledUIComponent $cssstring={css} className="ui-component">
      <div className="component-display">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      {/* Buttons to toggle between HTML and CSS */}
      <div className="toggle-buttons">
        <button
          onClick={() => setIsHtmlDisplayed(true)}
          className="htmlCssToggle"
        >
          HTML
        </button>
        <button
          onClick={() => setIsHtmlDisplayed(false)}
          className="htmlCssToggle"
        >
          CSS
        </button>
      </div>
      <LikeBtn
        userid={userid}
        compID={_id}
        onLike={handleLike}
        likedComponents={likedComponents}
      />
      <div>{likesAmount}</div>
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
