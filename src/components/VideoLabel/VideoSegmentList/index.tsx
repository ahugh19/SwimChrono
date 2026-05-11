import { useState, useEffect, useRef } from 'react'
import { inject, observer } from "mobx-react";
import { Button, Space, Row, Table, Tag, message, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { FileAddFilled, CaretRightOutlined, CheckCircleTwoTone, WarningTwoTone, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import '../../../App.css'
import AddNewVideoForm from './AddNewVideoForm'
import { VideoType } from '../../../types';
import { IComponentPropsWithStore, Store } from "../.././../store";
import type { CSSProperties } from 'react';
import { Collapse, theme, Popover } from 'antd';
import AddNewVisForm from './VisList/AddNewVisForm';
import VisList from './VisList';
import styles from "./index.module.less"
import EventList from './EventList';
import CameraShotList from './CameraShotList';



interface VideoSegmentListProps extends IComponentPropsWithStore {
  url: string,
  currentTime: number,
  canvasEl: React.RefObject<HTMLCanvasElement>
  labelType: string,
}

function useForceUpdate() {
  const [, setToggle] = useState(false);
  return () => setToggle(toggle => !toggle);
}

function VideoSegmentList(props: VideoSegmentListProps) {
  const store = props.store as Store
  const { url, currentTime, canvasEl, labelType } = props
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null)
  const forceUpdate = useForceUpdate();
  const [page, setPage] = useState<number>(1);
  const pageSize = 1;

  const columns: ColumnsType<VideoType> = [
    {
      title: 'Status',
      dataIndex: 'key',
      key: 'key',
      fixed: 'left',
      width: 80,
      render: (value, record, index) => record.endMoment <= record.startMoment || !record.endMoment ? <Tag icon={<ExclamationCircleOutlined />} color="warning">
        issue
      </Tag> : <Tag icon={<CheckCircleOutlined />} color="success">
        done
      </Tag>,
      ellipsis: true,
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      width: 60,
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      ellipsis: true,
    },
    {
      title: 'Style',
      dataIndex: 'style',
      key: 'style',
      width: 80,
      ellipsis: true,
    },
    {
      title: 'Start',
      dataIndex: 'startMoment',
      key: 'startMoment',
      ellipsis: true,
      width: 100,
      render(value, record, index) {
        return <div title={`${record.startMoment}`}>{record.startMoment.toFixed(4)}</div>
      },
    },
    {
      title: 'End',
      dataIndex: 'endMoment',
      key: 'endMoment',
      ellipsis: true,
      width: 100,
      render(value, record, index) {
        return <div style={{ color: `${record.endMoment <= record.startMoment || !record.endMoment ? "red" : "inherit"}` }} title={`${record.endMoment === record.startMoment ? " same as start, needs update" : `${record.endMoment}`}`}>{record.endMoment.toFixed(4)}</div>
      },
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 240,
      render: (_, record) => (
        <Space size="middle">
          {/* <Button type="link" size="small" onClick={() => setStartMoment(record)}>set start</Button> */}
          {/* <Button type={record.startMoment >= record.endMoment ? "primary" : "link"} size="small" onClick={() => setEndMoment(record)}>set end</Button> */}

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

          <Popover
            content={<Button size="small" type="primary" danger onClick={() => handleDeleteVideo(record)}>delete</Button>}
            title="Delete this row?"
            trigger="hover"
          >
            <Button type="link" size="small">delete</Button>
          </Popover>
        </Space>
      ),
    },
  ];

  function goToStart(record: VideoType) {
    if (store.checkIsKeyExist(record, store.videoList)) {
      store.setVideoPlayerSeekTime(record.startMoment)
    }
  }

  function goToEnd(record: VideoType) {
    if (store.checkIsKeyExist(record, store.videoList)) {
      if (record.endMoment > 0) {
        store.setVideoPlayerSeekTime(record.endMoment)
      }
    }
  }

  function handleDeleteVideo(v: VideoType) {
    store.deleteVideo(v)
    if (selectedVideo?.key === v.key) {
      setSelectedVideo(null)
      store.setSelectedVideoRecord(null)
    }
  }

  function selectTableRow(record: VideoType) {
    setSelectedVideo(record)
    store.setSelectedVideoRecord(record)
  };

  function setStartMoment(v: VideoType) {
    store.updateVideoStartMoment(v, currentTime)
    forceUpdate()
  }

  function setEndMoment(v: VideoType) {
    if (currentTime < v.startMoment) {
      message.error("End moment should be later than start moment.")
    } else {
      message.success("End moment is set.")
      store.updateVideoEndMoment(v, currentTime)
      forceUpdate()
    }
  }

  function onAddNewVideoFormFinish(values: VideoType) {
    store.updateVideo(values)
    store.setSelectedVideoRecord(values)
    setSelectedVideo(values)
    store.videoList.forEach((v, i) => {
      if (v.key === values.key) {
        setPage((i + 1) / pageSize)
      }
    })
  }

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys: [selectedVideo?.key as string],
    onChange: (selectedRowKeys: React.Key[], selectedRows: VideoType[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedVideo(selectedRows[0])
      store.setSelectedVideoRecord(selectedRows[0])
    },
  };

  function cancelSelection() {
    setSelectedVideo(null)
    store.setSelectedVideoRecord(null)
  }

  useEffect(() => {
    cancelSelection()
  }, [url])

  return (
    <div>
      <AddNewVideoForm
        url={url}
        onAddNewVideoFormFinish={onAddNewVideoFormFinish}
        currentTime={currentTime} />
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        {/* <div className={styles.videoTextBoxTitle}>
          {`Videos in this URL.`}
        </div> */}
        <Button className={styles.cancelSelectionBtn} type="default" size="small" onClick={cancelSelection}>cancel selection</Button>
        <Table
          className={styles.videoTable}
          columns={columns}
          dataSource={[...store.videoList.filter((v) => {
            return v.url === url
          })]}
          size="small"
          rowSelection={{
            type: "radio",
            ...rowSelection,
          }}
          onRow={(record) => ({
            onClick: () => {
              selectTableRow(record);
            }
          })}
          scroll={{ x: 900, y: 100 }}
          pagination={{
            defaultPageSize: pageSize,
            size: "small",
            simple: true,
            position: ["bottomRight"],
            current: page,
            onChange: function (p, pageSize) {
              setPage(p)
            }
          }}
        />
        <div className={styles.videoTextBoxSelect}>
          {`${selectedVideo ? `The selected video is [${selectedVideo.year}, ${selectedVideo.type}, ${selectedVideo.distance}, ${selectedVideo.style}]. Key: ${selectedVideo.key}` : `No video is selected.`}`}
        </div>
        {
          labelType === "vis"
            ?
            <VisList canvasEl={canvasEl} currentTime={currentTime} currentVideo={selectedVideo} />
            :
            (
              labelType === "event"
                ?
                <EventList currentTime={currentTime} currentVideo={selectedVideo} />
                : 
                <CameraShotList currentTime={currentTime} currentVideo={selectedVideo} />
            )
        }
      </Space>
      {/* <Test /> */}
    </div>
  )
}

export default inject('store')(observer(VideoSegmentList))