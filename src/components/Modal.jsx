import { useState } from 'react';

function Modal(props) {
  const [inputVal, setInputVal] = useState('');

  const { title, desc, textInput } = props;

  function handleChange(e) {
    const { value } = e.target;
    setInputVal(value);
  }

  return (
    <>
      <h1 className="modal-title">{title}</h1>
      {true && (desc ? <p className="modal-desc">{desc}</p> : false)}
      {true && (textInput ? <input className="modal-input-text" type="text" placeholder={textInput} value={inputVal} onChange={handleChange} name="text-input" /> : false)}
    </>
  );
}

export default Modal;
