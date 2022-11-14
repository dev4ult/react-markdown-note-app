import { useState } from 'react';
import FontEditor from './FontEditor.jsx';

function Notes() {
  const [active, setActive] = useState({
    btnWrite: true,
    btnPreview: false,
  });

  function handleActive(e) {
    const { name } = e.target;
    setActive((prevSet) => {
      const { btnWrite, btnPreview } = prevSet;
      return (name === 'btnWrite' ? btnWrite : btnPreview)
        ? prevSet
        : {
            btnWrite: !btnWrite,
            btnPreview: !btnPreview,
          };
    });
  }

  const { btnWrite, btnPreview } = active;

  return (
    <div className="Notes">
      <section className="toolbars">
        <div className="view-list">
          <button type="button" className={`btn-view-note${btnWrite ? ' btn-active' : ''}`} name="btnWrite" onClick={handleActive}>
            Write
          </button>
          <button type="button" className={`btn-view-note${btnPreview ? ' btn-active' : ''}`} name="btnPreview" onClick={handleActive}>
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
      <section className="note-view">
        <textarea className="write-note"></textarea>
        <div className="preview-note"></div>
      </section>
    </div>
  );
}

export default Notes;
