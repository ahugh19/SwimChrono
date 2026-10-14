import { Space, Typography } from 'antd'
import { GroupType, MOVEMENT_GROUPS, colorForGroup } from '../../ganttLayout'
import { placementOptionsStringList } from '../../../../utils/values'
import styles from './index.module.less'

interface LegendProps {
  groupType: GroupType
  presentKeys: Set<string> // only groups that occur in the shown data
}

// HTML legend for the gantt colours (one chip per group) plus the
// "dashed outline = moving" hint used in the placement view.
function Legend(props: LegendProps) {
  const { groupType, presentKeys } = props
  const order = groupType === 'movement' ? MOVEMENT_GROUPS : placementOptionsStringList
  const keys = [...order.filter((k) => presentKeys.has(k)), ...[...presentKeys].filter((k) => !order.includes(k))]
  return (
    <Space size={[10, 4]} wrap className={styles.legend}>
      {keys.map((key) => (
        <span key={key} className={styles.item}>
          <span className={styles.swatch} style={{ backgroundColor: colorForGroup(key, groupType) }} />
          <Typography.Text type="secondary" className={styles.label}>{key}</Typography.Text>
        </span>
      ))}
      {groupType === 'placement' && (
        <span className={styles.item}>
          <span className={`${styles.swatch} ${styles.moving}`} />
          <Typography.Text type="secondary" className={styles.label}>moving</Typography.Text>
        </span>
      )}
    </Space>
  )
}

export default Legend
