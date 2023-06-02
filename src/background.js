import {
  BASE_AC_URL_SUFFIX,
  BASE_AC_URL,
  BASE_AC_CANVAS_URL_SUFFIX,
  TA_WORK_TIME_URL,
  ROUTES,
  CANVAS_ROUTES
} from './utils/constants'

const items = [
  {
    id: 'submitWorkingTime',
    title: 'Submit time now',
    contexts: ['all'],
    documentUrlPatterns: [`${BASE_AC_URL}/*`]
  },
  {
    id: 'retrieveCachedInput',
    title: 'Retrieve cached input',
    contexts: ['all'],
    documentUrlPatterns: [`${BASE_AC_URL}/*`]
  }
]

chrome.runtime.onInstalled.addListener(() => {
  items.forEach(item => chrome.contextMenus.create(item))
})

chrome.webNavigation.onCompleted.addListener(({ tabId }) => {
  chrome.tabs.sendMessage(tabId, { target: 'createRankShortcut' })
}, {
  url: [{ hostSuffix: BASE_AC_URL_SUFFIX, pathContains: 'ta_reviews' }]
})

chrome.webNavigation.onCompleted.addListener(({ tabId }) => {
  chrome.tabs.sendMessage(tabId, { target: 'createQuestionerShortcut' })
}, {
  url: [{ hostSuffix: BASE_AC_URL_SUFFIX, pathContains: 'units' }]
})

chrome.webNavigation.onCompleted.addListener(({ tabId }) => {
  chrome.tabs.sendMessage(tabId, { target: 'cache' })
}, {
  url: [{ hostSuffix: BASE_AC_URL_SUFFIX }]
})

chrome.webNavigation.onCompleted.addListener(({ tabId }) => {
  chrome.tabs.sendMessage(tabId, { target: 'filterAssignmentStatus' })
}, {
  url: [{ hostSuffix: BASE_AC_URL_SUFFIX, pathContains: ROUTES.ASSIGNMENTS }]
})

chrome.webNavigation.onCompleted.addListener(({ tabId }) => {
  chrome.tabs.sendMessage(tabId, { target: 'showAccumulatedWorkingTime' })
}, {
  url: [{ hostSuffix: BASE_AC_URL_SUFFIX, pathContains: ROUTES.TA_WORK_TIME }]
})

chrome.webNavigation.onCompleted.addListener(({ tabId }) => {
  chrome.tabs.sendMessage(tabId, { target: 'showIncome' })
}, {
  url: [{ hostSuffix: BASE_AC_URL_SUFFIX, pathContains: ROUTES.TA_INCOMES }]
})

chrome.webNavigation.onCompleted.addListener(({ tabId }) => {
  chrome.tabs.sendMessage(tabId, { target: 'createSpeedGraderShortcut' })
}, {
  url: [{ hostSuffix: BASE_AC_CANVAS_URL_SUFFIX, pathContains: CANVAS_ROUTES.SPEED_GRADER }]
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  switch (info.menuItemId) {
    case 'submitWorkingTime':
      submitWorkingTime()
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

function retrieveCachedInput () {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    return chrome.tabs.sendMessage(tabs[0].id, { target: 'retrieveCachedInput' })
  })
}
