type Record = {
  context: string
  action: string
  result: string | null
}

export class LogService {
  public static log: Array<Record> = []

  public static write(record: Record) {
    LogService.log.push(record)
  }
}

export class LogAgent {
  context: string

  public constructor(context: string) {
    this.context = context
    LogService.write({context, action: "LOG AGENT CREATED", result: null})
  }

  public write(action: string, result: string | null) {
    LogService.write({context: this.context, action, result})
  }
}