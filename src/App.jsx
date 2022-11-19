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
  const [selectedNote, setSelectedNote] = useState(1);

  const [textNote, setTextNote] = useState('');

  const [inputTextVal, setInputTextVal] = useState('');

  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState('new-note-form');

  useEffect(() => {
    if (localStorage.getItem('notes') === null) {
      localStorage.setItem('notes', JSON.stringify([]));
      setNotes([]);
    } else {
      const notesFromLocalStorage = JSON.parse(localStorage.getItem('notes'));
      setNotes(notesFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
      setTextNote(notes[selectedNote].text);
    }
  }, [notes]);

  function addNote() {
    if (inputTextVal !== '') {
      setNotes((prevNotes) => {
        const newId = prevNotes.length == 0 ? 1 : prevNotes[prevNotes.length - 1].id + 1;
        setSelectedNote(newId);

        notes.forEach((note) => {
          note.selected = false;
        });
        return [
          ...prevNotes,
          {
            id: newId,
            title: inputTextVal,
            text: '',
            selected: true,
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
      newNotes[selectedNote].selected = false;
      newNotes[index].selected = true;
      return [...newNotes];
    });

    setSelectedNote(index);
    setTextNote(notes[index].text);
  }

  function editTitleNote() {}

  function deleteNote() {
    setNotes((prevNote) => prevNote.splice(selectedNote, 1));
  }

  const noteList = notes.map((note) => {
    const { id, title, selected } = note;
    return (
      <li key={id}>
        {selected ? (
          <div className="note-tab-title btn-selected">
            {title}
            <button type="button" className="edit-tab-btn cursor-pointer" onClick={editTitleNote}>
              <img src="./src/assets/edit.svg" alt="Edit Button" />
            </button>
            <button type="button" className="edit-tab-btn cursor-pointer" onClick={deleteNote}>
              <img src="./src/assets/delete.svg" alt="Delete Button" />
            </button>
          </div>
        ) : (
          <button type="button" className="note-tab-title cursor-pointer" onClick={toggleSelect} id={id}>
            {title}
          </button>
        )}
      </li>
    );
  });

  function handleNoteChange(e) {
    const { value } = e.target;
    setTextNote(value);
    setNotes((prevNotes) => {
      const indexOfSelected = prevNotes.map((note) => note.selected).indexOf(true);
      const newNotes = prevNotes;
      newNotes[indexOfSelected].text = value;
      return [...newNotes];
    });
  }

  useEffect(() => {
    if (textNote !== '') {
      const textArea = document.querySelector('textarea');
      const { value } = textArea;

      setNotes((prevNotes) => {
        const indexOfSelected = prevNotes.map((note) => note.selected).indexOf(true);
        const newNotes = prevNotes;
        newNotes[indexOfSelected].text = value;
        return [...newNotes];
      });
    }
  }, [textNote]);

  function fontEditorClicked(symbol) {
    if (!document.querySelector('textarea')) {
      return;
    }
    const textArea = document.querySelector('textarea');
    const selectedText = window.getSelection().toString();
    const textLength = selectedText.length;

    if (selectedText === '') {
      setTextNote((prevNote) => `${prevNote} ${symbol}${symbol} `);
      textArea.focus();
    } else {
      const matchingText = textNote.match(new RegExp(selectedText, 'g'));
      if (matchingText.length > 1) {
        setModalType('warning-sign');
        setShow(true);
      } else {
        setTextNote((prevTextNote) => {
          let newNote = prevTextNote;

          const startIndex = newNote.indexOf(selectedText);
          newNote = newNote.slice(0, startIndex) + `${symbol}${selectedText}${symbol}` + newNote.slice(startIndex + textLength, newNote.length);

          textArea.focus();
          return newNote;
        });
      }
    }
  }

  return (
    <div className="App">
      <aside>
        <button
          className="heading cursor-pointer"
          type="button"
          onClick={function () {
            setModalType('new-note-form');
            setShow(true);
          }}
        >
          <h1 className="title-heading">New Note</h1>
          <div className="btn-show-modal">+</div>
        </button>
        {show &&
          (modalType === 'new-note-form' ? (
            <Modal
              title="New Note"
              textInput="Type your new note here"
              onKeydown={handleKey}
              onClickAccept={addNote}
              btnAcceptModalText="Add"
              setShowHandle={setShow}
              handleInput={handleChange}
              inputVal={inputTextVal}
              btnHideModalText="Cancel"
            />
          ) : (
            <Modal title="Warning !" desc="If selected text is matching with more than one string. Please manually type the existing font editor to style your text" setShowHandle={setShow} btnHideModalText="Close" />
          ))}
        <ul>{noteList}</ul>
      </aside>
      <Notes handleNoteChange={handleNoteChange} textNote={textNote} handleFont={fontEditorClicked} />
    </div>
  );
}

export default App;
