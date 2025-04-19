import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Nunito', sans-serif;
    background-color: #fff8f8;
  }

  .leaflet-popup-content-wrapper {
    border-radius: 15px;
    background-color: #fff8f8;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .leaflet-popup-content {
    font-family: "Nunito", sans-serif;
    font-size: 14px;
    color: #ff9f1c;
  }

  .leaflet-control-zoom {
    border-radius: 15px !important;
    overflow: hidden;
  }

  .leaflet-control-zoom a {
    background-color: #fff8f8 !important;
    color: #ff9f1c !important;
  }
`; 