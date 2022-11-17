import { useState, useEffect } from 'react';
import FontEditor from './FontEditor.jsx';

function Notes({ handleNoteChange, textNote }) {
  const [previewMode, setVideMode] = useState(false);
  const [previewNote, setPreviewNote] = useState('');

  useEffect(() => {
    // changing new line into <br />
    setPreviewNote(textNote.replace(/\n/g, '<br />'));

    // heading styling with h2 html tag
    console.log(previewNote.match(/#/g).length);
  }, [textNote, previewMode]);

  function toggleView(e) {
    const { name } = e.target;
    setVideMode((prevSet) => {
      return (name === 'btnPreview' && prevSet) || (name === 'btnWrite' && !prevSet) ? prevSet : !prevSet;
    });
  }

  return (
    <div className="Notes">
      <section className="toolbars">
        <div className="view-list">
          <button type="button" className={'btn-view-note' + (previewMode ? '' : ' btn-active')} name="btnWrite" onClick={toggleView}>
            Write
          </button>
          <button type="button" className={'btn-view-note' + (previewMode ? ' btn-active' : '')} name="btnPreview" onClick={toggleView}>
            Preview
          </button>
        </div>
        <div className="editor-list">
          <FontEditor name="Heading" svg="heading.svg" />
          <FontEditor name="Bold" svg="bold.svg" />
          <FontEditor name="Italic" svg="italic.svg" />
          <FontEditor name="Strikethrough" svg="Strikethrough.svg" />
          <FontEditor name="Hyperlink" svg="hyperlink.svg" />
          <FontEditor name="Double-quote" svg="double-quote.svg" />
          <FontEditor name="Code" svg="code.svg" />
          <FontEditor name="Image" svg="image.svg" />
        </div>
        <div className="editor-list">
          <FontEditor name="Bulleted List" svg="bulleted-list.svg" />
          <FontEditor name="Numbered List" svg="numbered-list.svg" />
          <FontEditor name="Check List" svg="check-list.svg" />
        </div>
      </section>
      <section className="note-view">{previewMode ? <div className="preview-note">{previewNote}</div> : <textarea className="write-note" onChange={handleNoteChange} value={textNote}></textarea>}</section>
    </div>
  );
}

export default Notes;
