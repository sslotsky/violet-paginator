import { tabulateLean } from '../../src/decorators'
import * as shared from './shared'

describe('tabulate()', () => {
  shared.decorate(tabulateLean)
  shared.behavesLikeALeanDataGrid()
})

