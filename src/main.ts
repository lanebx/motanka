import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqh2XrVhdzC_KyueWbAMRuAeIbnG2GyWI",
  authDomain: "motanka-store.firebaseapp.com",
  databaseURL: "https://motanka-store-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "motanka-store",
  storageBucket: "motanka-store.appspot.com",
  messagingSenderId: "201562882808",
  appId: "1:201562882808:web:a63de28b2825b82377f10d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
