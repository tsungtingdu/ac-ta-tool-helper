import { getEditor, getNameLink, insertToEditor } from '../utils/editorOperator'

const RANKS = {
  TRT_HARDER: {
    name: 'Try Harder',
    value: 3
  },
  MEET_EXPECTATIONS: {
    name: 'Meet expectations',
    value: 2
  },
  EXCEED_EXPECTATIONS: {
    name: 'Exceed expectations',
    value: 1
  },
  TAG_STUDENT: {
    name: 'Tag student',
    value: 0
  }
}

// flag for avoid adding EventListener twice in createRankShortcut
let isCreateRankShortcutCalled = false

export default () => {
  // 限制在TA reviews頁面使用此功能，submissions結構不一樣
  if (!window.location.href.includes('ta_reviews/user_answers')) return
  if (isCreateRankShortcutCalled) return
  isCreateRankShortcutCalled = true

  const body = document.querySelector('body')

  body.addEventListener('click', e => {
    const actionsBlocks = document.querySelectorAll('.editor-actions')
    actionsBlocks.forEach((actionsBlock, index) => {
      // 展開reply input且只有submit & cancel才插入選單
      if (actionsBlock !== null && e.target.className === 'reply' && actionsBlock.childElementCount === 2) {
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
        document.getElementById('answer_list_score').value = value
      }

      postMessage(name, getEditor(id))
    }
  })
}

function postMessage (message, editor) {
  const target = document.querySelector('.name')
  // tag學生不用加上等第
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
