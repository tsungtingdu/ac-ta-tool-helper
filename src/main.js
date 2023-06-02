import filterAssignmentStatus from './modules/filterAssignmentStatus'
import { cache, retrieveCachedInput } from './modules/cacheInput'
import showAccumulatedWorkingTime from './modules/showAccumulatedWorkingTime'
import showIncome from './modules/showIncome'
import createRankShortcut from './modules/createRankShortcut'
import createQuestionerShortcut from './modules/createQuestionerShortcut'
import createSpeedGraderShortcut from './modules/createSpeedGraderShortcut'

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
    case 'createSpeedGraderShortcut':
      return createSpeedGraderShortcut()
  }
})
