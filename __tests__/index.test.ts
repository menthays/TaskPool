import TaskPool from '../src'

describe('Basic Test', () => {
  it('Get size', () => {
    const pool = new TaskPool();
    pool.newTask('beep', {name: 'beep', args: 'eeee'})
    pool.newTask('boop', {name: 'boop', args: 'oooo'})
    expect(pool.size).toBe(2)
  })

  it('Set size', () => {
    const pool = new TaskPool();
    try {
      pool.size = 100
    } catch(err) {
      expect(err)
      return
    }
    throw new Error()
  })
})