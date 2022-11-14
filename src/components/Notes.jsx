import { useState, useEffect } from 'react';

function Notes() {
  const [active, setActive] = useState({
    btnWrite: true,
    btnPreview: false,
  });

  const { btnWrite, btnPreview } = active;

  function handleActive() {
    setActive((prevSet) => {
      const { btnWrite, btnPreview } = prevSet;
      return {
        btnWrite: !btnWrite,
        btnPreview: !btnPreview,
      };
    });
  }

  return (
    <div className="Notes">
      <section className="toolbars">
        <button type="button" className={`btn-view-note${btnWrite ? ' btn-active' : ''}`} name="btnWrite" onClick={handleActive}>
          Write
        </button>
        <button type="button" className={`btn-view-note${btnPreview ? ' btn-active' : ''}`} name="btnPreview" onClick={handleActive}>
          Preview
        </button>
      </section>
      <section className="note-view">
        <textarea className="write-note"></textarea>
        <div className="preview-note"></div>
      </section>
    </div>
  );
}

export default Notes;
