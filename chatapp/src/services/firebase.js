import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import config from "../firebase_config";

firebase.initializeApp(config);

// Auth
export const auth = firebase.auth();

// Firestore
export const firestore = firebase.firestore();