import { useEffect } from 'react'
import VideoLabel from '../../components/VideoLabel'
import NavBtns from "../../components/NavBtns"

interface LabelToolProps {
  labelType: string
}

function LabelTool(props: LabelToolProps) {
  const { labelType } = props;
  // Warn before a reload while labelling; removed again when navigating
  // back to the authoring page so it doesn't linger there.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = "By updating or leaving this page, you will lose every record not saved or updated. Are you sure?"
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [])
  return (
    <>
      <VideoLabel labelType={labelType} />
      <NavBtns />
    </>
  )
}

export default LabelTool