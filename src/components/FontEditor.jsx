function FontEditor({ name, src, onClick }) {
  return (
    <button type="button" className="font-editor cursor-pointer" onClick={onClick}>
      <img src={src} alt={name + ' logo'} className="editor-img" />
    </button>
  );
}

export default FontEditor;
