import React from "react";
import { ComponentType } from "@utils/componentType";
import "../styles/components_css/TypeSelect.css";

const TypeSelect = ({
  onTypeSelect,
}: {
  onTypeSelect: (type: ComponentType) => void;
}) => {
  return (
    <div className="cards">
      <div className="card red" onClick={() => onTypeSelect(ComponentType.All)}>
        <p className="tip">All</p>
      </div>
      <div
        className="card blue"
        onClick={() => onTypeSelect(ComponentType.Buttons)}
      >
        <p className="tip">Buttons</p>
      </div>
      <div
        className="card green"
        onClick={() => onTypeSelect(ComponentType.Forms)}
      >
        <p className="tip">Forms</p>
      </div>
      <div
        className="card orange"
        onClick={() => onTypeSelect(ComponentType.Cards)}
      >
        <p className="tip">Cards</p>
      </div>
    </div>
  );
};

export default TypeSelect;
