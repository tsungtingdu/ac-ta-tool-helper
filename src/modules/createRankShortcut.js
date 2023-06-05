import { getEditor, getNameLink, insertToEditor, injectToolbarStickyCSS } from '../utils/editorOperator'
import { RANKS } from '../utils/constants'

// flag for avoid adding EventListener twice in createRankShortcut
let isCreateRankShortcutCalled = false

export default () => {
  // 限制在 TA reviews 頁面使用此功能，submissions 結構不一樣
  if (!window.location.href.includes('ta_reviews/user_answers')) return
  if (isCreateRankShortcutCalled) return
  isCreateRankShortcutCalled = true

  injectToolbarStickyCSS()

  const body = document.querySelector('body')

  body.addEventListener('click', e => {
    const actionsBlocks = document.querySelectorAll('.editor-actions')
    actionsBlocks.forEach((actionsBlock, index) => {
      // 展開 reply input 且其中無 select 才插入選單
      if (actionsBlock !== null && e.target.className === 'reply' && !actionsBlock.querySelector('select')) {
        appendShortcutSelect(actionsBlock, `shortcut-select-${index}`)
      }
    })
  })

  body.addEventListener('change', e => {
    const { target: { id, value } } = e
    const rank = Object.keys(RANKS).find(rank => RANKS[rank].value === Number(value))

    if (rank) {
      const { name, value } = RANKS[rank]
      if (value !== RANKS.TAG_STUDENT.value) {
        const radios = document.querySelector('.radio').querySelectorAll('input')
        radios.forEach(radio => {
          if (+radio.value === value) {
            radio.checked = true
          } else {
            radio.checked = false
          }
        })
      }

      postMessage(name, getEditor(id))
    }
  })
}

function postMessage (message, editor) {
  const target = document.querySelector('.name')
  // tag 學生不用加上等第
  const element = message === 'Tag student' ? `${getNameLink(target)}` : `${message} ${getNameLink(target)}`
  insertToEditor(element, editor)
}

function appendShortcutSelect (appendDom, id) {
  const select = document.createElement('select')
  select.setAttribute('id', id)
  select.innerHTML = `
    <option value="">-- Quick insert --</option>
  `
  Object.keys(RANKS).forEach(rank => {
    const { name, value } = RANKS[rank]
    select.innerHTML += `<option value="${value}">${name}</option>`
  })
  appendDom.prepend(select)
}
