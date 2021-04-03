import React from 'react';
import "./SearchModeSelector.css";
import {DogDataContext} from ".";

export const SearchModeSelector: React.FC = () => {
  const {state, dispatch} = React.useContext(DogDataContext);
  const {searchMode} = state;
  return (
    <div>
      <button
        className={"search-mode-selector-button left" + (searchMode === "alphabetical" ? " selected" : "")}
        onClick={(_event) => {
          if (searchMode !== "alphabetical") {
            dispatch({tag: "SetSearchMode", searchMode: "alphabetical"});
          }
        }}
      >{"Exact Match"}</button>
      <button
        className={"search-mode-selector-button right" + (searchMode === "fuzzyMatch" ? " selected" : "")}
        onClick={(_event) => {
          if (searchMode !== "fuzzyMatch") {
            dispatch({tag: "SetSearchMode", searchMode: "fuzzyMatch"});
          }
        }}
      >{"Fuzzy Match"}</button>
    </div>
  );
};

