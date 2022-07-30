export type WriterConfig = {
  writeTimeout?: number
}

export class BufferedUpdater {
  private _config: WriterConfig
  private _update: () => void
  private _timeout: NodeJS.Timeout | null

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
  }

  update() {
    if (this._timeout) {
      clearTimeout(this._timeout)
    }
    this._timeout = setTimeout(
      () => this._flush(),
      this._config.writeTimeout ?? 600
    )
  }
}
