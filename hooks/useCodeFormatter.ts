import { useState, useEffect } from "react";
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";
import parserCss from "prettier/parser-postcss";

type FormattedCode = {
  html: string;
  css: string;
};

export const useCodeFormatter = (html: string, css: string) => {
  const [formattedCode, setFormattedCode] = useState<FormattedCode>({
    html: "",
    css: "",
  });

  useEffect(() => {
    const formatCode = async () => {
      try {
        // Asynchronous formatting if prettier.format returns a promise
        const formattedHtml = await prettier.format(html, {
          parser: "html",
          plugins: [parserHtml],
        });

        const formattedCss = await prettier.format(css, {
          parser: "css",
          plugins: [parserCss],
        });
        console.log(formattedHtml);

        setFormattedCode({ html: formattedHtml, css: formattedCss });
      } catch (error) {
        console.error("Error formatting code:", error);
      }
    };

    formatCode();
  }, [html, css]);

  return formattedCode;
};
