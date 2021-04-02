import React from "react";
import "./DogImage.css";

export const DogImage: React.FC<{url: string}> = ({url}) => {
  return (
    <div className="dog-image-wrapper">
      <img key={url} className="dog-image-img-element" src={url}></img>
    </div>
  );
};
