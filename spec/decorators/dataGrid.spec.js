import dataGrid from '../../src/decorators/dataGrid'
import * as shared from './shared'

describe('flip()', () => {
  shared.decorate(dataGrid)
  shared.behavesLikeADataGrid()
})

