import { compose, createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
// import { enableBatching } from "redux-batched-actions";
// import thunk from "redux-thunk";
// import { composeWithDevTools } from "remote-redux-devtools";

import mainReducer from "../dux/mainReducer.js";

import sagas from "../dux/sagas/rootSaga.js";

const sagaMiddleware = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */

// if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
//   console.log("Redux devtools available, I think");
// } else {
//   console.log("Redux devtools not available, I think");
// }

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;// For web extension
// const composeEnhancers = composeWithDevTools || compose; // For NPM, best for React Native
// const composeEnhancers = compose; // For NPM, best for React Native

// This module exports a function.  So the returns a function, so the sagaMiddleware.run()
// call has to be inside that function so it runs when the function is run.
const configureStore = initialState => {
  const store = createStore(
    mainReducer,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );
  sagaMiddleware.run(sagas);
  return store;
};
/* eslint-enable */

export default configureStore;
