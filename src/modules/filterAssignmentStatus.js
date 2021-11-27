import { ASSIGNMENTS_URL } from '../utils/constants'

export default () => {
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
    if (unresolvedCourseTabs.length > 0 && window.location.href === ASSIGNMENTS_URL) {
      window.location.href = unresolvedCourseTabs[0].querySelector('a').href
      return
    }

    displayCourseTabs(unresolvedCourseTabs)

    if (unresolvedCourseTabs.length === 0) {
      document.querySelector('.main .my-3').remove()
      document.querySelector('.main .card').remove()
      const message = document.createElement('p')
      message.classList.add('h3')
      message.innerHTML = '作業全部都批改完囉'
      document.querySelector('.main').append(message)
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
