import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as Api from "./data/api-data";
import {pipe} from "fp-ts/pipeable";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import {DogDataProvider, HomePage} from './components';


function App() {

  return (
    <div className="App">
      <DogDataProvider>
        <HomePage />
      </DogDataProvider>
    </div>
  );
}

export default App;
