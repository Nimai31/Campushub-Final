import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAMqXxbDkhHFhbZ_XFa3Z0XJz_x_hEg27M",
    authDomain: "campushub-9f877.firebaseapp.com",
    projectId: "campushub-9f877",
    storageBucket: "campushub-9f877.appspot.com",
    messagingSenderId: "26619626465",
    appId: "1:26619626465:web:90060dd89f61c31ceb48a0"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db=firebaseApp.firestore();
  const auth= firebase.auth();
  const provider=new firebase.auth.GoogleAuthProvider();
  const storage=firebase.storage();

  export {auth,provider,storage};
  export default db;
