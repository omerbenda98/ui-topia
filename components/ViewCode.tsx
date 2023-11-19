import React, { useEffect, useState } from "react";
import "../styles/components_css/ViewCode.css";
import { component } from "@utils/component";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCodeFormatter } from "@hooks/useCodeFormatter";

interface ViewCodeProps {
  component: component; // Assuming 'component' is the type of your component data
  cancelComponentSelect: () => void;
}

const viewCode: React.FC<ViewCodeProps> = ({
  component,
  cancelComponentSelect,
}) => {
  const [isHtmlDisplayed, setIsHtmlDisplayed] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.dark("Copied to clipboard!");
        setTimeout(() => setCopySuccess(""), 2000); // Message disappears after 2 seconds
      })
      .catch((err) => {
        toast.error("Failed to copy!");
        console.error("Error copying text: ", err);
      });
  };

  // Use your custom hook here
  // const formattedCode = useCodeFormatter(component.html, component.css);

  return (
    <div className="code-display-container">
      <div
        className="live-preview"
        dangerouslySetInnerHTML={{ __html: component.html }}
      />
      <div className="code-toggle-container">
        <button onClick={() => setIsHtmlDisplayed(true)}>Show HTML</button>
        <button onClick={() => setIsHtmlDisplayed(false)}>Show CSS</button>
        {isHtmlDisplayed ? (
          <>
            <h2>HTML Code</h2>
            <IconButton
              aria-label="copy"
              sx={{
                color: "white",
                ":hover": {
                  color: "primary.main",
                  backgroundColor: "primary.light",
                },
              }}
              onClick={() => copyToClipboard(component.html)}
            >
              <ContentCopyIcon></ContentCopyIcon>
            </IconButton>
            <pre className="code-block">{component.html}</pre>
          </>
        ) : (
          <>
            <h2>CSS Code</h2>{" "}
            <IconButton
              aria-label="copy"
              sx={{
                color: "white",
                ":hover": {
                  color: "primary.main",
                  backgroundColor: "primary.light",
                },
              }}
              onClick={() => copyToClipboard(component.css)}
            >
              <ContentCopyIcon></ContentCopyIcon>
            </IconButton>
            <pre className="code-block">
              {" "}
              {copySuccess}
              <div> {component.css}</div>
            </pre>
          </>
        )}
      </div>
      <button onClick={cancelComponentSelect}>CANCEL</button>
      <style dangerouslySetInnerHTML={{ __html: component.css }} />
    </div>
  );
};

export default viewCode;
