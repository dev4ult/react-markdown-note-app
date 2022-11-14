function FontEditor(props) {
  const { svg, name } = props;
  return (
    <span className="font-editor">
      <img src={'./src/assets/' + svg} alt={name + ' logo'} className="editor-img" />
    </span>
  );
}

export default FontEditor;
