// import firebase from "react-native-firebase";
import * as firebase from "firebase";
import ReduxSagaFirebase from "redux-saga-firebase";

console.log("firebase config prod");

const config = {
  apiKey: "AIzaSyDWMrob4ieV9UVEOCXUlDt19O9YAWAZveA",
  authDomain: "helstonbury-cadbf.firebaseapp.com",
  databaseURL: "https://helstonbury-cadbf.firebaseio.com",
  projectId: "helstonbury-cadbf",
  storageBucket: "helstonbury-cadbf.appspot.com",
  messagingSenderId: "597390507245"
};

// The firebase config with some extra app level stuff added.
export const extendedConfig = {
  ...config,
  thumbsPath: "img/bands/thumbs",
  cardsPhotoPath: "img/bands/cards"
};

const firebaseApp = firebase.initializeApp(config);

export const authProvider = new firebase.auth.GoogleAuthProvider();
// export const auth = firebase.auth();

export const reduxSagaFirebase = new ReduxSagaFirebase(firebaseApp);

export default firebaseApp;
