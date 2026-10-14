import { message as staticMessage } from "antd"
import type { MessageInstance } from "antd/es/message/interface"

// antd's static `message` can't read the ConfigProvider theme, so it always
// renders light. `FeedbackBridge` (mounted inside <App>) registers the
// context-aware instance here; until then we fall back to the static API.
let instance: MessageInstance | null = null

export function registerMessageInstance(api: MessageInstance | null) {
  instance = api
}

type MessageMethod = "success" | "error" | "warning" | "info" | "loading"

function call(method: MessageMethod) {
  return (...args: Parameters<MessageInstance[MessageMethod]>) => {
    const target = instance ?? staticMessage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (target[method] as any)(...args)
  }
}

export const message = {
  success: call("success"),
  error: call("error"),
  warning: call("warning"),
  info: call("info"),
  loading: call("loading"),
}
