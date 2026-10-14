import type { ReactNode } from 'react'
import { Typography } from 'antd'
import Brand from '../Brand'
import AppNav from '../AppNav'
import styles from './index.module.less'

interface PageHeaderProps {
  // Page name shown after the navigation.
  title?: string
  // Page-specific controls, laid out inline after the title.
  children?: ReactNode
  // Right-aligned content.
  extra?: ReactNode
}

// Slim header for the secondary pages (label tools, result charts): brand,
// page navigation, then whatever the page needs in the same row.
function PageHeader({ title, children, extra }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <Brand size="compact" />
      <AppNav />
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
    </div>
  )
}

export default PageHeader
