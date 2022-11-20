import { useState, useEffect } from 'react';
import './App.css';
import Notes from './components/Notes.jsx';
import Modal from './components/Modal.jsx';

import deleteIcon from './assets/delete.svg';
import editIcon from './assets/edit.svg';
import checkIcon from './assets/check.svg';

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

  const [inputTextVal, setInputTextVal] = useState('');

  const [show, setShow] = useState(false);

  const [modal, setModal] = useState(
    <Modal title="Warning !" desc="If selected text is matching with more than one string. Please manually type the existing font editor to style your text" setShowHandle={setShow} btnHideModalText="Close" />
  );
  const [modalType, setModalType] = useState('new-note-form');

  function selectedIndex() {
    const indexOfSelected = notes.map((note) => note.selected).indexOf(true);
    return indexOfSelected;
  }

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
      setTextNote(notes[selectedIndex()].text);
    }
  }, [notes]);

  function addNote() {
    if (inputTextVal !== '') {
      setNotes((prevNotes) => {
        const newId = prevNotes.length == 0 ? 1 : prevNotes[prevNotes.length - 1].id + 1;

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
      if (e.target.className === 'input-edit-title') {
        editTabTitle();
      } else {
        addNote();
      }
    }
  }

  function handleChange(e) {
    const { value } = e.target;
    setInputTextVal(value);
  }

  function toggleSelect(e) {
    const { id } = e.target;
    const index = notes.map((note) => note.id).indexOf(parseInt(id));

    if (index >= 0) {
      setNotes((prevNotes) => {
        const newNotes = prevNotes;
        // newNotes[selectedIndex()].selected = false;
        newNotes.forEach((note) => {
          note.selected = false;
        });

        newNotes[index].selected = true;
        return [...newNotes];
      });

      setTextNote(notes[index].text);
    }
  }

  const [editTabMode, setEditTabMode] = useState(false);

  function editTabTitle() {
    setEditTabMode((prevMode) => {
      if (prevMode && inputTextVal !== '') {
        setNotes((prevNotes) => {
          prevNotes[selectedIndex()].title = inputTextVal;
          return [...prevNotes];
        });
        setInputTextVal('');
      }

      return !prevMode;
    });
  }

  function deleteNote() {
    setNotes((prevNotes) => {
      const newNotes = prevNotes;

      newNotes.splice(selectedIndex(), 1);
      if (newNotes.length !== 0) {
        newNotes[0].selected = true;
      } else {
        localStorage.setItem('notes', JSON.stringify([]));
      }

      return [...newNotes];
    });
    setShow(false);
  }

  const noteList = notes.map((note) => {
    const { id, title, selected } = note;
    return (
      <li key={id}>
        {selected ? (
          <div className="note-tab-title btn-selected">
            {editTabMode ? (
              <>
                <input type="text" className="input-edit-title" onChange={handleChange} onKeyDown={handleKey} value={inputTextVal} />
                <button type="button" className="edit-tab-btn cursor-pointer" onClick={editTabTitle}>
                  <img src={checkIcon} alt="Check Button" />
                </button>
              </>
            ) : (
              title
            )}
            {editTabMode ? (
              ''
            ) : (
              <div>
                <button type="button" className="edit-tab-btn cursor-pointer">
                  <img src={editIcon} alt="Edit Button" onClick={editTabTitle} />
                </button>
                <button type="button" className="edit-tab-btn cursor-pointer" onClick={deleteNote}>
                  <img src={deleteIcon} alt="Delete Button" />
                </button>
              </div>
            )}
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
      prevNotes[selectedIndex()].text = value;
      return [...prevNotes];
    });
  }

  // function showConfirmDelete() {
  //   setModalType('confirm-delete');
  //   setModal(<Modal title="Confirm Delete" desc="Are you sure you want to delete this note?" onClickAccept={deleteNote} btnAcceptModalText="Delete" setShowHandle={setShow} btnHideModalText="Cancel" />);
  //   setShow(true);
  // }

  useEffect(() => {
    const textArea = document.querySelector('textarea');
    if (textNote !== '' && textArea !== null) {
      const { value } = textArea;

      setNotes((prevNotes) => {
        prevNotes[selectedIndex()].text = value;
        return [...prevNotes];
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
        setModal(<Modal title="Warning !" desc="If selected text is matching with more than one string. Please manually type the existing font editor to style your text" setShowHandle={setShow} btnHideModalText="Close" />);
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
      <aside className={notes.length !== 0 ? 'mr-1rem' : ''}>
        <button
          className={'heading cursor-pointer' + (notes.length !== 0 ? ' mb-1rem' : '')}
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
            modal
          ))}
        <ul>{noteList}</ul>
      </aside>
      {notes.length === 0 ? '' : <Notes handleNoteChange={handleNoteChange} textNote={textNote} handleFont={fontEditorClicked} />}
    </div>
  );
}

export default App;
