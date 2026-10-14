import { useEffect } from 'react'
import VideoLabel from '../../components/VideoLabel'
import PageHeader from '../../components/PageHeader'

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
  const titles: Record<string, string> = {
    vis: "Visualization labelling",
    event: "Event labelling",
    camera: "Camera-shot labelling",
  }
  return (
    <>
      <PageHeader title={titles[labelType] ?? "Labelling"} />
      <VideoLabel labelType={labelType} />
    </>
  )
}

export default LabelTool