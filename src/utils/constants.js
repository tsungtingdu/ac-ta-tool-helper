const BASE_AC_URL_SUFFIX = 'lighthouse.alphacamp.co'
const BASE_AC_URL = `https://${BASE_AC_URL_SUFFIX}`

const ROUTES = {
  ASSIGNMENTS: 'console/answer_lists',
  TA_WORK_TIME: 'console/contract_work_times',
  TA_INCOMES: 'console/ta_incomes'
}

const TA_WORK_TIME_URL = `${BASE_AC_URL}/${ROUTES.TA_WORK_TIME}`
const ASSIGNMENTS_URL = `${BASE_AC_URL}/${ROUTES.ASSIGNMENTS}`

export {
  BASE_AC_URL_SUFFIX,
  BASE_AC_URL,
  TA_WORK_TIME_URL,
  ASSIGNMENTS_URL,
  ROUTES
}
