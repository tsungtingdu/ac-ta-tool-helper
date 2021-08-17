const BASE_AC_URL = 'https://lighthouse.alphacamp.co/'
const TA_WORK_TIME_URL = `${BASE_AC_URL}console/contract_work_times`

const items = [
  {
    id: 'submitWorkingTime',
    title: 'Submit time now',
    contexts: ['all'],
    documentUrlPatterns: [`${BASE_AC_URL}*`]
  },
  {
    id: 'showAccumulatedTime',
    title: 'Show accumulated TA working time',
    contexts: ['all'],
    documentUrlPatterns: [TA_WORK_TIME_URL]
  },
  {
    id: 'retrieveCachedInput',
    title: 'Retrieve cached input',
    contexts: ['all'],
    documentUrlPatterns: [`${BASE_AC_URL}*`]
  }
]

chrome.runtime.onInstalled.addListener(() => {
  items.forEach(item => chrome.contextMenus.create(item))

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.tabs.sendMessage(tabId, { target: 'cache' })
      chrome.tabs.sendMessage(tabId, { target: 'createRankShortcut' })
    }
  })
})

chrome.webNavigation.onCommitted.addListener(detail => {
  const { tabId } = detail
  chrome.tabs.sendMessage(tabId, { target: 'createSwitchUnresolvedButton' })
}, {
  url: [{ hostSuffix: 'lighthouse.alphacamp.co', pathContains: 'console/answer_lists' }]
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  switch (info.menuItemId) {
    case 'submitWorkingTime':
      submitWorkingTime()
      break
    case 'showAccumulatedTime':
      showAccumulatedTime()
      break
    case 'retrieveCachedInput':
      retrieveCachedInput()
      break
  }
})

function submitWorkingTime () {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    const currentUrl = tabs[0]?.url

    if (currentUrl === TA_WORK_TIME_URL) {
      return alert('You are in the right page now!')
    }

    return chrome.tabs.create({ url: TA_WORK_TIME_URL })
  })
}

function showAccumulatedTime () {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    const currentUrl = tabs[0]?.url

    if (currentUrl !== TA_WORK_TIME_URL) {
      return alert('Sorry, this feature is only avaiable in Lighthouse TA Tool 時數表 page')
    }

    return chrome.tabs.sendMessage(tabs[0].id, { target: 'showAccumulatedTime' })
  })
}

function retrieveCachedInput () {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    return chrome.tabs.sendMessage(tabs[0].id, { target: 'retrieveCachedInput' })
  })
}
