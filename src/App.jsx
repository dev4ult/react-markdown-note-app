import './App.css';
import Notes from './components/Notes.jsx';

function App() {
  return (
    <div className="App">
      <aside>
        <h1 className="title-heading">Notes</h1>
        <ul>
          <li className="note-tab-title">Title 1</li>
          <li className="note-tab-title">Title 1</li>
          <li className="note-tab-title">Title 1</li>
          <li className="note-tab-title">Title 1</li>
          <li className="note-tab-title">Title 1</li>
        </ul>
      </aside>
      <Notes />
    </div>
  );
}

export default App;
