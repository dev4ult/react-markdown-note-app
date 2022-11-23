import { useState, useEffect } from 'react';
import FontEditor from './FontEditor.jsx';
import parse from 'html-react-parser';

import headingIcon from '../assets/heading.svg';
import boldIcon from '../assets/bold.svg';
import italicIcon from '../assets/italic.svg';
import strikethroughIcon from '../assets/strikethrough.svg';
import hyperlinkIcon from '../assets/hyperlink.svg';
import doublequoteIcon from '../assets/double-quote.svg';
import codeIcon from '../assets/code.svg';
import imageIcon from '../assets/image.svg';
import bulletedlistIcon from '../assets/bulleted-list.svg';
import numberedlistIcon from '../assets/numbered-list.svg';
import checklistIcon from '../assets/check-list.svg';

function Notes({ handleNoteChange, textNote, handleFont, onKeydownNote, showDoc }) {
  const [previewMode, setViewMode] = useState(false);
  const [previewNote, setPreviewNote] = useState('doNotLetEmpty');

  useEffect(() => {
    setPreviewNote(() => {
      // changing new line into <br />
      let newNote = textNote.replace(/\n/g, '<br />');

      // changing tab into &ensp;
      newNote = newNote.replace(/\t/g, '&ensp;&ensp;');

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
            newNote = newNote.replace(regEx, symbol === '%' ? `<div className='code'><${tag}>` : `<${tag}>`);
          } else {
            newNote = newNote.replace(regEx, symbol === '%' ? `</div></${tag}>` : `</${tag}>`);
          }
        }
      }

      // changing # for heading with <h1> html tag
      convertSymbolToTag('#', 'h1');
      convertSymbolToTag('!', 'b');
      convertSymbolToTag('_', 'i');
      convertSymbolToTag('~', 's');
      convertSymbolToTag('"', 'q');
      convertSymbolToTag('%', 'code');

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
          <FontEditor name="Heading" src={headingIcon} onClick={handleFont.bind(null, '#')} />
          <FontEditor name="Bold" src={boldIcon} onClick={handleFont.bind(null, '!')} />
          <FontEditor name="Italic" src={italicIcon} onClick={handleFont.bind(null, '_')} />
          <FontEditor name="Strikethrough" src={strikethroughIcon} onClick={handleFont.bind(null, '~')} />
          <FontEditor name="Hyperlink" src={hyperlinkIcon} />
          <FontEditor name="Double-quote" src={doublequoteIcon} onClick={handleFont.bind(null, '"')} />
          <FontEditor name="Code" src={codeIcon} onClick={handleFont.bind(null, '%')} />
          <FontEditor name="Image" src={imageIcon} />
        </div>
        <div className="editor-list">
          <FontEditor name="Bulleted List" src={bulletedlistIcon} onClick={handleFont.bind(null, 'bullet')} />
          <FontEditor name="Numbered List" src={numberedlistIcon} onClick={handleFont.bind(null, 'number')} />
          <FontEditor name="Check List" src={checklistIcon} onClick={handleFont.bind(null, 'checklist')} />
        </div>
      </section>
      <section className="note-view">{previewMode ? <div className="preview-note">{previewNote}</div> : <textarea className="write-note" onChange={handleNoteChange} onKeyDown={onKeydownNote} value={textNote}></textarea>}</section>
      <div className="doc-container">
        <button className="btn-view-note cursor-pointer" onClick={showDoc}>
          Documentation
        </button>
      </div>
    </div>
  );
}

export default Notes;
