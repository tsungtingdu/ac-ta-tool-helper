const calculateTime = () => {
  const results = []
  document.querySelectorAll('span').forEach(node => {
    if (node.innerText.includes('分鐘')) {
      results.push(node.innerText)
    }
  })
  const sum = results.reduce((acc, i) => acc + Number(i.split('分鐘')[0]), 0)
  alert(`目前累計 ${sum} 分鐘, 等於 ${Number(sum / 60).toFixed(2)} 小時`)
}

const findUnresolvedAssignments = () => {
  const container = document.querySelector('.scrollable .nav-pills')
  const items = document.querySelectorAll('.scrollable .nav-pills .nav-item')
  const getCounts = node => Number(node.childNodes[1].childNodes[1].innerText)

  const newItems = Array.from(items).sort((a, b) => getCounts(b) - getCounts(a))

  container.innerHTML = ''
  newItems.forEach(item => {
    if (getCounts(item) > 0) {
      const span = item.childNodes[1].childNodes[1]
      span.classList.remove('badge-light')
      span.classList.add('badge-danger')
    }
    container.appendChild(item)
  })
}

const initCache = () => {
  window.onload = cache()
}

const cache = () => {
  const body = document.querySelector('body')
  body.addEventListener('click', () => {
    const editors = document.querySelectorAll('.trix-editor')
    let cacheInput

    try {
      cacheInput = JSON.parse(localStorage.getItem('ac-ta-input-cache'))
    } catch {
      cacheInput = {}
    }

    if (!cacheInput) {
      cacheInput = {}
    }

    if (editors.length) {
      editors.forEach(editor => {
        editor.addEventListener('input', () => {
          cacheInput[editor.previousSibling.id] = JSON.stringify(editor.innerHTML)
          localStorage.setItem('ac-ta-input-cache', JSON.stringify(cacheInput))
        })
      })
    }
  })
}

const retrieveCachedInput = () => {
  const cacheInput = JSON.parse(localStorage.getItem('ac-ta-input-cache'))

  if (!cacheInput) {
    alert('There is no input cached')
  } else {
    const keys = Object.keys(cacheInput)
    const newWindow = window.open('', 'Title', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=500,height=500')

    newWindow.document.body.innerHTML = keys.sort().reduce((acc, key) => acc + `<div>${cacheInput[key]}</div><hr>`, '')
  }
}

chrome.runtime.onMessage.addListener(message => {
  switch (message.target) {
    case 'showAccumulatedTime':
      return calculateTime()
    case 'showUnresolvedAssignments':
      return findUnresolvedAssignments()
    case 'cache':
      return initCache()
    case 'retrieveCachedInput':
      return retrieveCachedInput()
    case 'createRankShortcut':
      return createRankShortcut()
  }
})

// for rank shortcut
const rankList = [
  'Try harder',
  'Meet expectations',
  'Exceed expectations',
  'Good',
  'Excellent'
]

function createRankShortcut () {
  // 限制在TA reviews頁面使用此功能，submissions結構不一樣
  if (!window.location.href.includes('ta_reviews/user_answers')) return
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
    if (rankList.includes(value)) {
      postMessage(id, value)
    }
  })
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

function postMessage (id, message) {
  // 從觸發的btn id往上找editor
  const editor = document.getElementById(id).parentNode.previousElementSibling.childNodes[3]
  // 沒value時需要先create div
  if (editor.firstChild === null) {
    const div = document.createElement('div')
    editor.appendChild(div)
  }
  editor.firstChild.innerHTML += `${message} ${getStudentLink()}`
}

function getStudentLink () {
  const nameDom = document.querySelector('.name')
  const id = nameDom.firstChild.href.split('/').pop()
  const name = nameDom.firstChild.innerText
  return `<a href="/users/${id}?m=1">@${name}</a>`
}
