// pages/api/format-code.ts

import type { NextApiRequest, NextApiResponse } from "next";
const prettier = require("prettier");
const parserHtml = require("prettier/parser-html");
const parserCss = require("prettier/parser-postcss");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { html, css } = req.body;

    // Format HTML

    const formattedHtml = prettier.format(html, {
      parser: "html",
      plugins: [parserHtml],
    });
    const formattedCss = prettier.format(css, {
      parser: "css",
      plugins: [parserCss],
    });
    console.log("formattedHtml HTML:", formattedHtml);
    console.log("formattedCss CSS:", formattedCss);
    // Send back the formatted code
    res.status(200).json({ html: formattedHtml, css: formattedCss });
  } catch (error) {
    console.error("Error formatting code:", error);
    res.status(500).json({ error: "Error formatting code" });
  }
}
