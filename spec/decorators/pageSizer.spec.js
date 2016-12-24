import { pageSizer } from '../../src/decorators'
import * as shared from './shared'

describe('flip()', () => {
  shared.decorate(pageSizer)
  shared.behavesLikeAPageSizer()
})

