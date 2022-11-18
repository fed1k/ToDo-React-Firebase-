import { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore"
import db from "./firebaseConfig";

const useData = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'books'), orderBy('dueDate', 'asc'))
    onSnapshot(q, (querySnapshot) => {
      setData(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])

  return data;
}
 
export default useData;