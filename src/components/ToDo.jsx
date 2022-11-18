import db from "../firebaseConfig"
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from "dayjs"
import deleteIcon from "../assets/deleteIcon.png"
import editIcon from "../assets/edit.png"
import { useEffect } from "react";
dayjs.extend(localizedFormat);
const ToDo = ({ todo, setModal }) => {

  const handleDelete = async () => {
    const taskDocRef = doc(db, 'books', todo.id)
    try{
      await deleteDoc(taskDocRef)
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdate = async () => {
    const taskDocRef = doc(db, 'books', todo.id)
    try{
      await updateDoc(taskDocRef, {
        ...todo.data,
        completed: todo.data.completed ? false : true
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(()=>{
    if(dayjs().isAfter(dayjs(todo.data.dueDate))) {
      const isPresent = async () => {
        const taskDocRef = doc(db, 'books', todo.id)
        try{
          await updateDoc(taskDocRef, {
            ...todo.data,
            completed: true
          })
        } catch (err) {
          console.log(err)
        }
      }
      isPresent()
    }
  }, [todo])

  return (
    <div className="todo" key={todo.id}>
      <div className="checkbox-container">
        <input type="checkbox" id={`completed` + todo.id} checked={todo.data.completed} onChange={handleUpdate} />
        <label className="title-label" htmlFor={`completed` + todo.id}>{todo.data.title}</label>
      </div>
      <p>{todo.data.description}</p>
      <h4>{dayjs(todo.data.dueDate).format('LL')}</h4>
      <div className="edit-delete-cont">
        {todo.data.attachmentLink ? <a rel="noreferrer noopener" target="_blank" href={todo.data.attachmentLink}>See attachment</a> : <span>No attachments</span>}
        <span onClick={ ()=> setModal(todo) } type='button'><img alt="edit icon" className="deleteIcon" src={editIcon} /></span>
        <span onClick={ handleDelete } type='button'><img alt="delete icon" className="deleteIcon" src={deleteIcon} /></span>
      </div>
    </div>
  );
}
 
export default ToDo;