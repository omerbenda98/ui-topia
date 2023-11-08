import React from "react";
import styles from "../styles/components_css/HtmlCssToggle.module.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const HtmlCssToggle: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default HtmlCssToggle;
