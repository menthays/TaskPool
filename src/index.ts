export interface TaskPayload {
  [propName: string]: any
}

export interface Task {
  payload: TaskPayload
  ttl: number
  execution?: (payload: TaskPayload) => void
  _timer?: NodeJS.Timeout
}

export default class TaskPool {
  public ttl: number;
  private _pool: Map<string, Task>;

  constructor(ttl?: number) {
    this.ttl = ttl || 15*1000;
    this._pool = new Map()
  }

  get size() {
    return this._pool.size
  }

  set size(val) {
    throw new Error('Property `size` is immutable')
  }

  /**
   * add a new timer task to the pool
   * @param taskKey task id
   * @param taskPayload task payload to store some param
   * @param execution task to be executed
   * @param ttl task will be auto executed in <ttl> microseconds
   */
  public newTask(taskKey: string, taskPayload: TaskPayload, execution?: (payload: TaskPayload) => void, ttl=this.ttl): boolean {
    if (this._pool.has(taskKey)) {
      return false
    }

    const task = {
      payload: {...taskPayload},
      execution: execution,
      ttl,
      _timer: setTimeout(() => {
        execution && execution({...taskPayload})
      }, ttl)
    }
    this._pool.set(taskKey, task);
    return true
  }

  private _endTask(abort: boolean, taskKey: string, callback?: (taskPayload: TaskPayload) => void): boolean {
    if (this._pool.has(taskKey)) {
      return false
    }

    const task = this._pool.get(taskKey) as Task
    const {payload, _timer, execution} = task
    _timer && clearTimeout(_timer)
    if (!abort && callback) {
      callback(payload)
    }
    this._pool.delete(taskKey)
    return true
  }

  /**
   * Abort the timer task
   * @param taskKey task id
   * @param callback callback with payload
   */
  public abortTask(taskKey: string, callback?: (taskPayload: TaskPayload) => void): boolean {
    return this._endTask(true, taskKey, callback);
  }

  /**
   * Execute the timer task immediately
   * @param taskKey task id
   * @param callback callback with payload
   */
  public finishTask(taskKey: string, callback?: (taskPayload: TaskPayload) => void): boolean {
    return this._endTask(false, taskKey, callback)
  }
}