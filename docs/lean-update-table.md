# Lean Update Tables

This section is for users who need to support inline updating in their paginated lists.
If that doesn't describe you, there is no need to read this!

For the rest of you, there are some new decorators that can help optimize performance if
your datatable performs inline updates. These will help you build components where only
the rows that are being updated will re-render.

## tabulateLean()

The `tabulateLean()` decorator is used for rendering results lists. This is like `tabulate()`,
except that only the record ids will be injected into the component, rather than the complete
record data. The ids can then be fed to a `DataRow` component or any component decorated with
the `withRecordProps()` decorator for the purpose of rendering each individual row. The purpose
of this is to achieve better performance; with this decorator, updating a single row will cause
a re-render only for that row. As of version 3, the `VioletDataTable` component now uses `tabulateLean()`
instead of `tabulate` so that you can use inline updating with optimal performance.

Injected Property | Description
---|:---
`pageActions`|A set of actions targeting the relevant list
`ids`|An array of ids corresponding to the records in the current page
`isLoading`|Indicates that the list is being fetched

## DataRow

If you are using `tabulateLean()`, a great way to render each row is to use the `DataRow` component.
You provide this component with the item id and the component that you want to use to render the row,
and `DataRow` will inject the state that your component needs to render.

Behind the scenes, `DataRow` uses the `withRecordProps()` decorator to inject state into your component,
and leverages context to determine the `listId`. It can therefore only be used within a component that is
decorated with decorators such as `tabulate()` or `tabulateLean()` that require a `listId` as a property.

### Required props

The `DataRow` component requires the following properties:

Property Name | Description
---|:---
`itemId`|The id of the record to be rendered
`component`|The component being used to render the row

### Injected props

Wrapping your component in a `DataRow` will provide it with the following properties:

Injected Property | Description
---|:---
`record`|The record corresponding to the provided id
`updating`|A bool indicating if the record is currently being updated
`removing`|A bool indicating if the record is currently being removed

## withRecordProps()

If you don't want to use the `DataRow` component, you can decorate a component using the `withRecordProps()`
decorator. This will inject the same properties as `DataRow`, but you will need to provide the `listId` yourself.
The `DataRow` component serves as a good example for how `withRecordProps()` should be used:

```javascript
import React, { PropTypes } from 'react'
import { withRecordProps } from '../decorators'

export default function DataRow({ component, ...rest }, context) {
  const Component = withRecordProps(component)

  return (
    <Component listId={context.listId} {...rest} />
  )
}

DataRow.propTypes = {
  component: PropTypes.func.isRequired
}

DataRow.contextTypes = {
  listId: PropTypes.string
}
```

### Required Props

Components decorated using `withRecordProps()` require the following properties:

Property Name | Description
---|:---
`listId`|The id of the paginated list
`itemId`|The id of the record to be rendered


### Injected Props

Using `withRecordProps()` will inject the following props into your decorated component:

Injected Property | Description
---|:---
`record`|The record corresponding to the provided id
`updating`|A bool indicating if the record is currently being updated
`removing`|A bool indicating if the record is currently being removed

These are the same properties injected by `DataRow`.
