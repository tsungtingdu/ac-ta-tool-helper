function getEditor (id) {
  // 從觸發的btn id往上找editor
  const editor = document.getElementById(id).closest('form').querySelector('.trix-editor')
  // 沒value時需要先create div
  if (editor.firstChild === null) {
    const div = document.createElement('div')
    editor.appendChild(div)
  }
  return editor
}

function getNameLink (target) {
  const id = target.firstChild.href.split('/').pop()
  const name = target.firstChild.innerText
  return `<a href="/users/${id}?m=1">@${name}</a>`
}

function insertToEditor (element, editor) {
  editor.firstChild.innerHTML += element
}

function injectToolbarStickyCSS () {
  const injectStyle = document.getElementById('helper-inject-css')
  if (!injectStyle) {
    const head = document.head || document.getElementsByTagName('head')[0]
    const style = document.createElement('style')
    style.id = 'helper-inject-css'
    style.textContent = `
      trix-toolbar {
        position: sticky;
        top: 65px;
        z-index: 4;
      }
    `
    head.appendChild(style)
  }
}

export { getEditor, getNameLink, insertToEditor, injectToolbarStickyCSS }
