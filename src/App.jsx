import './App.css';
import Notes from './components/Notes.jsx';

function App() {
  return (
    <div className="App">
      <aside>
        <div className="heading">
          <h1 className="title-heading">Notes</h1>
          <button type="button" className="btn-add-note">
            +
          </button>
        </div>
        <ul>
          <li className="note-tab-title">Note 1</li>
          <li className="note-tab-title">Note 1</li>
          <li className="note-tab-title tab-active">Note 1</li>
          <li className="note-tab-title">Note 1</li>
          <li className="note-tab-title">Note 1</li>
        </ul>
      </aside>
      <Notes />
    </div>
  );
}

export default App;
