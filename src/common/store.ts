export type WriterConfig = {
  writeTimeout?: number
  flushAfter?: number
}

export class BufferedUpdater {
  private _config: WriterConfig
  private _update: () => void
  private _timeout: NodeJS.Timeout | null
  private _accumulated = 0

  constructor(
    update: () => void,
    config: WriterConfig = {}
  ) {
    this._update = update
    this._timeout = null
    this._config = config
  }

  private _flush() {
    this._update()
    this._accumulated = 0
  }

  update() {
    if (this._timeout) {
      clearTimeout(this._timeout)
      this._accumulated++
    }
    if (this._accumulated >= (this._config.flushAfter ?? 10)) {
      this._flush()
      return
    }
    this._timeout = setTimeout(
      () => this._flush(),
      this._config.writeTimeout ?? 1000
    )
  }
}
