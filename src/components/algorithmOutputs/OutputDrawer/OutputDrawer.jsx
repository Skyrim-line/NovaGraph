import React, { useState, useContext } from "react";
import "./OutputDrawer.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "antd";

export default function OutputDrawer({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return collapsed ? (
    <Button
      className="output-drawer-closed"
      onClick={() => setCollapsed(false)}
    >
      <p>Show Code/Output</p>
      <ChevronUp />
    </Button>
  ) : (
    <>
      <Button
        className="output-drawer-open-button"
        onClick={() => setCollapsed(true)}
      >
        <p>Collapse Code/Output</p>
        <ChevronDown />
      </Button>
      {children}
    </>
  );
}
