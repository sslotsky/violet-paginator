import expect from 'expect'

export default function expectAsync(promise) {
  let rejected = false
  promise.catch(() => {
    rejected = true
  })

  Promise.runAll()
  expect(rejected).toBe(false)
}
