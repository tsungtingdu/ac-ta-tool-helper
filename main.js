const calculateTime = () => {
  let results = []
  document.querySelectorAll('span').forEach(node => {
    if (node.innerText.includes('分鐘')) {
      results.push(node.innerText)
    }
  })
  const sum = results.reduce((acc, i) => acc += Number(i.split('分鐘')[0]), 0)
  alert(`目前累計 ${sum} 分鐘, 等於 ${Number(sum/60).toFixed(2)} 小時`)
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

chrome.runtime.onMessage.addListener(message => {
  switch (message.target) {
    case "showAccumulatedTime":
      return calculateTime()
    case "showUnresolvedAssignments":
      return findUnresolvedAssignments()
    default:
      return
  }
})
