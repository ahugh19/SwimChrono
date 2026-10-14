import { useEffect } from "react"
import { App } from "antd"
import { registerMessageInstance } from "./feedback"

// Mount once inside antd's <App> to expose its themed message API to
// non-component code (the MobX store, helpers).
export function FeedbackBridge() {
  const { message } = App.useApp()
  useEffect(() => {
    registerMessageInstance(message)
    return () => registerMessageInstance(null)
  }, [message])
  return null
}
