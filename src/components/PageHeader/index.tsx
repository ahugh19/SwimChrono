import { useState, type ReactNode } from 'react'
import { Tour, Typography } from 'antd'
import type { TourProps } from 'antd'
import Brand from '../Brand'
import HeaderActions from '../HeaderActions'
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
  // Optional guided tour, opened from the ? button. It never opens by itself.
  tour?: PageTourConfig
}

function markSeen(key: string) {
  try { window.localStorage.setItem(key, "1") } catch { /* ignore */ }
}

// Slim header for the secondary pages (label tools, result charts): brand,
// page navigation, then whatever the page needs in the same row.
function PageHeader({ title, children, extra, tour }: PageHeaderProps) {
  const [tourOpen, setTourOpen] = useState<boolean>(false)
  const [tourStep, setTourStep] = useState(0)

  const pagesStep: NonNullable<TourProps['steps']>[number] = {
    title: '🧭 Pages',
    description: 'This menu switches between the authoring tool, the three labelling tools and the result charts. Every page has it in the same place.',
    target: () => document.querySelector('[data-tour="pages"]') as HTMLElement,
  }

  return (
    <div className={styles.header}>
      <Brand size="compact" />
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
      <HeaderActions onHelpClick={tour ? () => { setTourStep(0); setTourOpen(true) } : undefined} />
      {tour && <>
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
