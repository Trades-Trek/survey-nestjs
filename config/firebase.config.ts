import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAa2eOjT-TQ-ZbCOAwkdcJk6kbiwBp1JX0",
    authDomain: "jambapp-3e437.firebaseapp.com",
    projectId: "jambapp-3e437",
    storageBucket: "jambapp-3e437.appspot.com",
    messagingSenderId: "783915475027",
    appId: "1:783915475027:web:a1d374916f1efd21e526a6",
    measurementId: "G-X2B42G8SBJ"
  };

  const app = initializeApp(firebaseConfig);
  export default app;