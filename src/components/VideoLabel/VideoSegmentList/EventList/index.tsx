import { useState, useEffect } from 'react'
import { inject, observer } from "mobx-react";
import { Button, Space, Row, Popover, Table, message, Tag, Tooltip, Checkbox, Divider } from 'antd'
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { eventOptionsCopiedOther, defaultEventOptionsCopiedOther, keyEventOptionsStringList } from '../../../../utils/values';
import '../../../../App.css'
import AddNewEventForm from './AddNewEventForm';
import { IComponentPropsWithStore, Store } from "../../../../store";
import type { ColumnsType } from 'antd/es/table'
import { EventType, VideoType } from '../../../../types';
import styles from "./index.module.less";

interface EventListProps extends IComponentPropsWithStore {
  currentTime: number,
  currentVideo: VideoType | null,
}

function useForceUpdate() {
  const [, setToggle] = useState(false);
  return () => setToggle(toggle => !toggle);
}

function EventList(props: EventListProps) {
  const store = props.store as Store
  const { currentTime, currentVideo } = props
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
  const [copiedEvent, setCopiedEvent] = useState<EventType | null>(null)
  const [issueNumber, setIssueNumber] = useState<number>(0)
  const [copiedFields, setCopiedFields] = useState<string[]>([])
  const forceUpdate = useForceUpdate()
  const [tablePageSize, setTablePageSize] = useState<number>(50)
  const [tablePage, setTablePage] = useState<number>(1)

  function onAddNewEventFormFinish(values: EventType) {
    setCopiedEvent(null)
    setCopiedFields([])
    store.updateEvent(values)
    setSelectedEvent(null)
    store.log()
  }

  useEffect(() => {
    if (!currentVideo) return
    let n = 0
    store.eventList.filter((event) => event.videoKey === currentVideo.key).forEach((e) => {
      const { isDone } = checkStatus(e)
      if (isDone === false) {
        n = n + 1
      }
    })
    setIssueNumber(n)
  }, [store.eventList, currentVideo])

  useEffect(() => {
    if (selectedEvent) {
      store.setSelectedEventRecord(selectedEvent)
      setCopiedEvent(null)
      setCopiedFields([])
    } else {
      store.setSelectedEventRecord(null)
    }
    console.log(selectedEvent)
  }, [selectedEvent])

  function handleDeleteEvent(eve: EventType, e: any) {
    store.deleteEvent(eve)
    if (selectedEvent?.key === eve.key) {
      setSelectedEvent(null)
    }
    forceUpdate()
    e.stopPropagation()
  }

  function handleCopyEvent(eve: EventType, e: any) {
    setCopiedEvent(eve)
    e.stopPropagation()
    setCopiedFields([...otherCheckedList])
  }

  useEffect(() => {
    if (copiedEvent) {
      cancelSelection()
    }
  }, [copiedEvent])

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys: selectedEvent ? [selectedEvent.key] : [],
    onChange: (selectedRowKeys: React.Key[], selectedRows: EventType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedEvent(selectedRows[0])
      setCopiedEvent(null)
      setCopiedFields([])
    },
  };

  function cancelSelection() {
    setSelectedEvent(null)
  }

  function selectTableRow(record: EventType) {
    if (store.checkIsKeyExist(record, store.eventList)) {
      setSelectedEvent(record)
    }
  };

  function goToStart(record: EventType) {
    if (store.checkIsKeyExist(record, store.eventList)) {
      store.setVideoPlayerSeekTime(record.startMoment)
    }
  }

  function goToEnd(record: EventType) {
    if (store.checkIsKeyExist(record, store.eventList)) {
      if (record.endMoment > 0) {
        store.setVideoPlayerSeekTime(record.endMoment)
      }
    }
  }

  function setStartMoment(e: EventType) {
    store.updateEventStartMoment(e, currentTime)
    forceUpdate()
  }

  function setEndMoment(e: EventType) {
    if (currentTime < e.startMoment) {
      message.error("End moment should be later than start moment.")
    } else {
      message.success("End moment is set.")
      store.updateEventEndMoment(e, currentTime)
      forceUpdate()
    }
  }

  function checkStatus(event: EventType) {
    let isDone = true
    const lackKeyNames = []
    const issues = []

    if (event.type !== "point" && event.endMoment <= event.startMoment) {
      isDone = false
      issues.push("End moment should be later than start moment.")
    }

    if (event.endMoment === undefined || event.endMoment === null) {
      isDone = false
      lackKeyNames.push("end moment")
    }

    if (isDone) {
      issues.push("All filled.")
    } else {
      if (lackKeyNames.length > 0) {
        issues.push(`Empty fields: ${lackKeyNames?.map((n, i) => `${n}${i === lackKeyNames.length - 1 ? "." : ", "}`)}`)
      }
    }
    return { isDone, issues }
  }

  const columns: ColumnsType<EventType> = [
    {
      title: 'No',
      dataIndex: 'key',
      key: 'no',
      fixed: 'left',
      width: 50,
      ellipsis: false,
      render: (value, record, index) => (tablePage - 1) * tablePageSize + index + 1
    },
    {
      title: 'Status',
      dataIndex: 'key',
      key: 'key',
      fixed: 'left',
      width: 80,
      ellipsis: false,
      render: (value, record, index) => {
        const { isDone, issues } = checkStatus(record)
        return isDone
          ?
          <Popover
            style={{ width: 300 }}
            content={"all field finished"}
            trigger="hover"
          >
            <Tag icon={<CheckCircleOutlined />} color="success">
              done
            </Tag>
          </Popover>
          :
          <Popover
            style={{ width: 300 }}
            content={<>{issues?.map((text) => <div>{text}</div>)}</>}
            trigger="hover"
          >
            <Tag icon={<ExclamationCircleOutlined />} color="warning" >
              issue
            </Tag >
          </Popover>
      },
      filters: [
        {
          text: "done",
          value: true,
        },
        {
          text: "issue",
          value: false,
        },
      ],
      onFilter: (value: any, record) => {
        // cancelSelection()
        const { isDone } = checkStatus(record)
        return isDone === value
      },
    },
    {
      title: <Tooltip>Notes</Tooltip>,
      dataIndex: 'note',
      key: 'note',
      fixed: 'left',
      width: 80,
      ellipsis: false,
      render: (value, record, index) => record.note
        ?
        <Popover
          style={{ width: 300 }}
          content={record.note}
          trigger="hover"
        >
          <Tag color="blue">
            note
          </Tag>
        </Popover>
        : <Tag color="default">
          ----
        </Tag>,
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
      title: 'Event',
      dataIndex: 'keyEvent',
      key: 'keyEvent',
      width: 120,
      ellipsis: true,
      filters: keyEventOptionsStringList.map((dos) => { return { text: dos, value: dos } }),
      onFilter: (value: any, record) => {
        // cancelSelection()
        return record.keyEvent.indexOf(value) !== -1
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      ellipsis: false,
      render(value, record, index) {
        return <Tag color={record.type === "point" ? "#8B8B00" : "#53868B"}>{record.type}</Tag>
      }
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
      // defaultSortOrder: 'ascend',
      // sortDirections: ['ascend', 'descend'],
      sorter: (a, b) => a.startMoment - b.startMoment,
    },
    {
      title: 'End',
      dataIndex: 'endMoment',
      key: 'endMoment',
      width: 100,
      ellipsis: false,
      render(value, record, index) {
        return <div style={{ color: `${record.type !== "point" && record.endMoment <= record.startMoment ? "red" : "inherit"}` }} title={`${record.type !== "point" && record.endMoment === record.startMoment ? "This is an interval event but end moment is the same as start. Needs update." : `${record.endMoment}`}`}>{record.endMoment.toFixed(4)}</div>
      },
      sorter: (a, b) => a.endMoment - b.endMoment,
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
    // {
    //   title: 'Key Event',
    //   dataIndex: 'keyEvent',
    //   key: 'keyEvent',
    //   width: 100,
    //   ellipsis: false,
    // },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 280,
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

          <Popover
            content={
              <Row style={{ width: "500px" }}>
                <Row>This will copy the values of this row. Choose copied fields:</Row>
                <Divider />
                <Checkbox indeterminate={otherCheckedList.length > 0 && otherCheckedList.length < eventOptionsCopiedOther.length} onChange={onOtherCheckAllChange} checked={eventOptionsCopiedOther.length === otherCheckedList.length}>
                  <b>Check all other fields</b>
                </Checkbox>
                <Checkbox.Group
                  options={eventOptionsCopiedOther}
                  value={otherCheckedList}
                  onChange={onCopyOtherCheckboxChange}
                />

                <Divider />
                <Button style={{ width: "100%" }} size="small" type="primary" onClick={(e) => handleCopyEvent(record, e)}>copy as new</Button>
              </Row>}
            title="Copy as new"
            trigger="hover"
          >
            <Button type="link" size="small">copy as new</Button>
          </Popover>

          <Popover
            content={<Button size="small" type="primary" danger onClick={(e) => handleDeleteEvent(record, e)}>delete</Button>}
            title="Delete this row?"
            trigger="hover"
          >
            <Button type="link" size="small">delete</Button>
          </Popover>
        </Space>
      ),
    },
  ];

  const [otherCheckedList, setOtherCheckedList] = useState<any[]>(defaultEventOptionsCopiedOther);
  function onOtherCheckAllChange(e: any) {
    setOtherCheckedList(e.target.checked ? eventOptionsCopiedOther : [])
  }
  function onCopyOtherCheckboxChange(checkedValues: any) {
    setOtherCheckedList(checkedValues);
  }

  return (
    <div className={styles.eventListContainer}>
      <AddNewEventForm
        currentTime={currentTime}
        currentVideo={currentVideo}
        onAddNewEventFormFinish={onAddNewEventFormFinish}
        onResetForm={() => { setCopiedEvent(null); setCopiedFields([]) }}
        copiedEvent={copiedEvent}
        copiedFields={copiedFields} />
      <Space className={styles.eventTextBox}>
        <Button className={styles.cancelSelectionBtn} type="default" size="small" onClick={cancelSelection}>cancel selection</Button>
        {` ${issueNumber}${issueNumber > 1 ? " records have" : " record has"} issues.`}
        {selectedEvent ? `Select an event during ${selectedEvent.startMoment.toFixed(2)}-${selectedEvent.endMoment.toFixed(2)}s.` : `No event is selected.`}
      </Space>
      <Table
        className={styles.eventTable}
        columns={columns}
        dataSource={[...store.eventList.filter((event) => {
          return event.videoKey === currentVideo?.key
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
        scroll={{ x: 1200, y: 500 }}
        pagination={{
          defaultPageSize: tablePageSize,
          size: "small",
          simple: true,
          position: ["topRight"],
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

export default inject('store')(observer(EventList))
