import { useEffect } from 'react'
import VideoLabel from '../../components/VideoLabel'
import PageHeader from '../../components/PageHeader'

interface LabelToolProps {
  labelType: string
}

function LabelTool(props: LabelToolProps) {
  const { labelType } = props;
  // Warn before a reload while labeling; removed again when navigating
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
    vis: "Visualization labeling",
    event: "Event labeling",
    camera: "Camera-shot labeling",
  }
  const what: Record<string, string> = {
    vis: "the embedded visualizations: what is shown, where it sits, how it moves and animates",
    event: "the race events, such as the start, the turns and the finish, as intervals or points",
    camera: "the camera shots and how they connect",
  }
  return (
    <>
      <PageHeader
        title={titles[labelType] ?? "Labeling"}
        tour={{
          storageKey: `swimchrono.tourSeen.label-${labelType}`,
          steps: [
            { title: '📺 Player and bbox', description: `In the systematic review this tool was used to label ${what[labelType] ?? "annotations"}. Turn on "edit" to draw a bounding box on the current frame. The player controls are off while you edit.`, target: () => document.querySelector('[data-tour="label-player"]') as HTMLElement },
            { title: '⏱ Transport', description: 'Step through the video by seconds or by single frames. The url buttons move to the previous or the next video of the corpus.', target: () => document.querySelector('[data-tour="label-transport"]') as HTMLElement },
            { title: '🎬 Race segments', description: 'Register the race segments of this video with their start, end and metadata. Then select one in the table. The annotations on the right belong to the selected segment.', target: () => document.querySelector('[data-tour="label-video"]') as HTMLElement },
            { title: '📝 Annotations', description: 'Add, edit and review the annotations of the selected segment. Rows with problems are marked. This public demo has no backend, so changes last only for this session.', target: () => document.querySelector('[data-tour="label-list"]') as HTMLElement, placement: 'left' },
          ],
        }}
      />
      <VideoLabel labelType={labelType} />
    </>
  )
}

export default LabelTool