const STORAGE_KEY = "MARKDOWN_EDITOR_CONTENT";

$(function () {
  let isEdited = false;

  let adjustScreen = () => {
    let screenHeight = $(window).height();
    let headerHeight = $("#header").outerHeight();
    let footerHeight = $("#footer").outerHeight();
    let containerHeight = screenHeight - headerHeight - footerHeight;
    $("#container").css({ top: `${headerHeight}px` });
    $(".column").css({ height: `${containerHeight}px` });
  };

  $(window).resize(() => {
    adjustScreen();
  });

  // Setup editor
  let editor = ace.edit("editor");
  editor.getSession().setUseWrapMode(true);
  editor.renderer.setScrollMargin(10, 10, 10, 10);
  editor.setOptions({
    maxLines: Infinity,
    indentedSoftWrap: false,
    fontSize: 14,
    autoScrollEditorIntoView: true,
    theme: "ace/theme/github",
    // TODO consider some options
  });

  getFromLocalStorage(editor);

  editor.on("change", (_, e) => {
    isEdited = true;
    convert();
    adjustScreen();
    saveToLocalStorage(e);
  });

  let convert = () => {
    let html = marked(editor.getValue());
    let sanitized = DOMPurify.sanitize(html);
    $("#output").html(sanitized);
  };

  //leave
  $(window).bind("beforeunload", function () {
    if (isEdited) {
      return "Are you sure you want to leave? Your changes will be lost.";
    }
  });

  convert();
  adjustScreen();
});

function getFromLocalStorage(editor) {
  const text = localStorage.getItem(STORAGE_KEY);
  if (text?.length > 0) {
    editor.setValue(text);
    console.info('Loaded from local storage');
  }
}

function saveToLocalStorage(editor) {
  const text = editor.getValue();
  localStorage.setItem(STORAGE_KEY, text);
}
