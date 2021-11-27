const calculateTime = () => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      const results = []
      document.querySelectorAll('span').forEach(node => {
        if (node.innerText.includes('分鐘')) {
          results.push(node.innerText)
        }
      })
      const result = results.reduce((acc, i) => acc + Number(i.split('分鐘')[0]), 0)
      resolve(result)
    }, 500)
  })
}

const displayTime = async () => {
  const time = await calculateTime()
  const target = document.querySelector('.accumulated-time')
  const message = `目前累計 ${time} 分鐘 (等於 ${Number(time / 60).toFixed(2)} 小時)`

  if (!target) {
    const contractWorkTimes = document.querySelector('.contract-work-times')
    const container = document.createElement('div')
    container.classList.add('accumulated-time')
    container.innerText = message
    container.style.cssText = 'margin-bottom: 20px'
    contractWorkTimes.parentElement.insertBefore(container, contractWorkTimes)
  } else {
    target.innerText = message
  }
}

// flag for avoid adding EventListener twice in showAccumulatedWorkingTime
let isShowAccumulatedWorkingTimeCalled = false

export default () => {
  if (isShowAccumulatedWorkingTimeCalled) return
  isShowAccumulatedWorkingTimeCalled = true

  displayTime()

  const body = document.querySelector('body')
  body.addEventListener('click', ({ target }) => {
    if (target.classList.contains('btn')) {
      displayTime()
    }
  })
}
