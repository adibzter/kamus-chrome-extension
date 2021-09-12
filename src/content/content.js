(() => {
  // Create kamus-selection-popup
  const selectionPopup = document.createElement('div');
  selectionPopup.textContent = 'CARI MAKSUD';
  selectionPopup.id = 'kamus-selection-popup';
  selectionPopup.hidden = true;
  document.documentElement.append(selectionPopup);

  // Create kamus-body
  const kamusBody = document.createElement('div');
  kamusBody.id = 'kamus-body';
  kamusBody.hidden = true;
  document.documentElement.append(kamusBody);

  // When user click "CARI MAKSUD" popup
  selectionPopup.onclick = async () => {
    main();
  };

  // When user click outside kamus-body
  document.body.onclick = async () => {
    kamusBody.hidden = true;
    insertInnerHtmlKamusBody('');
  };
})();

function getSelectionPopup() {
  return document.querySelector('#kamus-selection-popup');
}

function getkamusBody() {
  return document.querySelector('#kamus-body');
}

function insertInnerHtmlKamusBody(html) {
  const kamusBody = getkamusBody();
  kamusBody.innerHTML = html;
}

let selectedText;

// When user select text
window.onmouseup = () => {
  const selection = window.getSelection();
  const text = selection.toString();
  if (!text) {
    const selectionPopup = getSelectionPopup();
    selectionPopup.hidden = true;
    return;
  }

  const position = selection.getRangeAt(0).getBoundingClientRect();
  setSelectionPopup(position);

  selectedText = text;
};

function setSelectionPopup(position) {
  const selectionPopup = getSelectionPopup();
  selectionPopup.hidden = false;

  // JANGAN DISENTUH
  let top = position.top + window.scrollY - 60;
  top = top < 0 ? top + 100 : top;
  selectionPopup.style.top = top + 'px';
  selectionPopup.style.left = position.left + 'px';
  return selectionPopup;
}

/////////////// KAMUS DIV ///////////////////

const proxyUrl = 'https://proxy.skrin.xyz';
// const proxyUrl = 'http://localhost:5000';
const prpmUrl = 'https://prpm.dbp.gov.my';

async function main() {
  const kamusBody = getkamusBody();
  kamusBody.hidden = false;
  const res = await postRequest({
    url: `${prpmUrl}/Cari1?keyword=${selectedText}`,
  });

  // Manipulate DOM by inserting definitions
  getDefinitionsFromDom(res);
}

async function postRequest(data) {
  try {
    const res = await fetch(`${proxyUrl}/post`, {
      method: 'POST',
      mode: 'cors',
      cache: 'force-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.text();
  } catch (err) {
    log(err);
  }
}

function getDefinitionsFromDom(res) {
  insertInnerHtmlKamusBody(res);
  const definitions = document.querySelectorAll('#kamus-body .tab-pane');
  insertInnerHtmlKamusBody('');

  const kamusDiv = createKamusDiv();
  const kamusTitle = createKamusTitle(selectedText);
  kamusDiv.append(kamusTitle);
  if (definitions.length) {
    definitions.forEach((definition) => {
      removeAttributes(definition);
      definition.className = 'definition';

      kamusDiv.append(definition);
    });
  } else {
    selectedText = sliceLongString(selectedText);
    insertInnerHtmlKamusBody(`<h1>'${selectedText}' tidak ditemui</h1>`);
  }
}

function createKamusDiv() {
  const kamusDiv = document.createElement('div');
  kamusDiv.id = 'kamus-div';
  const kamusBody = getkamusBody();
  kamusBody.append(kamusDiv);

  return kamusDiv;
}

function createKamusTitle(selectedText) {
  const kamusTitle = document.createElement('h1');
  kamusTitle.textContent = selectedText;
  kamusTitle.id = 'kamus-title';
  const kamusBody = getkamusBody();
  kamusBody.append(kamusTitle);

  return kamusTitle;
}

function removeAttributes(element) {
  [...element.attributes].forEach((attribute) =>
    element.removeAttribute(attribute.name)
  );
}

function sliceLongString(string) {
  const max = 20;
  if (string.length > max) {
    string = string.slice(0, max);
    string += '...';
  }
  return string;
}

// Trigger main function if context menu clicked
chrome.runtime.onMessage.addListener(() => {
  main();
});

// Logging
function log(m) {
  console.log(m);
}
