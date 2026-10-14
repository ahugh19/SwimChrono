import { useState, type ReactNode, type RefObject } from 'react'
import { Button, Modal, Tooltip } from 'antd'
import { GithubOutlined, InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import AppNav from '../AppNav'
import AboutModal from '../Header/AboutModal'
import styles from './index.module.less'

interface HeaderActionsProps {
  // Rendered before the common buttons (e.g. the theme toggle on the authoring page).
  leading?: ReactNode
  // Shows the ? button when given.
  onHelpClick?: () => void
  // Refs for tour targets.
  pagesRef?: RefObject<HTMLSpanElement>
  helpRef?: RefObject<HTMLButtonElement>
}

// Right-hand button group shared by every page header: Pages menu, GitHub,
// About (with the paper reference) and the help tour.
function HeaderActions({ leading, onHelpClick, pagesRef, helpRef }: HeaderActionsProps) {
  const [aboutOpen, setAboutOpen] = useState(false)
  return (
    <div className={styles.actions}>
      {leading}
      <span ref={pagesRef} data-tour="pages"><AppNav mode="menu" /></span>
      <Tooltip title="Source code on GitHub">
        <Button
          type="text"
          aria-label="Source code on GitHub"
          icon={<GithubOutlined />}
          href="https://github.com/ahugh19/SwimChrono"
          target="_blank"
          rel="noreferrer"
        />
      </Tooltip>
      <Button type="text" icon={<InfoCircleOutlined />} onClick={() => setAboutOpen(true)}>About</Button>
      {onHelpClick && (
        <Tooltip title="Help tour">
          <Button ref={helpRef} type="text" icon={<QuestionCircleOutlined />} aria-label="Help tour" onClick={onHelpClick} />
        </Tooltip>
      )}
      <Modal title="About SwimChrono" open={aboutOpen} onOk={() => setAboutOpen(false)} onCancel={() => setAboutOpen(false)} footer={null}>
        <AboutModal />
      </Modal>
    </div>
  )
}

export default HeaderActions
