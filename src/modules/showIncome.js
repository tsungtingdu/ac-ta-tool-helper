// flag for avoid calling showIncome twice
let isShowIncomeCalled = false

export default () => {
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
