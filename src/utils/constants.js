const BASE_AC_URL_SUFFIX = 'lighthouse.alphacamp.co'
const BASE_AC_URL = `https://${BASE_AC_URL_SUFFIX}`

const BASE_AC_CANVAS_URL_SUFFIX = 'canvas.alphacamp.co'
const BASE_AC_CANVAS_URL = `https://${BASE_AC_CANVAS_URL_SUFFIX}`

const ROUTES = {
  ASSIGNMENTS: 'console/answer_lists',
  TA_WORK_TIME: 'console/contract_work_times',
  TA_INCOMES: 'console/ta_incomes'
}

const CANVAS_ROUTES = {
  SPEED_GRADER: 'gradebook/speed_grader'
}

const TA_WORK_TIME_URL = `${BASE_AC_URL}/${ROUTES.TA_WORK_TIME}`
const ASSIGNMENTS_URL = `${BASE_AC_URL}/${ROUTES.ASSIGNMENTS}`

const RANKS = {
  TRT_HARDER: {
    name: 'Try Harder',
    value: 3
  },
  MEET_EXPECTATIONS: {
    name: 'Meet expectations',
    value: 2
  },
  EXCEED_EXPECTATIONS: {
    name: 'Exceed expectations',
    value: 1
  },
  TAG_STUDENT: {
    name: 'Tag student',
    value: 0
  }
}

export {
  BASE_AC_URL_SUFFIX,
  BASE_AC_URL,
  BASE_AC_CANVAS_URL_SUFFIX,
  BASE_AC_CANVAS_URL,
  TA_WORK_TIME_URL,
  ASSIGNMENTS_URL,
  ROUTES,
  CANVAS_ROUTES,
  RANKS
}
