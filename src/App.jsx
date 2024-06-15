import React, { useState, useEffect } from 'react'
import './App.css';
import Preview from './components/Preview'
import Message from './components/Message'
import NotesContainer from './components/Notes/NotesContainer';
import NotesList from './components/Notes/NotesList';
import Note from './components/Notes/Note';
import NoteForm from './components/Notes/NoteForm';
import Alert from './components/Alert';

function App() {

  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  useEffect(() => {
    if(localStorage.getItem('notes')){
      setNotes(JSON.parse(localStorage.getItem('notes')))
    }else {
      localStorage.setItem('notes', JSON.stringify([]))
    }
  }, [])

  const validate = () => {
    const validationErrors = []
    let passed = true
    if (!title) {
      validationErrors.push('الرجاء ادخال عنوان الملاحظة')
      passed = false
    }
    if(!content) {
      validationErrors.push('الرجاء ادخال محتوى الملاحظة')
      passed = false
    }
    setValidationErrors(validationErrors)
    return passed
  }

  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  }

  const changeTitleHandler = (event) => {
    setTitle(event.target.value)
  }
  const changeContentHandler = (event) => {
    setContent(event.target.value)
  }
  const saveNoteHandler = () => {
    if(!validate()) return;

    const note = {
      id: new Date(),
      title: title,
      content: content
    }

    const updatedNotes = [...notes, note]
    saveToLocalStorage('notes', updatedNotes)
    setNotes(updatedNotes)
    setCreating(false)
    setSelectedNote(note.id)
    setTitle('')
    setContent('')
  }

  const selectNoteHandler = (noteId) => {
    setSelectedNote(noteId)
    setCreating(false)
    setEditing(false)
  }

  const editNoteHandler = () => {
    const note = notes.find(note => note.id === selectedNote)
    setEditing(true)
    setTitle(note.title)
    setContent(note.content)
  }
  
  const updateNoteHandler = () => {
    if(!validate()) return;

    const updatedNotes = [...notes]
    const noteIndex = notes.findIndex(note => note.id === selectedNote)
    updatedNotes[noteIndex] = {
      id: selectedNote,
      title: title,
      content: content
    }
    saveToLocalStorage('notes', updatedNotes)
    setNotes(updatedNotes)
    setEditing(false)
    setTitle('')
    setContent('')
  }

  const addNoteHandler = () => {
    setCreating(true)
    setEditing(false)
    setTitle('')
    setContent('')
  }

  const deleteNoteHandler = () => {
    // const updatedNotes = [...notes]
    const noteIndex = notes.findIndex(note => note.id === selectedNote)
    notes.splice(noteIndex, 1)
    saveToLocalStorage('notes', notes)
    setNotes(notes)
    setSelectedNote(null)
  }

  const getAddNote = () => {
    return (
      <NoteForm 
        formTitle='ملاحظة جديدة'
        title={title}
        content={content}
        titleChanged={changeTitleHandler}
        contentChanged={changeContentHandler}
        submitText='حفظ'
        submitClicked={saveNoteHandler}
      />
    );
  };

  const getPreview = () => {
    if (notes.length === 0) {
      return <Message title='لا يوجد ملاحظة' />
    }
    if (!selectedNote) {
      return <Message title='الرجاء اختيار ملاحظة' />
    }

    const note = notes.find(note => note.id === selectedNote)

    
    let noteDisplay = (
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    )
    
    if (editing) {
      noteDisplay = (
        <NoteForm 
          formTitle='تعديل الملاحظة'
          title={title}
          content={content}
          titleChanged={changeTitleHandler}
          contentChanged={changeContentHandler}
          submitText='تعديل'
          submitClicked={updateNoteHandler}
        />
      )
    }

    return (
      <div>
        {!editing &&
          <div className="note-operations">
            <a href="#" onClick={editNoteHandler}>
              <i className="fa fa-pencil-alt" />
            </a>
            <a href="#" onClick={deleteNoteHandler}>
              <i className="fa fa-trash" />
            </a>
          </div>
        }
        
        {noteDisplay}
      </div>
    );
  };

  
  return (
    <div className="App">
      <NotesContainer>
        <NotesList>
          {notes.map(note => 
            <Note 
              key={note.id} 
              title={note.title} 
              noteClicked={() => selectNoteHandler(note.id)} 
              active={selectedNote === note.id}
            />)}
        </NotesList>
        {!editing && !creating && <button className="add-btn" onClick={addNoteHandler}>+</button>}
      </NotesContainer>
      <Preview>
        {creating ? getAddNote() : getPreview()}
      </Preview>
      {validationErrors.length !== 0 && <Alert validationMessages={validationErrors} />}
    </div>
  );
}

export default App;
