const SECONDS = 1000
const HOUR = 1000 * 60 * 60

/**
 * 主要用于过期监听的场景
 */
class DelayQueue {
  constructor(options) {
    this.options = options
    this.queue = options.queue
    this.handler = options.handler
    this.redis = options.redis
    // 一次返回的消息个数
    this.limit = options.limit || 10

    this.pollTimer = null
    this.defaultPollInterval = 10 * SECONDS
    this.maxPollInterval = 1 * HOUR
    this.pollInterval = this.defaultPollInterval

    this.poll()
  }

  // score为缓存时间，秒为单位，实际存入的是过期时间
  async add(data, score) {
    const expire = /^\d{13}$/.test(score) ? score : Date.now() + score * 1000
    await this.redis.zadd(this.queue, expire, JSON.stringify(data))

    // 空闲时间过长后，再添加任务
    if (this.pollInterval > this.defaultPollInterval) {
      this.resetPoll()
    }
  }

  resetPoll() {
    clearTimeout(this.pollTimer)

    this.pollInterval = this.defaultPollInterval
    this.pollTimer = setTimeout(() => {
      this.poll()
    }, this.pollInterval)
  }

  async read() {
    const members = await this.redis.zrangebyscore(this.queue, 0, Date.now(), 'WITHSCORES', 'LIMIT', 0, this.limit)
    return this.normalizeMembers(members)
  }

  async poll() {
    const members = await this.read()

    if (!members.length) {
      this.pollTimer = setTimeout(() => {
        this.poll()
      }, this.pollInterval)

      if (this.pollInterval < this.maxPollInterval) {
        this.pollInterval += this.defaultPollInterval
      }
      return
    }

    // 可能空闲时间过长后突然有任务过期
    this.pollInterval = this.defaultPollInterval

    // 删除消息
    await this.redis.zremrangebyscore(this.queue, 0, members[members.length - 1].score)

    for (let i = 0; i < members.length; i++) {
      const member = members[i]
      try {
        await this.handler(member)
      } catch(err) {
        // 消息处理失败重新放回队列
        await this.add(member.data, member.score)
      }
    }

    this.poll()
  }

  normalizeMembers(data) {
    const ret = []

    for (let i = 0; i < data.length; i += 2) {
      const member = data[i]
      const score = data[i + 1]
      ret.push({
        data: JSON.parse(member),
        score: parseInt(score)
      })
    }

    return ret
  }
}

module.exports = DelayQueue
