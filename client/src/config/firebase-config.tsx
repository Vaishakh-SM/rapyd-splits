import firebase from "firebase/compat/app";
import "firebase/compat/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmaTQlhgmXgoGoLNd95x2J3fJHI9y0s2k",
  authDomain: "rapyd-splits.firebaseapp.com",
  projectId: "rapyd-splits",
  storageBucket: "rapyd-splits.appspot.com",
  messagingSenderId: "584389468588",
  appId: "1:584389468588:web:556dbfb2c1230c12bc9a09",
  measurementId: "G-R1BW95JWBJ",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
