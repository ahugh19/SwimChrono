import { Link } from 'react-router-dom'
import SwimChronoLogo from '/SwimChronoLogo.svg'
import { APP_VERSION } from '../../utils/version'
import styles from './index.module.less'

interface BrandProps {
  // 'full' shows the wordmark and version badge, 'compact' only the logo + name.
  size?: 'full' | 'compact'
}

// Logo + wordmark used in every page header. Links back to the authoring page.
function Brand({ size = 'full' }: BrandProps) {
  return (
    <span className={styles.wrap}>
      <Link className={styles.brand} to="/" title="SwimChrono — authoring page">
        <img className={styles.logoSvg} src={SwimChronoLogo} alt="" />
        <span className={`${styles.title} ${size === 'compact' ? styles.compact : ''}`}>
          SwimChr<span className={styles.highlight}>o</span>n<span className={styles.highlight}>o</span>
        </span>
      </Link>
      {size === 'full' && (
        <a
          className={styles.version}
          href="https://github.com/ahugh19/SwimChrono#changelog"
          target="_blank"
          rel="noreferrer"
          title={`SwimChrono version ${APP_VERSION} — open the changelog`}
        >v{APP_VERSION}</a>
      )}
    </span>
  )
}

export default Brand
