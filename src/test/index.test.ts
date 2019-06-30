const assert = require('assert')
const uni = require('uni')

describe('test/index.test.ts', () => {
  it('should expose properties', () => {
    assert.deepEqual(Object.keys(uni).sort(), ['Application', 'BaseContextClass', 'Boot', 'Controller', 'Service'])
  })
})
