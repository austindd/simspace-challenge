import React from 'react';
import "./HomePage.css";
import {DogDataContext} from "./DogDataContext";
import {pipe} from "fp-ts/pipeable";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as Record from "fp-ts/Record";
import {SearchBar, DogButton, DogImagesSection} from '.';
import {DogButtonsSection} from './DogButtonsSection';

const dogImageElementCache: Record<string, React.ReactElement> = {};

export const HomePage = () => {
  const {state, dispatch} = React.useContext(DogDataContext);

  return (
    <div>
      <div>
        <SearchBar onChange={(event) => {
          console.log(event.target.value)
          dispatch({tag: "SetSearchTerm", searchTerm: O.some(event.target.value)})
        }} />
      </div>
      <div className="homepage-content-block">
        <DogButtonsSection />
      </div>
      <div className="homepage-content-block">
        <DogImagesSection />
      </div>
    </div>
  );
}

