import { paginateThis } from '../../src/decorators'
import * as shared from './shared'

describe('violetPaginator()', () => {
  shared.decorate(paginateThis)
  shared.behavesLikeAPaginator()
  shared.behavesLikeADataGrid()
  shared.behavesLikeAPageSizer()
  shared.behavesLikeASorter()
})

