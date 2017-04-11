export default function classNames(...names) {
  const classes = names

  const builder = {
    load: () => classes.join(' ')
  }

  builder.withConditional = (map) => {
    Object.keys(map).forEach((k) => {
      if (map[k] && !classes.includes(k)) {
        classes.push(k)
      }
    })

    return builder
  }

  return builder
}
