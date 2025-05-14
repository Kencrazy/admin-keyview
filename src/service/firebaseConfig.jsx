import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {initializeAppCheck,ReCaptchaEnterpriseProvider} from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyB2U3_V9GvXEMUZr--_1AT6jSM8MtDIDzE",
  authDomain: "mystore2-7237a.firebaseapp.com",
  projectId: "mystore2-7237a",
  storageBucket: "mystore2-7237a.appspot.com",
  messagingSenderId: "419533628656",
  appId: "1:419533628656:web:9b3d5f334cab488f1cce35",
  measurementId: "G-7KWV54ZNYE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);