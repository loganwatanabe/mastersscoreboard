import firebase from 'firebase/app';
import 'firebase/analytics'


const firebaseConfig = {
  apiKey: "AIzaSyB2x7yCXi-oc-uiUB_volCrAqyL0rCS2s4",
  authDomain: "mastersscoreboard.firebaseapp.com",
  databaseURL: "https://mastersscoreboard.firebaseio.com",
  projectId: "mastersscoreboard",
  storageBucket: "mastersscoreboard.appspot.com",
  messagingSenderId: "453444159580",
  appId: "1:453444159580:web:73ec567747f829f79c7e99",
  measurementId: "G-GS2NTV88YZ"
};



// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var analytics = firebase.analytics()



export default {
  firebase, analytics
}