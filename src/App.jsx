import { useState, useEffect } from 'react';
import './App.css';
import Notes from './components/Notes.jsx';
import Modal from './components/Modal.jsx';

// checking storage availability
if (Storage !== undefined) {
  if (localStorage.getItem('notes') === null) {
    localStorage.setItem('notes', JSON.stringify([]));
  }
} else {
  console.log('Storage is not available for this browser');
}

function App() {
  const [notes, setNotes] = useState([]);

  const [textNote, setTextNote] = useState('');

  useEffect(() => {
    if (localStorage.getItem('notes') === null) {
      localStorage.setItem('notes', JSON.stringify([]));
      setNotes([]);
    } else {
      const notesFromLocalStorage = JSON.parse(localStorage.getItem('notes'));
      setNotes(notesFromLocalStorage);
    }
  }, []);

  const [show, setShow] = useState(false);
  const [inputTextVal, setInputTextVal] = useState('');

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  function addNote() {
    if (inputTextVal !== '') {
      setNotes((prevNotes) => {
        const newId = prevNotes.length == 0 ? 1 : prevNotes[prevNotes.length - 1].id + 1;
        return [
          ...prevNotes,
          {
            id: newId,
            title: inputTextVal,
            text: '',
            selected: prevNotes.length == 0 ? true : false,
          },
        ];
      });
      setInputTextVal('');
      setShow(false);
    }
  }

  function handleKey(e) {
    if (e.key == 'Enter') {
      addNote();
    }
  }

  function handleChange(e) {
    const { value } = e.target;
    setInputTextVal(value);
  }

  function toggleSelect(e) {
    const { id } = e.target;
    const index = notes.map((note) => note.id).indexOf(parseInt(id));

    setNotes((prevNotes) => {
      const newNotes = prevNotes;
      const indexOfPrevSelected = newNotes.map((note) => note.selected).indexOf(true);
      newNotes[indexOfPrevSelected].selected = false;
      newNotes[index].selected = true;
      return [...newNotes];
    });

    setTextNote(notes[index].text);
  }

  const noteList = notes.map((note) => {
    const { id, title, selected } = note;
    return (
      <li>
        <button className={'note-tab-title' + (selected ? ' tab-active' : '')} key={title} id={id} onClick={toggleSelect}>
          {title}
        </button>
      </li>
    );
  });

  function handleNoteChange(e) {
    const { value } = e.target;
    setTextNote(value);
    setNotes((prevNotes) => {
      const indexOfSelected = prevNotes.map((note) => note.selected).indexOf(true);
      const newNotes = prevNotes;
      newNotes[indexOfSelected].text = textNote;
      return [...newNotes];
    });
  }

  return (
    <div className="App">
      <aside>
        <div className="heading">
          <h1 className="title-heading">Notes</h1>
          <button type="button" className="btn-show-modal" onClick={setShow.bind(null, true)}>
            +
          </button>
        </div>
        {show && <Modal title="Note Title" textInput="Type your note title here" inputVal={inputTextVal} handleInput={handleChange} onKeydown={handleKey} setShowHandle={setShow} onClickAccept={addNote} />}
        <ul>{noteList}</ul>
      </aside>
      <Notes handleNoteChange={handleNoteChange} textNote={textNote} />
    </div>
  );
}

export default App;
