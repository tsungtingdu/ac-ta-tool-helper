function getEditor (id) {
  // 從觸發的btn id往上找editor
  const editor = document.getElementById(id).parentNode.parentNode.querySelector('.trix-editor')
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

export { getEditor, getNameLink, insertToEditor }
