import { useState, useEffect } from 'react';
import FontEditor from './FontEditor.jsx';
import parse from 'html-react-parser';

function Notes({ handleNoteChange, textNote, handleFont }) {
  const [previewMode, setViewMode] = useState(false);
  const [previewNote, setPreviewNote] = useState('doNotLetEmpty');

  useEffect(() => {
    setPreviewNote(() => {
      // changing new line into <br />
      let newNote = textNote.replace(/\n/g, '<br />');

      function convertSymbolToTag(symbol, tag) {
        const globalRegEx = new RegExp(symbol, 'g');
        const regEx = new RegExp(symbol, '');

        let totalSymbol = textNote.match(globalRegEx);

        if (totalSymbol === null) {
          return false;
        }

        totalSymbol = totalSymbol.length;
        totalSymbol = totalSymbol % 2 !== 0 ? totalSymbol - 1 : totalSymbol;

        for (let i = 0; i < totalSymbol; i++) {
          if (i % 2 === 0) {
            newNote = newNote.replace(regEx, `<${tag}>`);
          } else {
            newNote = newNote.replace(regEx, `</${tag}>`);
          }
        }
      }

      // changing # for heading with <h1> html tag
      convertSymbolToTag('#', 'h1');
      convertSymbolToTag('!', 'b');
      convertSymbolToTag('_', 'i');
      convertSymbolToTag('~', 's');

      return newNote;
    });

    setPreviewNote((prevNote) => parse(prevNote));
  }, [previewMode, textNote]);

  function toggleView(e) {
    const { name } = e.target;
    setViewMode((prevSet) => {
      return (name === 'btnPreview' && prevSet) || (name === 'btnWrite' && !prevSet) ? prevSet : !prevSet;
    });
  }

  return (
    <div className="Notes">
      <section className="toolbars">
        <div className="view-list">
          <button type="button" className={'btn-view-note' + (previewMode ? ' cursor-pointer' : ' btn-selected')} name="btnWrite" onClick={toggleView}>
            Write
          </button>
          <button type="button" className={'btn-view-note' + (previewMode ? ' btn-selected' : ' cursor-pointer')} name="btnPreview" onClick={toggleView}>
            Preview
          </button>
        </div>
        <div className="editor-list">
          <FontEditor name="Heading" svg="heading.svg" onClick={handleFont.bind(null, '#')} />
          <FontEditor name="Bold" svg="bold.svg" onClick={handleFont.bind(null, '!')} />
          <FontEditor name="Italic" svg="italic.svg" onClick={handleFont.bind(null, '_')} />
          <FontEditor name="Strikethrough" svg="Strikethrough.svg" onClick={handleFont.bind(null, '~')} />
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
