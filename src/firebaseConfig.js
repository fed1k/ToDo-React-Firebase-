import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyBrFlVglmkNYupA4AssltG8-h-WmWaCWyU",
  authDomain: "fir-83496.firebaseapp.com",
  projectId: "fir-83496",
  storageBucket: "fir-83496.appspot.com",
  messagingSenderId: "569606616642",
  appId: "1:569606616642:web:ff5f8e26d5730a14271fdb"
};

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

export const storage = getStorage(app)


export default db

