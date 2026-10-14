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
  const what: Record<string, string> = {
    vis: "embedded visualizations (what is shown, where, how it moves and animates)",
    event: "race events (start, turns, finish …) as intervals or points",
    camera: "camera shots and how they connect",
  }
  return (
    <>
      <PageHeader
        title={titles[labelType] ?? "Labelling"}
        tour={{
          storageKey: `swimchrono.tourSeen.label-${labelType}`,
          steps: [
            { title: '📺 Player & bbox', description: `This tool was used in the systematic review to label ${what[labelType] ?? "annotations"}. Switch "edit" on to draw a bounding box on the current frame (the player controls are disabled while editing).`, target: () => document.querySelector('[data-tour="label-player"]') as HTMLElement },
            { title: '⏱ Transport', description: 'Step through the video by seconds or single frames, and move to the previous / next URL of the review corpus.', target: () => document.querySelector('[data-tour="label-transport"]') as HTMLElement },
            { title: '🎬 Race segments', description: 'Register the race segment(s) of this URL: start / end moments and metadata, then select one in the table — annotations below belong to the selected segment.', target: () => document.querySelector('[data-tour="label-video"]') as HTMLElement },
            { title: '📝 Annotations', description: 'Add, edit and review the annotations of the selected segment. Rows with issues are flagged. This public demo has no backend, so changes are kept only for the session.', target: () => document.querySelector('[data-tour="label-list"]') as HTMLElement, placement: 'left' },
          ],
        }}
      />
      <VideoLabel labelType={labelType} />
    </>
  )
}

export default LabelTool