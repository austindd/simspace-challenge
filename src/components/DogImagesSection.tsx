import React from "react";
import "./DogImagesSection.css";
import {DogDataContext} from ".";
import {pipe} from "fp-ts/pipeable";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as Record from "fp-ts/Record";
import {DogImage} from '.';

export const DogImagesSection: React.FC = () => {

  const {state, dispatch} = React.useContext(DogDataContext);

  const dogImages = React.useMemo(() => pipe(
    state.selectedBreedImages,
    O.fold(
      () => null,
      (urlList) => urlList.map((url) => {
        return <DogImage url={url} />;
      })
    )
  ), [state.selectedBreed, state.selectedBreedImages]);

  return (
    <div className="dog-images-section">
      {dogImages}
    </div>
  );
};
