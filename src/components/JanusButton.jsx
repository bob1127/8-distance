// JanusButton.jsx
import React from "react";

const JanusButton = ({ label = "Reshape" }) => {
  return (
    <li class="content__item">
      <button className="button  button--janus">
        <span>{label}</span>
      </button>
    </li>
  );
};

export default JanusButton;
