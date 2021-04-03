import React from 'react';
import "./DogButton.css";

export const DogButton: React.FC<{selected?: boolean ,onClick?: (event: React.MouseEvent) => void}> =
  ({selected, onClick, children}) => {

    console.log(children, selected)

    return (
      <div className={"dog-button-wrapper" + (selected ? " selected" : "")}>
        <button
          className={"dog-button-element" + (selected ? " selected" : "")}
          onClick={onClick}
        >{children}</button>
      </div>
    )
  }

