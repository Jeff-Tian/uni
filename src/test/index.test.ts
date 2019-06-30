const assert = require('assert')
import * as uni from '../index'

describe('test/index.test.ts', () => {
  it('should expose properties', () => {
    assert.deepEqual(Object.keys(uni).sort(), ['Application', 'BaseContextClass', 'Boot', 'Controller', 'Service'])
  })
})
