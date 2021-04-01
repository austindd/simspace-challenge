import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as Api from "./data/api-data";
import {pipe} from "fp-ts/pipeable";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";

function App() {

  React.useEffect(() => {
    Api.Get.listOfAllBreeds().then((result) => {
      pipe(
        result,
        E.fold(console.error, console.log)
      )
    })
  })

  React.useEffect(() => {
    Api.Get.imagesOfBreed("hound")().then((result) => {
      pipe(
        result,
        E.fold(console.error, console.log)
      )
    })
  })

  React.useEffect(() => {
    Api.Get.subBreedsOfBreed("hound")().then((result) => {
      pipe(
        result,
        E.fold(console.error, console.log)
      )
    })
  })

  return (
    <div className="App">
    </div>
  );
}

export default App;
