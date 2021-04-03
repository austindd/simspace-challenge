import React from 'react';
import "./AppHeaderSection.css";
import {SearchBar} from '.';

export const AppHeaderSection: React.FC = () => {
  return (
    <div className="app-header-section">
      <div className="app-header-section-title-wrapper">
        <h1 className="app-header-section-title">{"Dogs!"}</h1>
      </div>
      <div className="app-header-section-search-bar-wrapper">
        <SearchBar placeholder="Search" />
      </div>
    </div>
  );
}
