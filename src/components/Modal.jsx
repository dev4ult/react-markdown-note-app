function Modal(props) {
  const { title, desc, textInput, onKeydown, onClickAccept, setShowHandle, handleInput, inputVal } = props;

  return (
    <div className="modal-container">
      <div className="modal">
        <h1 className="modal-title">{title}</h1>
        {true && (desc ? <p className="modal-desc">{desc}</p> : false)}
        {true && (textInput ? <input className="modal-input-text" type="text" placeholder={textInput} value={inputVal} onChange={handleInput} onKeyDown={onKeydown} name="text-input" /> : false)}
        <div>
          <button className="btn-add-note" onClick={onClickAccept}>
            add
          </button>
          <button className="btn-hide-modal" type="button" onClick={setShowHandle.bind('', false)}>
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
