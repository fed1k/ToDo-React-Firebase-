import { useState, useRef, useEffect } from 'react'
import db, { storage } from './firebaseConfig'
import {collection, addDoc} from "firebase/firestore"
import ToDo from './components/ToDo'
import Modal from './components/EditToDo'
import useData from './useData'
import attach from "./assets/attach.ico"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

function App() {
  const todos = useData()
  const [modal, setModal] = useState({})
  const [file, setFile] = useState('')
  const [attachmentLink, setAttachmentLink] = useState()
  const [btn, setBtn] = useState("ADD")

  useEffect(()=>{
    const uploadFile = () => {
      setBtn("UPLOADING...")
      const storageRef = ref(storage, file.name)
  
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
          console.log(error);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setAttachmentLink(downloadURL);
            setBtn("ADD")
          });
        }
      );
    }

    file && uploadFile()
  }, [file])


  let titleRef = useRef();
  let descriptionRef = useRef();
  let dueDateRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'books'), {
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        dueDate: dueDateRef.current.value,
        attachmentLink: attachmentLink ? attachmentLink : null,
        completed: false
      })
    } catch (err) {
      console.log(err)
    }
    titleRef.current.value = null
    descriptionRef.current.value = null
    dueDateRef.current.value = null
    setFile()
  }

  let today = new Date().toISOString().slice(0, 10)

  return (
    <div className="App">
      <h1 className='header-txt'>My ToDos</h1>
     {todos.length ? <div className='table-header'>
      <h3>Title</h3>
      <h3>Description</h3>
      <h3>Due Date</h3>
      <h3>Attachment</h3>
     </div> : null}
     <div className='todos-container'>
      {todos ? todos.map((todo)=> <ToDo key={todo.id} todo={todo} setModal={setModal} />) : <h2>Loading</h2>}
     </div>
     {modal.id ? <Modal modal={modal} setModal={setModal} file={file} setFile={setFile} /> : null}
     <form onSubmit={handleSubmit} className="addTodo-form">
        <input ref={titleRef} type="text" placeholder='Title' required />
        <input ref={descriptionRef} type="text" placeholder='Description' required />
        <input type="date" ref={dueDateRef} min={today} required />
        <input type="file" accept='image/*' id='file' onChange={(e) => setFile(e.target.files[0]) } />
        <label htmlFor="file"><img className='attachIcon' src={attach} alt="attachment icon"/></label>
        {file ? <span>{file.name}</span> : null}
        <button type='submit'>{btn}</button>
      </form>
    </div>
  )
}

export default App
