import React from 'react';
import "./HomePage.css";
import {DogDataContext} from "./DogDataContext";
import {pipe} from "fp-ts/pipeable";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as Record from "fp-ts/Record";
import {SearchBar, DogButton, DogImagesSection, AppHeaderSection} from '.';
import {DogButtonsSection} from './DogButtonsSection';

const dogImageElementCache: Record<string, React.ReactElement> = {};

export const HomePage = () => {
  const {state, dispatch} = React.useContext(DogDataContext);

  return (
    <div>
      <div className="homepage-content-block homepage-app-header-section">
        <AppHeaderSection />
      </div>
      <div className="homepage-content-block homepage-dog-buttons-section">
        <DogButtonsSection />
      </div>
      <div className="homepage-content-block homepage-dog-images-section">
        <DogImagesSection />
      </div>
    </div>
  );
}

