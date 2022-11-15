import { useState, useEffect } from 'react';
import './App.css';
import Notes from './components/Notes.jsx';
import Modal from './components/Modal.jsx';

function App() {
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState([]);

  function addNote() {
    const textInput = document.querySelector('.modal-input-text');
    const title = textInput.value;

    if (title !== '') {
      setNotes((prevNotes) => {
        return [
          ...prevNotes,
          {
            id: prevNotes.length == 0 ? 1 : prevNotes[prevNotes.length - 1].id + 1,
            title,
            selected: false,
          },
        ];
      });
      setShow(false);
    }
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

  return (
    <div className="App">
      <aside>
        <div className="heading">
          <h1 className="title-heading">Notes</h1>
          <button type="button" className="btn-show-modal" onClick={setShow.bind(null, true)}>
            +
          </button>
        </div>
        {show && (
          <div className="modal-container">
            <div className="modal">
              <Modal title="Note Title" textInput="Type your note title here" />
              <div>
                <button className="btn-add-note" onClick={addNote}>
                  add
                </button>
                <button className="btn-hide-modal" type="button" onClick={setShow.bind('', false)}>
                  cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <ul>
          {notes.map((note) => {
            const { id, title, selected } = note;
            return (
              <li>
                <button className={'note-tab-title' + (selected ? ' tab-active' : '')} key={title} id={id} onClick={toggleSelected}>
                  {title}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
      <Notes />
    </div>
  );
}

export default App;
