import React from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import "./LoadingIndicator.css";

export const LoadingIndicator: React.FC<{height: string, width: string}> = () => {
  return (
    <div className="loading-indicator-component">
      <Loader
        type="ThreeDots"
        color="#8c1aff"
        height="80"
        width="80"
      />
    </div>
  );
}
