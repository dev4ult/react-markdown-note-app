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

  function handleKeyNote(e) {
    const { selectionStart } = e.target;
    if (e.key == 'Tab') {
      setTextNote((prevNote) => {
        return prevNote.slice(0, selectionStart) + '\t' + prevNote.slice(selectionStart, prevNote.length);
      });
      e.preventDefault();
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
              <div className="edit-tab-title">
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

  function fontEditorClicked(symbol, attribute) {
    if (!document.querySelector('textarea')) {
      return;
    }

    const textArea = document.querySelector('textarea');
    const selectedText = window.getSelection().toString();
    const startIndex = textArea.selectionStart;
    const endIndex = textArea.selectionEnd;

    if (symbol.length > 2) {
      setTextNote((prevNote) => {
        function createList(listStyle) {
          return typeof listStyle === 'number'
            ? '1. first task\n2. second task\n3. third task'
            : listStyle === '-'
            ? `${listStyle} first task\n${listStyle} second task\n${listStyle} third task`
            : `${listStyle}first task${listStyle}\n${listStyle}second task${listStyle}\n${listStyle}third task${listStyle}`;
        }

        return prevNote + (symbol === 'bullet' ? createList('-') : symbol === 'number' ? createList(1) : createList('&'));
      });
    } else {
      if (selectedText === '') {
        setTextNote((prevNote) => {
          return prevNote + symbol + (attribute !== '' ? 'words ' + attribute + '=put_link_here' : '') + symbol;
        });
        textArea.focus();
      } else {
        setTextNote((prevTextNote) => {
          let newNote = prevTextNote;

          newNote = newNote.slice(0, startIndex) + symbol + selectedText + (attribute !== '' ? ' ' + attribute + '=put_link_here' : '') + symbol + newNote.slice(endIndex, newNote.length);

          textArea.setSelectionRange(startIndex, endIndex);
          textArea.focus();

          return newNote;
        });

        // const matchingText = textNote.match(new RegExp(selectedText, 'g'));
        // if (matchingText.length > 1) {
        //   setModalType('warning-sign');
        //   setModal(<Modal title="Warning !" desc="If selected text is matching with more than one string. Please manually type the existing font editor to style your text" setShowHandle={setShow} btnHideModalText="Close" />);
        //   setShow(true);
        // } else {

        // }
      }
    }
  }

  function showDoc() {
    setModal(
      <Modal
        title="Documentation"
        desc={
          <>
            <h3>About</h3>
            <p>
              Note Act is a Markdown Note App created with React.js by{' '}
              <a href="https://github.com/dev4ult" target="_blank">
                Nibras Alyassar
              </a>{' '}
              and it is open source, you can find the repositories{' '}
              <a href="https://github.com/dev4ult/react-note-app" target="_blank">
                here
              </a>
            </p>
            <h3 className="mt-12px">How to use?</h3>
            <p>By selecting first the word in your write note, you can click one of the font editor button at the top of the write or preview section</p>
            <h3 className="mt-12px">Alternative</h3>
            <p>You can manually type the font editor to style your text like one of below :</p>
            <ul>
              <li>
                <b>bold</b> using @bold@ - at sign
              </li>
              <li>
                <u>underline</u> using _underline_ - underscore
              </li>
              <li>
                <i>italic</i> using !italic! - exclamation mark
              </li>
              <li>
                <s>strikethrough</s> using ~strikethrough~ - tilde
              </li>
              <li>etc...</li>
            </ul>
          </>
        }
        setShowHandle={setShow}
        btnHideModalText="Close"
      />
    );
    setModalType('documentation');
    setShow(true);
  }

  return (
    <div className="App">
      <aside className={notes.length !== 0 ? '' : 'flex'}>
        {notes.length === 0 ? (
          <button className="heading btn-selected cursor-pointer title-heading" onClick={showDoc}>
            Doc...
          </button>
        ) : (
          ''
        )}
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
        <ul className="tab-title-list">{noteList}</ul>
      </aside>

      {notes.length === 0 ? (
        ''
      ) : (
        <>
          <div className="bg-shadow"></div>
          <Notes handleNoteChange={handleNoteChange} textNote={textNote} handleFont={fontEditorClicked} onKeydownNote={handleKeyNote} showDoc={showDoc} />
        </>
      )}
    </div>
  );
}

export default App;
