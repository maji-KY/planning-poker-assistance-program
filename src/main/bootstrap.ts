import axios from "axios";
import * as firebase from "firebase";

axios.get("/__/firebase/init.json")
  .then(function (response) {
    firebase.initializeApp(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

const containerElement = document.getElementById("main");

if (containerElement) containerElement.innerHTML = "abc";
