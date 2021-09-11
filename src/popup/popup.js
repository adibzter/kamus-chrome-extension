const proxyUrl = 'https://proxy.skrin.xyz';
// const proxyUrl = 'http://localhost:5000';
const prpmUrl = 'https://prpm.dbp.gov.my';

const css = document.createElement('link');
css.setAttribute('rel', 'stylesheet');
css.setAttribute('href', 'popup.css');

async function main() {
  const form = document.querySelector('form');
  const search = document.querySelector('#search-input');

  form.onsubmit = async (e) => {
    e.preventDefault();
    const keyword = search.value;

    // Place loading gif
    displayLoadingGif();

    const res = await postRequest({
      url: `${prpmUrl}/Cari1?keyword=${keyword}`,
    });

    // Manipulate DOM by inserting definitions
    getDefinitionsFromDom(res);
    appendCss();
  };
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

function displayLoadingGif() {
  insertInnerHtml('');
  appendCss();

  const loadingGif = document.createElement('img');
  loadingGif.src = '/src/images/loading.gif';
  loadingGif.alt = 'loading.gif';
  loadingGif.id = 'loading-gif';

  document.body.append(loadingGif);
}

function getDefinitionsFromDom(res) {
  insertInnerHtml(res);
  const definitions = document.querySelectorAll('.tab-pane');
  insertInnerHtml('');

  const kamusDiv = createKamusDiv();

  definitions.length
    ? definitions.forEach((definition) => {
        removeAttributes(definition);
        definition.setAttribute('class', 'definition');

        kamusDiv.append(definition);
      })
    : (location.href = '/src/popup/popup.html');
}

function insertInnerHtml(html) {
  document.documentElement.innerHTML = html;
}

function createKamusDiv() {
  const div = document.createElement('div');
  div.setAttribute('id', 'kamus-div');
  document.body.append(div);

  return div;
}

function removeAttributes(element) {
  [...element.attributes].forEach((attribute) =>
    element.removeAttribute(attribute.name)
  );
}

function appendCss() {
  document.head.append(css);
}

function log(m) {
  console.log(m);
}

main();
