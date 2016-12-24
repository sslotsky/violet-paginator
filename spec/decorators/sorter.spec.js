import { sorter } from '../../src/decorators'
import * as shared from './shared'

describe('flip()', () => {
  shared.decorate(sorter)
  shared.behavesLikeASorter()
})

