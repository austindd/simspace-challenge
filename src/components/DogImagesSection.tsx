import React from "react";
import "./DogImagesSection.css";
import {DogDataContext} from ".";
import {pipe} from "fp-ts/pipeable";
import * as O from "fp-ts/Option";
import {DogImage, LoadingIndicator} from '.';


export const DogImagesSection: React.FC = () => {

  const {state} = React.useContext(DogDataContext);

  const dogImages = React.useMemo(() => pipe(
    state.selectedBreedImages,
    O.fold(
      () => pipe(
        state.selectedBreed,
        O.fold(
          () => null,
          (_selectedBreed) => <LoadingIndicator height="100" width="100" />
        )
      ),
      (urlList) => <>{
        urlList.map((url) => {
          return <DogImage url={url} />;
        })
      }</>
    )
  ), [state.selectedBreed, state.selectedBreedImages]);

  return (
    <div className="dog-images-section">
      <div className="dog-images-section-inner-spacer">
        {dogImages}
      </div>
    </div>
  );
};
