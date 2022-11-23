import parse from 'html-react-parser';

function Modal({ title, desc, textInput, onKeydown, onClickAccept, btnAcceptModalText, setShowHandle, handleInput, inputVal, btnHideModalText }) {
  return (
    <div className="modal-container">
      <div className="modal">
        <h1 className="modal-title">{title}</h1>
        {true && (desc ? <div className="modal-desc">{desc}</div> : false)}
        {true && (textInput ? <input className="modal-input-text" type="text" placeholder={textInput} value={inputVal} onChange={handleInput} onKeyDown={onKeydown} name="text-input" /> : false)}
        <div>
          {true && onClickAccept ? (
            <button className="btn-add-note cursor-pointer" onClick={onClickAccept}>
              {btnAcceptModalText}
            </button>
          ) : (
            ''
          )}
          {true && setShowHandle ? (
            <button className="btn-hide-modal cursor-pointer btn-view-note" type="button" onClick={setShowHandle.bind('', false)}>
              {btnHideModalText}
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
