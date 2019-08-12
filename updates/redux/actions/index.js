import Jyanken from '../models/Jyanken'

export const JYANKEN_PON = 'JYANKEN_PON'

export const jyankenPon = (human) => ({
  type: JYANKEN_PON,
  computer: Jyanken.random_hand(),
  human
})
