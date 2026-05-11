import VideoLabel from '../../components/VideoLabel'
import NavBtns from "../../components/NavBtns"

interface LabelToolProps {
  labelType: string
}

function LabelTool(props: LabelToolProps) {
  const { labelType } = props;
  window.onbeforeunload = (e) => {
    e.returnValue = "By updating or leaving this page, you will lose every reords un-saved or un-updated, are you sure?"
  }
  return (
    <>
      <VideoLabel labelType={labelType} />
      <NavBtns />
    </>
  )
}

export default LabelTool