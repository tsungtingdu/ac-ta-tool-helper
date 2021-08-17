const ASSIGNMENTS_URL = 'https://lighthouse.alphacamp.co/console/answer_lists'

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
    case 'cache':
      return initCache()
    case 'retrieveCachedInput':
      return retrieveCachedInput()
    case 'createRankShortcut':
      return createRankShortcut()
    case 'createSwitchUnresolvedButton':
      return createSwitchUnresolvedButton()
  }
})

function createSwitchUnresolvedButton () {
  const titleElement = document.querySelector('.main > H1')
  const headerElement = document.createElement('div')

  titleElement.remove()
  headerElement.classList.add('pb-2', 'mb-4', 'border-bottom', 'd-flex', 'align-items-end')
  headerElement.innerHTML = `
    <h1 class="m-0 pr-4">${titleElement.innerHTML}</h1>
    <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input" id="switchBtn">
      <label class="custom-control-label" for="switchBtn">僅顯示尚未批改的合作項目</label>
    </div>
  `

  document.querySelector('.main').prepend(headerElement)

  const switchButtonElement = headerElement.querySelector('#switchBtn')
  const courseTabs = Array.from(document.querySelectorAll('.main .scrollable .nav-pills .nav-item'))
  const unresolvedCourseTabs = courseTabs.filter(courseTab => Number(courseTab.querySelector('.badge').innerHTML) !== 0)

  const remainUnresolvedCourseTabs = () => {
    displayCourseTabs(unresolvedCourseTabs)

    if (unresolvedCourseTabs.length === 0) {
      document.querySelector('.main .my-3').remove()
      document.querySelector('.main .card').remove()
      const message = document.createElement('p')
      message.classList.add('h3')
      message.innerHTML = '作業全部都批改完囉'
      document.querySelector('.main').append(message)
      return
    }

    if (unresolvedCourseTabs.length > 0 && window.location.href === ASSIGNMENTS_URL) {
      window.location.href = unresolvedCourseTabs[0].querySelector('a').href
    }
  }
  const displayCourseTabs = tabs => {
    const courseTabsContainer = document.querySelector('.scrollable .nav-pills')
    courseTabsContainer.innerHTML = ''
    tabs.forEach(tab => courseTabsContainer.append(tab))
  }

  chrome.storage.sync.get(['isOnlyDisplayUnresolvedCourseTabs'], result => {
    if (Object.prototype.hasOwnProperty.call(result, 'isOnlyDisplayUnresolvedCourseTabs')) {
      const retrievedResult = result.isOnlyDisplayUnresolvedCourseTabs
      switchButtonElement.checked = retrievedResult
      if (retrievedResult) {
        remainUnresolvedCourseTabs()
      } else {
        displayCourseTabs(courseTabs)
      }
    } else {
      switchButtonElement.checked = chrome.storage.sync.set({ isOnlyDisplayUnresolvedCourseTabs: false })
    }
  })

  switchButtonElement.addEventListener('change', e => {
    const isOnlyDisplayUnresolvedCourseTabs = e.target.checked
    chrome.storage.sync.set({ isOnlyDisplayUnresolvedCourseTabs })
    if (isOnlyDisplayUnresolvedCourseTabs) {
      remainUnresolvedCourseTabs()
    } else {
      if (unresolvedCourseTabs.length === 0) {
        return window.location.reload()
      }
      displayCourseTabs(courseTabs)
    }
  })
}

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
