# Updating Items

If you want to be able to edit your records from within the list view, we've got you covered. `paginate-this` exposes both synchronous and asynchronous actions that allow you to modify the properties of a list item. 


## Async Update

```javascript
updateAsync(id, data, update)
```

We intend for the `updateAsync` action to be your one-stop-shop for inline updates. This action executes the following operations:

1. Call `updateItem` to merge the properties from the `data` argument. This will normally be the same data you submit to the server, but can really be anything you want.
2. Call `updatingItem` to indicate that the item is waiting for an update from the server.
3. Call the `update` promise, provided as the last argument to `updateAsync`. 
4. If the `update` promise succeeds, call `updateItem` again using the resolved data.
5. If the `update` promise fails, use `resetItem` to revert the item to its previous state. Then rethrow the error for the caller to handle.

Example:

```javascript
import api from 'ROOT/api'
import { composables } from '@orange-marmalade/paginate-this'
import * as actionTypes from './actionTypes'

const pageActions = composables({ listId: 'recipes' })

export function toggleActive(recipe) {
  const data = {
    active: !recipe.active
  }

  return pageActions.updateAsync(
    recipe.id,
    data,
    api.recipes.update(data)
  )
}
```

Note that `paginate-this` will handle your promise failure if it occurs. If you want to handle that error yourself, just make sure you throw it along to us when you're done:

```javascript
export function toggleActive(recipe) {
  const data = {
    active: !recipe.active
  }

  const update = api.recipes.update(data).catch(err => {
    toastr.error('An error occured!')
    throw err
  })
  
  return pageActions.updateAsync(
    recipe.id,
    data,
    update
  )
}
```

We expect that `updateAsync` will cover most of your use cases,you may desire more fine grained control. To provide this, we expose every operation that `updateAsync` performs so that you can organize them anyway you want to.

## Instant Update

```javascript
updateItem(itemId, data)
```

Use the `updateItem` action if you want to update the values of a list item's properties. For example, assume you want an action creator that toggles the `active` state of a list item:

```javascript
import { composables } from '@orange-marmalade/paginate-this'

const pageActions = composables({ listId: 'recipes' })

export function toggleActive(recipe) {
  return pageActions.updateItem(
    recipe.id,
    { active: !recipe.active }
  )
}
```

## Indicate Updating State

In some cases you may want to indicate that an item within a list is waiting for an update from the server. Dispatching the `updatingItem` action will set the appropriate state, which can be checked with the `isUpdating` function.

### Setting the state

```javascript
import { composables } from '@orange-marmalade/paginate-this'

const pageActions = composables({ listId: 'recipes' })

export function updatingRecipe(recipe) {
  return pageActions.updatingItem(recipe.id)
}
```

### Checking the state

```javascript
import { isUpdating } from '@orange-marmalade/paginate-this'
import { connect } from 'react-redux'

export default connect(
  (state, ownProps) => ({
    updating: isUpdating(state, 'recipes', ownProps.params.id)
  })
)(Recipe)
```

## Resetting an Item

While `updateItem` will merge in all provided data, `resetItem` will actually overwrite the item with this data. This is actually used by `paginate-this` to revert items when promises fail for asynchronous updates. This is necessary because we update the item's data before calling the promise. If the promise fails, then, the item needs to snap back to its previous state. We achieve this by caching the current version of the item before calling the promise and feeding it to `resetItem` in the event of a failure. For an example, let's just look at how `paginate-this` implements `updateAsync`:

```javascript
  const updateAsync = (itemId, data, update) =>
    (dispatch, getState) => {
      const item = getPaginator(getState(), id).get('results')
        .find(r => r.get(identifier) === itemId)

      dispatch(basic.updateItem(itemId, data))
      dispatch(basic.updatingItem(itemId))
      return update.then(serverUpdate =>
        dispatch(basic.updateItem(itemId, serverUpdate))
      ).catch(err => {
        dispatch(basic.resetItem(itemId, item.toJS()))
        return dispatch(basic.itemError(itemId, err))
      })
    }
```

### Checking the state

To know whether or not an item is updating, use the `isUpdating` function in your selector:

```javascript
import { isUpdating } from '@orange-marmalade/paginate-this'

...

export default connect(
  state => ({ updating: isUpdating(state, 'myList', ownProps.recordId) })
)(MyTableRowComponent)
```

Note that the `DataRow` component and the `withRecordProps()` decorator with both give you this infomration for free.
[See here for more details](lean-update-table.md).
