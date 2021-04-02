import React from 'react';
import "./DogButton.css";

export const DogButton: React.FC<{onClick?: (event: React.MouseEvent) => void}> =
  ({onClick, children}) => {
    return (
      <div className="dog-button-wrapper">
        <button className="dog-button-button-element" onClick={onClick}>{children}</button>
      </div>
    )
  }

