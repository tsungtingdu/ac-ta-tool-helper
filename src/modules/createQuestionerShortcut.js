import { getEditor, getNameLink, insertToEditor, injectToolbarStickyCSS } from '../utils/editorOperator'

let isCreateQuestionerShortcutCalled = false

export default () => {
  // 限制在單元頁面使用
  if (!window.location.href.includes('units')) return
  if (isCreateQuestionerShortcutCalled) return
  isCreateQuestionerShortcutCalled = true

  injectToolbarStickyCSS()

  const body = document.querySelector('body')

  body.addEventListener('click', e => {
    appendShortcutBtnInEditor(e)
    getAndPostQuestioner(e)
  })
}

function appendShortcutBtnInEditor (event) {
  const actionsBlocks = document.querySelectorAll('.editor-actions')
  actionsBlocks.forEach((actionsBlock, index) => {
    // 展開reply input且只有submit & cancel才插入選單
    if (actionsBlock !== null && event.target.className === 'reply' && actionsBlock.childElementCount === 2) {
      appendShortcutBtn(actionsBlock, `shortcut-btn-${index}`)
    }
  })
}

function getAndPostQuestioner (event) {
  const { target: { id } } = event
  // 找到所屬的ul parent
  const subject = event.target.closest('ul')
  if (id.includes('shortcut-btn')) postQuestioner(subject, getEditor(id))
}

function appendShortcutBtn (appendDom, id) {
  const btn = document.createElement('div')
  btn.classList = 'btn btn-primary'
  btn.setAttribute('id', id)
  btn.innerText = 'Tag questioner'
  appendDom.prepend(btn)
}

function postQuestioner (subject, editor) {
  const target = subject.getElementsByTagName('h3')[0].nextElementSibling.firstChild
  insertToEditor(getNameLink(target), editor)
}
