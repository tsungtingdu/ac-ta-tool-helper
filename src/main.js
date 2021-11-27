import filterAssignmentStatus from './modules/filterAssignmentStatus'
import { cache, retrieveCachedInput } from './modules/cacheInput'
import showAccumulatedWorkingTime from './modules/showAccumulatedWorkingTime'

chrome.runtime.onMessage.addListener(message => {
  switch (message.target) {
    case 'cache':
      return cache()
    case 'retrieveCachedInput':
      return retrieveCachedInput()
    case 'createRankShortcut':
      return createRankShortcut()
    case 'filterAssignmentStatus':
      return filterAssignmentStatus()
    case 'showAccumulatedWorkingTime':
      return showAccumulatedWorkingTime()
    case 'showIncome':
      return showIncome()
    case 'createQuestionerShortcut':
      return createQuestionerShortcut()
  }
})

// for rank shortcut
const rankList = [
  'Try harder',
  'Meet expectations',
  'Exceed expectations',
  'Tag student'
]

// flag for avoid adding EventListener twice in createRankShortcut
let isCreateRankShortcutCalled = false
let isCreateQuestionerShortcutCalled = false

function createRankShortcut () {
  // 限制在TA reviews頁面使用此功能，submissions結構不一樣
  if (!window.location.href.includes('ta_reviews/user_answers')) return
  if (isCreateRankShortcutCalled) return

  const body = document.querySelector('body')
  isCreateRankShortcutCalled = true

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
    if (rankList.includes(value)) {
      postMessage(value, getEditor(id))
      handleScoreSelector(value)
    }
  })
}

function createQuestionerShortcut () {
  // 限制在單元頁面使用
  if (!window.location.href.includes('units')) return
  if (isCreateQuestionerShortcutCalled) return

  const body = document.querySelector('body')
  isCreateQuestionerShortcutCalled = true

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

function appendShortcutSelect (appendDom, id) {
  const select = document.createElement('select')
  select.innerHTML = `
    <option value="">-- Quick insert --</option>
  `
  rankList.forEach(rank => {
    select.innerHTML += `<option value="${rank}">${rank}</option>`
  })
  select.setAttribute('id', id)
  appendDom.prepend(select)
}

function appendShortcutBtn (appendDom, id) {
  const btn = document.createElement('div')
  btn.classList = 'btn btn-primary'
  btn.setAttribute('id', id)
  btn.innerText = 'Tag questioner'
  appendDom.prepend(btn)
}

function getEditor (id) {
  // 從觸發的btn id往上找editor
  const editor = document.getElementById(id).parentNode.previousElementSibling.childNodes[3]
  // 沒value時需要先create div
  if (editor.firstChild === null) {
    const div = document.createElement('div')
    editor.appendChild(div)
  }
  return editor
}

function postMessage (message, editor) {
  const target = document.querySelector('.name')
  // tag學生不用加上等第
  const element = message === 'Tag student' ? `${getNameLink(target)}` : `${message} ${getNameLink(target)}`
  insertToEditor(element, editor)
}

function postQuestioner (subject, editor) {
  const target = subject.getElementsByTagName('h3')[0].nextElementSibling.firstChild
  insertToEditor(getNameLink(target), editor)
}

function insertToEditor (element, editor) {
  editor.firstChild.innerHTML += element
}

function getNameLink (target) {
  const id = target.firstChild.href.split('/').pop()
  const name = target.firstChild.innerText
  return `<a href="/users/${id}?m=1">@${name}</a>`
}

function handleScoreSelector (value) {
  document.getElementById('answer_list_score').value = mapRankToScore(value)
}

function mapRankToScore (value) {
  switch (value) {
    case 'Try harder':
      return 3
    case 'Meet expectations':
      return 2
    case 'Exceed expectations':
      return 1
    case 'Tag student':
      return 2
    default:
      break
  }
}

// flag for avoid calling showIncome twice
let isShowIncomeCalled = false

function showIncome () {
  if (isShowIncomeCalled) return
  isShowIncomeCalled = true

  const table = document.querySelector('.table-responsive')
  const tbody = document.querySelector('tbody')

  const result = Array.from(tbody.children).reduce((acc, item, index) => {
    if (index === 0) return acc
    const text = Array.from(item.children)[3]
    return acc + Number(text.innerText.replace('$', ''))
  }, 0)

  const container = document.createElement('div')
  const message = `目前收入累計共 ${result.toLocaleString()}`
  container.innerText = message
  table.parentElement.insertBefore(container, table)
}
