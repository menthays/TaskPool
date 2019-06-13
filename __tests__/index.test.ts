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

  it('New Task', (done) => {
    const pool = new TaskPool();
    const cb = jest.fn()
    const result1 = pool.newTask('go', {dest: 'disney'}, cb, 1000)
    const result2 = pool.newTask('go', {dest: 'disney'}, cb, 1000)
    expect(result1).toBeTruthy()
    expect(result2).toBeFalsy()
    setTimeout(() => {
      expect(cb).toBeCalledWith({dest: 'disney'})
      done()
    }, 1500)
  })

  it('Finish Task', (done) => {
    const pool = new TaskPool();
    const cb = jest.fn()
    const cb2 = jest.fn()
    pool.newTask('go', {dest: 'disney'}, cb, 10000)
    pool.finishTask('go', cb2)
    setTimeout(() => {
      expect(cb).toBeCalledWith({dest: 'disney'})
      expect(cb2).toBeCalledWith({dest: 'disney'})
      done()
    }, 100)
  })

  it('Abort Task', (done) => {
    const pool = new TaskPool();
    const cb = jest.fn()
    const cb2 = jest.fn()
    pool.newTask('go', {dest: 'disney'}, cb, 100)
    pool.abortTask('go', cb2)
    setTimeout(() => {
      expect(cb).not.toBeCalled()
      expect(cb2).toBeCalledWith({dest: 'disney'})
      done()
    }, 500)
  })
})