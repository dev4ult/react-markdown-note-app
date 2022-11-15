import { useState, useEffect } from 'react';
import './App.css';
import Notes from './components/Notes.jsx';
import Modal from './components/Modal.jsx';

function App() {
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState([]);
  const [inputTextVal, setInputTextVal] = useState('');

  function addNote() {
    if (inputTextVal !== '') {
      setNotes((prevNotes) => {
        const newId = prevNotes.length == 0 ? 1 : prevNotes[prevNotes.length - 1].id + 1;
        return [
          ...prevNotes,
          {
            id: newId,
            title: inputTextVal,
            selected: false,
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

  function toggleSelected(e) {
    const { id } = e.target;
    const index = notes.map((note) => note.id).indexOf(parseInt(id));

    setNotes((prevNotes) => {
      const newNotes = prevNotes;
      newNotes.forEach((note) => {
        note.selected = false;
      });
      newNotes[index].selected = true;
      return [...newNotes];
    });
  }

  const noteList = notes.map((note) => {
    const { id, title, selected } = note;
    return (
      <li>
        <button className={'note-tab-title' + (selected ? ' tab-active' : '')} key={title} id={id} onClick={toggleSelected}>
          {title}
        </button>
      </li>
    );
  });

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
      <Notes />
    </div>
  );
}

export default App;
