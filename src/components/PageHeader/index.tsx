import { useState, type ReactNode } from 'react'
import { Button, Tooltip, Tour, Typography } from 'antd'
import type { TourProps } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import Brand from '../Brand'
import AppNav from '../AppNav'
import styles from './index.module.less'

export interface PageTourConfig {
  // localStorage key remembering that the tour was closed once.
  storageKey: string
  steps: TourProps['steps']
}

interface PageHeaderProps {
  // Page name shown after the navigation.
  title?: string
  // Page-specific controls, laid out inline after the title.
  children?: ReactNode
  // Right-aligned content.
  extra?: ReactNode
  // Optional guided tour: opens on the first visit, and from the ? button.
  tour?: PageTourConfig
}

function readSeen(key: string) {
  try { return window.localStorage.getItem(key) === "1" } catch { return false }
}
function markSeen(key: string) {
  try { window.localStorage.setItem(key, "1") } catch { /* ignore */ }
}

// Slim header for the secondary pages (label tools, result charts): brand,
// page navigation, then whatever the page needs in the same row.
function PageHeader({ title, children, extra, tour }: PageHeaderProps) {
  const [tourOpen, setTourOpen] = useState<boolean>(() => (tour ? !readSeen(tour.storageKey) : false))
  const [tourStep, setTourStep] = useState(0)

  const pagesStep: NonNullable<TourProps['steps']>[number] = {
    title: '🧭 Pages',
    description: 'Switch between the authoring tool, the three labelling tools and the result charts here. The same menu sits in the top-right corner of the authoring page.',
    target: () => document.querySelector('[data-tour="pages"]') as HTMLElement,
  }

  return (
    <div className={styles.header}>
      <Brand size="compact" />
      <span data-tour="pages"><AppNav /></span>
      {title && <>
        <span className={styles.divider} />
        <Typography.Text strong className={styles.title}>{title}</Typography.Text>
      </>}
      {children && <>
        <span className={styles.divider} />
        {children}
      </>}
      <span className={styles.spacer} />
      {extra}
      {tour && <>
        <Tooltip title="Show the guided tour of this page">
          <Button type="text" size="small" icon={<QuestionCircleOutlined />} aria-label="Help tour" onClick={() => { setTourStep(0); setTourOpen(true) }} />
        </Tooltip>
        <Tour
          open={tourOpen}
          current={tourStep}
          onChange={setTourStep}
          onClose={() => { setTourOpen(false); markSeen(tour.storageKey) }}
          onFinish={() => { setTourOpen(false); setTourStep(0); markSeen(tour.storageKey) }}
          type="primary"
          steps={[pagesStep, ...(tour.steps ?? [])]}
          mask={{ color: '#1f5b7a5f' }}
          indicatorsRender={(current, total) => <span>{current + 1} / {total}</span>}
          gap={{ offset: 8, radius: 4 }}
        />
      </>}
    </div>
  )
}

export default PageHeader
