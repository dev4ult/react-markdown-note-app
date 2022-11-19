function FontEditor({ name, svg, onClick }) {
  return (
    <button type="button" className="font-editor cursor-pointer" onClick={onClick}>
      <img src={'./src/assets/' + svg} alt={name + ' logo'} className="editor-img" />
    </button>
  );
}

export default FontEditor;
