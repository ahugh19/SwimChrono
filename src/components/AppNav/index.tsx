import { Link, useLocation } from 'react-router-dom'
import { Button, Dropdown, Tooltip } from 'antd'
import type { MenuProps } from 'antd'
import { AppstoreOutlined, BuildOutlined, EditOutlined, HomeOutlined, ProjectOutlined, VideoCameraOutlined } from '@ant-design/icons'
import styles from './index.module.less'

export interface AppPage {
  path: string
  label: string
  short: string
  icon: React.ReactNode
}

// Single source of truth for the pages of the app and their order.
export const APP_PAGES: AppPage[] = [
  { path: '/', label: 'Authoring tool', short: 'Authoring', icon: <HomeOutlined /> },
  { path: '/label-vis', label: 'Visualization labeling', short: 'Vis labels', icon: <EditOutlined /> },
  { path: '/label-event', label: 'Event labeling', short: 'Event labels', icon: <ProjectOutlined /> },
  { path: '/label-camera', label: 'Camera-shot labeling', short: 'Camera labels', icon: <VideoCameraOutlined /> },
  { path: '/visualization', label: 'Labeling results', short: 'Results', icon: <BuildOutlined /> },
]

function normalize(pathname: string) {
  const p = pathname.replace(/\/+$/, '')
  return p === '' ? '/' : p
}

interface AppNavProps {
  // 'strip' renders one tab per page; 'menu' renders a single dropdown
  // button for headers that are short on space.
  mode?: 'strip' | 'menu'
}

// Page navigation shared by every page header (replaces the old floating
// buttons). Uses router links, so switching pages keeps the SPA state.
function AppNav({ mode = 'strip' }: AppNavProps) {
  const location = useLocation()
  const current = normalize(location.pathname)

  if (mode === 'menu') {
    const items: MenuProps['items'] = APP_PAGES.map((page) => ({
      key: page.path,
      icon: page.icon,
      label: <Link to={page.path}>{page.label}</Link>,
    }))
    const active = APP_PAGES.find((p) => p.path === current)
    return (
      <Dropdown menu={{ items, selectedKeys: [current] }} trigger={['click']} placement="bottomRight">
        <Tooltip title="Pages">
          <Button type="text" icon={<AppstoreOutlined />} aria-label="Pages">
            {active && active.path !== '/' ? active.short : null}
          </Button>
        </Tooltip>
      </Dropdown>
    )
  }

  return (
    <nav className={styles.strip} aria-label="Pages">
      {APP_PAGES.map((page) => {
        const isActive = page.path === current
        return (
          <Tooltip key={page.path} title={page.label}>
            <Link
              to={page.path}
              className={`${styles.tab} ${isActive ? styles.active : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={styles.icon}>{page.icon}</span>
              <span className={styles.text}>{page.short}</span>
            </Link>
          </Tooltip>
        )
      })}
    </nav>
  )
}

export default AppNav
