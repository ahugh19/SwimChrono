import { useState, useEffect } from 'react'
import { inject, observer } from "mobx-react";
import { Button, Space, Popover, Table, Tag, Badge, Tooltip, ConfigProvider } from 'antd'
import { StarTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { dataOptionsStringList, visTypeOptions, movementOptions, placementOptionsStringList, uiHighlightStar } from '../../../../utils/values';
import '../../../../App.css'
import { IComponentPropsWithStore, Store } from "../../../../store";
import type { ColumnsType } from 'antd/es/table'
import { VideoType, VisType } from '../../../../types';
import styles from "./index.module.less";


interface VisTableProps extends IComponentPropsWithStore {
  currentTime: number,
  currentVideo: VideoType | null,
  canvasEl: React.RefObject<HTMLCanvasElement>,
  visList: VisType[],
}

function VisTable(props: VisTableProps) {
  const store = props.store as Store
  const { currentTime, currentVideo, canvasEl, visList } = props
  const [selectedVis, setSelectedVis] = useState<VisType | null>(null)
  const [tablePageSize, setTablePageSize] = useState<number>(100)
  const [tablePage, setTablePage] = useState<number>(1)


  // rowSelection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys: selectedVis ? [selectedVis.key] : [],
    onChange: (selectedRowKeys: React.Key[], selectedRows: VisType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedVis(selectedRows[0])
    },
  };


  function selectTableRow(record: VisType) {
    if (store.checkIsKeyExist(record, store.visList)) {
      setSelectedVis(record)
    }
  };

  function goToStart(record: VisType) {
    if (store.checkIsKeyExist(record, store.visList)) {
      store.setVideoPlayerSeekTime(record.startMoment)
    }
  }

  function goToEnd(record: VisType) {
    if (store.checkIsKeyExist(record, store.visList)) {
      if (record.endMoment > 0) {
        store.setVideoPlayerSeekTime(record.endMoment)
      }
    }
  }

  function showBbox(v: VisType) {
    if (!canvasEl.current) return
    const ctx = canvasEl.current.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, 640, 360)
      ctx.beginPath();
      // ctx.rect(v.visBbox.x1 / 2, v.visBbox.y1 / 2, (v.visBbox.x2 - v.visBbox.x1) / 2, (v.visBbox.y2 - v.visBbox.y1) / 2);
      ctx.rect((v.visBbox.x1) / 2, (v.visBbox.y1 - 4) / 2, (v.visBbox.x2 - v.visBbox.x1 - 4) / 2, (v.visBbox.y2 - v.visBbox.y1 - 4) / 2);
      ctx.strokeStyle = "orange";
      ctx.stroke();
    }
  }

  const columns: ColumnsType<VisType> = [
    {
      title: 'Play',
      dataIndex: 'key',
      key: 'no',
      fixed: 'left',
      width: 50,
      ellipsis: false,
      render: (value, record, index) =>
        <Space>
          {
            record.startMoment < currentTime && record.endMoment > currentTime
              ?
              <>
                <Badge status="processing" />
                {/* {(tablePage - 1) * tablePageSize + index + 1} */}
              </>
              :
              <>
                {/* <Badge status="default" /> */}
                {/* {(tablePage - 1) * tablePageSize + index + 1} */}
              </>
          }
        </Space>
    },
    {
      title: 'Start',
      dataIndex: 'startMoment',
      key: 'startMoment',
      width: 100,
      ellipsis: false,
      render(value, record, index) {
        return <div title={`${record.startMoment}`}>{record.startMoment.toFixed(4)}</div>
      },
      defaultSortOrder: 'ascend',
      sortDirections: ['ascend', 'descend'],
      sorter: (a, b) => a.startMoment - b.startMoment,
    },
    {
      title: 'End',
      dataIndex: 'endMoment',
      key: 'endMoment',
      width: 100,
      ellipsis: false,
      render(value, record, index) {
        return <div style={{ color: `${record.endMoment <= record.startMoment ? "red" : "inherit"}` }} title={`${record.endMoment === record.startMoment ? "same as start, needs update" : `${record.endMoment}`}`}>{record.endMoment.toFixed(4)}</div>
      },
      sorter: (a, b) => a.endMoment - b.endMoment,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      ellipsis: false,
      render(value, record, index) {
        return <div style={{ color: `${!record.duration || record.duration === -1 ? "red" : "inherit"}` }}>{record.duration ? record.duration.toFixed(4) : -1}</div>
      },
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: <Tooltip title="A star means it's a highlighted case.">Notes <InfoCircleOutlined /></Tooltip>,
      dataIndex: 'note',
      key: 'note',
      // fixed: 'left',
      width: 100,
      ellipsis: false,
      render: (value, record, index) => record.note
        ?
        <Popover
          style={{ width: 300 }}
          content={record.note}
          trigger="hover"
        >{record.highlight === "true"
          ?
          <Badge offset={[-10, 0]} count={<StarTwoTone twoToneColor={uiHighlightStar} />}>
            <Tag color="blue">
              note
            </Tag>
          </Badge>
          :
          <Tag color="blue">
            note
          </Tag>
          }</Popover>
        : <>
          {
            record.highlight === "true"
              ?
              <Badge offset={[-10, 0]} count={<StarTwoTone twoToneColor={uiHighlightStar} />}>
                <Tag color="default">
                  ----
                </Tag>
              </Badge>
              :
              <Tag color="default">
                ----
              </Tag>
          }
        </>,
      filters: [
        {
          text: "note",
          value: true,
        },
        {
          text: "----",
          value: false,
        },
      ],
      onFilter: (value: any, record) => {
        // cancelSelection()
        return record.note !== ""
      },
    },
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      width: 260,
      ellipsis: true,
      render(value, record, index) {
        return <Space size="small" wrap>
          {record.data?.map((v, i) => {
            return <Tag key={`tag-data-${record.key}-${i}`}>{v}</Tag>
          })}
        </Space>
      },
      filters: dataOptionsStringList.map((dos) => { return { text: dos, value: dos } }),
      onFilter: (value: any, record) => {
        // cancelSelection()
        return record.data.indexOf(value) !== -1
      },
    },
    {
      title: 'Vis Type',
      dataIndex: 'visType',
      key: 'visType',
      width: 150,
      // render: text => <a>{text}</a>,
      ellipsis: true,
      render(value, record, index) {
        return <Space size="small" wrap>
          {record.visType?.map((v, i) => {
            return <Tag key={`tag-vistype-${record.key}-${i}`}>{v}</Tag>
          })}
        </Space>
      },
      filters: visTypeOptions.map((vto) => { return { text: vto, value: vto } }),
      onFilter: (value: any, record) => {
        // cancelSelection()
        return record.visType.indexOf(value) !== -1
      },
    },
    {
      title: 'Bbox',
      dataIndex: 'visBbox',
      key: 'visBbox',
      width: 100,
      ellipsis: false,
      render(value, record, index) {
        return <Space size="small" wrap>
          <Tag>{`(${record.visBbox.x1},${record.visBbox.y1})`}</Tag>
          <Tag>{`(${record.visBbox.x2},${record.visBbox.y2})`}</Tag>
        </Space>
      },
    },
    {
      title: 'Morph',
      dataIndex: 'morph',
      key: 'morph',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'Entering',
      dataIndex: 'enteringAnimation',
      key: 'enteringAnimation',
      width: 100,
      ellipsis: false,
    },
    {
      title: 'Updating',
      dataIndex: 'updatingAnimation',
      key: 'updatingAnimation',
      width: 200,
      ellipsis: false,
      render(value, record, index) {
        return <Space size="small" wrap>
          {record.updatingAnimation?.map((v, i) => {
            return <Tag key={`tag-updating-${record.key}-${i}`}>{v}</Tag>
          })}
        </Space>
      },
    },
    {
      title: 'Leaving',
      dataIndex: 'leavingAnimation',
      key: 'leavingAnimation',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'Movement',
      dataIndex: 'movement',
      key: 'movement',
      width: 100,
      ellipsis: true,
      filters: movementOptions.map((mo) => { return { text: mo, value: mo } }),
      onFilter: (value: any, record) => {
        // cancelSelection()
        return record.movement === value
      },
    },
    {
      title: 'Placement',
      dataIndex: 'placement',
      key: 'placement',
      width: 120,
      ellipsis: false,
      filters: placementOptionsStringList.map((pos) => { return { text: pos, value: pos } }),
      onFilter: (value: any, record) => {
        // cancelSelection()
        return record.placement === value
      },
    },
    {
      title: 'Relative To',
      dataIndex: 'placementRelativeTo',
      key: 'placementRelativeTo',
      width: 100,
      ellipsis: false,
    },
    // {
    //   title: 'Camera',
    //   dataIndex: 'cameraShot',
    //   key: 'cameraShot',
    //   width: 300,
    //   ellipsis: false,
    //   render(value, record, index) {
    //     return <Space size="small" wrap>
    //       {record.cameraShot?.map((v, i) => {
    //         return <Tag key={`tag-camera-${record.key}-${i}`}>{v}</Tag>
    //       })}
    //     </Space>
    //   },
    // },
    {
      title: 'Temporal Relation',
      dataIndex: 'temporalRelation',
      key: 'temporalRelation',
      width: 200,
      ellipsis: false,
      render(value, record, index) {
        return <Space size="small" wrap>
          {record.temporalRelation?.map((v, i) => {
            return <Tag key={`tag-temporalrelation-${record.key}-${i}`}>{v}</Tag>
          })}
        </Space>
      },
    },
    {
      title: 'Key Event',
      dataIndex: 'keyEvent',
      key: 'keyEvent',
      width: 100,
      ellipsis: false,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 160,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => goToStart(record)}>
            <Tooltip title="Go to the start moment of this record.">
              to start
            </Tooltip>
          </Button>

          <Button type="link" size="small" onClick={() => goToEnd(record)}>
            <Tooltip title="Go to the end moment of this record, if it has one.">
              to end
            </Tooltip>
          </Button>

        </Space>
      ),
    },
  ];


  return (
    <div>
      <Table
        className={styles.visTable}
        columns={columns}
        dataSource={visList.filter((vis) => {
          return vis.videoKey === currentVideo?.key
        })}
        size="small"
        // rowSelection={{
        //   type: "radio",
        //   ...rowSelection,
        // }}
        onRow={(record) => ({
          // onClick: () => {
          //   selectTableRow(record);
          // },
          style: {
            background: record.startMoment > currentTime && record.endMoment < currentTime ? 'red' : 'default',
          }
        })}
        scroll={{ x: 1500, y: 350 }}
        pagination={{
          defaultPageSize: tablePageSize,
          size: "small",
          simple: true,
          position: ["bottomRight"],
          showSizeChanger: true,
          onChange(page, pageSize) {
            setTablePage(page)
            setTablePageSize(pageSize)
          },
        }}
      />
    </div>

  )
}

export default inject("store")(observer(VisTable))
