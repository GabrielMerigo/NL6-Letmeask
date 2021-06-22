import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANaqzeiQ00yzugitmSeyfp3OJGon5LkUY",
  authDomain: "letmeask-84b90.firebaseapp.com" ,
  databaseURL: "https://letmeask-84b90-default-rtdb.firebaseio.com",
  projectId: "letmeask-84b90",
  storageBucket: "letmeask-84b90.appspot.com",
  messagingSenderId: "993379671642",
  appId: "1:993379671642:web:b140568a714a81312d8263"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

export { firebase, auth, database }