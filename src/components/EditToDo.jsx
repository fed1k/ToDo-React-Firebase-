import { useRef } from "react";
import db from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import attach from "../assets/attach.ico"
const Modal = ({ modal, setModal, file, setFile }) => {

  const titleRef = useRef()
  const descriptionRef = useRef()
  const dueDateRef = useRef()

  const handleUpdate = async (e) => {
    e.preventDefault()
    setModal({})
    const taskDocRef = doc(db, 'books', modal.id)
    try{
      await updateDoc(taskDocRef, {
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        dueDate: dueDateRef.current.value
      })
    } catch (err) {
      console.log(err)
    }
  }

  let today = new Date().toISOString().slice(0, 10)

  return (
    <div className='modal-container'>
      <form onSubmit={handleUpdate}>
        <button type='button' onClick={ ()=> setModal({}) }>X</button>
        <input ref={titleRef} type="text" placeholder='Title' defaultValue={modal.data.title} required />
        <input ref={descriptionRef} type="text" placeholder='Description' defaultValue={modal.data.description} required/>
        <input type="date" ref={dueDateRef} defaultValue={modal.data.dueDate} min={today} required />
        <input type="file" accept='image/*' id='file' onChange={(e) => setFile(e.target.files[0]) } />
        <label htmlFor="file"><img alt="attach icon" className='attachIcon' src={attach} /></label>
        {modal.data.attachmentLink ? <span>attached...</span> : <span>No attachments</span>}
        <button type='submit'>Update</button>
      </form>
    </div>
  );
}
 
export default Modal;