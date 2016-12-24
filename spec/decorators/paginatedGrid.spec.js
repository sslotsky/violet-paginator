import { paginatedGrid } from '../../src/decorators'
import * as shared from './shared'

describe('paginatedGrid()', () => {
  shared.decorate(paginatedGrid)
  shared.behavesLikeAPaginator()
  shared.behavesLikeADataGrid()
  shared.behavesLikeAPageSizer()
  shared.behavesLikeASorter()
})

