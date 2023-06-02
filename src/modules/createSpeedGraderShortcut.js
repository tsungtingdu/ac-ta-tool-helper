import { RANKS } from '../utils/constants'

// flag for avoid adding EventListener twice in createRankShortcut
let isCreateRankShortcutCalled = false

export default () => {
  if (isCreateRankShortcutCalled) return
  isCreateRankShortcutCalled = true

  const body = document.querySelector('body')
  const insertElement = document.querySelector('#speed_grader_comment_textarea_mount_point')

  insertShortcutSelector(insertElement, 'canvas-rank-shortcut')

  body.addEventListener('change', e => {
    const { target: { value, id } } = e
    if (id === 'canvas-rank-shortcut' && value) {
      const rank = Object.keys(RANKS).find(rank => RANKS[rank].value === Number(value))

      if (rank) {
        const { name } = RANKS[rank]
        postMessage(name, getStudentName())
      }
    }
  })
}

function insertShortcutSelector (appendDom, id) {
  const select = document.createElement('select')
  select.setAttribute('id', id)
  select.innerHTML = `
    <option value="">-- Quick insert --</option>
  `
  select.style.marginTop = '10px'
  select.style.width = '100%'

  Object.keys(RANKS).forEach(rank => {
    const { name, value } = RANKS[rank]
    select.innerHTML += `<option value="${value}">${name}</option>`
  })
  appendDom.append(select)
}

function postMessage (message, studentName) {
  const insertText = message === 'Tag student' ? `@${studentName}\n` : `${message} @${studentName}\n`
  insertToTextArea(insertText)
}

function getStudentName () {
  const studentNameBlock = document.querySelector('.ui-selectmenu-status > .ui-selectmenu-item-header')
  return studentNameBlock?.innerText || ''
}

function insertToTextArea (text) {
  const textArea = document.querySelector('#speed_grader_comment_textarea')
  if (textArea) {
    textArea.value += text
  }
}
