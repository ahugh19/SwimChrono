import { useState, useEffect } from 'react'
import { inject, observer } from "mobx-react";
import { Button, Space, Row, Popover, Table, message, Tag, Tooltip, Checkbox, Divider } from 'antd'
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { cameraShotOptionsCopiedOther, defaultCameraShotOptionsCopiedOther } from '../../../../utils/values';
import '../../../../App.css'
import AddNewCameraShotForm from './AddNewCameraShotForm';
import { IComponentPropsWithStore, Store } from "../../../../store";
import type { ColumnsType } from 'antd/es/table'
import { CameraShotType, VideoType } from '../../../../types';
import styles from "./index.module.less";

interface CameraShotListProps extends IComponentPropsWithStore {
  currentTime: number,
  currentVideo: VideoType | null,
}

function useForceUpdate() {
  const [, setToggle] = useState(false);
  return () => setToggle(toggle => !toggle);
}

function CameraShotList(props: CameraShotListProps) {
  const store = props.store as Store
  const { currentTime, currentVideo } = props
  const [selectedCameraShot, setSelectedCameraShot] = useState<CameraShotType | null>(null)
  const [copiedCameraShot, setCopiedCameraShot] = useState<CameraShotType | null>(null)
  const [issueNumber, setIssueNumber] = useState<number>(0)
  const [copiedFields, setCopiedFields] = useState<string[]>([])
  const forceUpdate = useForceUpdate()
  const [tablePageSize, setTablePageSize] = useState<number>(50)
  const [tablePage, setTablePage] = useState<number>(1)

  function onAddNewCameraShotFormFinish(values: CameraShotType) {
    setCopiedCameraShot(null)
    setCopiedFields([])
    store.updateCameraShot(values)
    setSelectedCameraShot(null)
    store.log()
  }

  useEffect(() => {
    if (!currentVideo) return
    let n = 0
    store.cameraShotList.filter((camera) => camera.videoKey === currentVideo.key).forEach((c) => {
      const { isDone } = checkStatus(c)
      if (isDone === false) {
        n = n + 1
      }
    })
    setIssueNumber(n)
  }, [store.cameraShotList, currentVideo])

  useEffect(() => {
    if (selectedCameraShot) {
      store.setSelectedCameraShotRecord(selectedCameraShot)
      setCopiedCameraShot(null)
      setCopiedFields([])
    } else {
      store.setSelectedCameraShotRecord(null)
    }
    console.log(selectedCameraShot)
  }, [selectedCameraShot])

  function handleDeleteCameraShot(cam: CameraShotType, e: any) {
    store.deleteCameraShot(cam)
    if (selectedCameraShot?.key === cam.key) {
      setSelectedCameraShot(null)
    }
    forceUpdate()
    e.stopPropagation()
  }

  function handleCopyCameraShot(eve: CameraShotType, e: any) {
    setCopiedCameraShot(eve)
    e.stopPropagation()
    setCopiedFields([...otherCheckedList])
  }

  useEffect(() => {
    if (copiedCameraShot) {
      cancelSelection()
    }
  }, [copiedCameraShot])

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys: selectedCameraShot ? [selectedCameraShot.key] : [],
    onChange: (selectedRowKeys: React.Key[], selectedRows: CameraShotType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedCameraShot(selectedRows[0])
      setCopiedCameraShot(null)
      setCopiedFields([])
    },
  };

  function cancelSelection() {
    setSelectedCameraShot(null)
  }

  function selectTableRow(record: CameraShotType) {
    if (store.checkIsKeyExist(record, store.cameraShotList)) {
      setSelectedCameraShot(record)
    }
  };

  function goToStart(record: CameraShotType) {
    if (store.checkIsKeyExist(record, store.cameraShotList)) {
      store.setVideoPlayerSeekTime(record.startMoment)
    }
  }

  function setStartMoment(c: CameraShotType) {
    store.updateCameraShotStartMoment(c, currentTime)
    forceUpdate()
  }

  function checkStatus(camera: CameraShotType) {
    let isDone = true
    const lackKeyNames: string[] = []
    const issues = []

    if (isDone) {
      issues.push("All filled.")
    } else {
      if (lackKeyNames.length > 0) {
        issues.push(`Empty fields: ${lackKeyNames?.map((n, i) => `${n}${i === lackKeyNames.length - 1 ? "." : ", "}`)}`)
      }
    }
    return { isDone, issues }
  }

  const columns: ColumnsType<CameraShotType> = [
    {
      title: 'No',
      dataIndex: 'key',
      key: 'no',
      fixed: 'left',
      width: 50,
      ellipsis: false,
      render: (value, record, index) => (tablePage - 1) * tablePageSize + index + 1
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'key',
    //   key: 'key',
    //   fixed: 'left',
    //   width: 80,
    //   ellipsis: false,
    //   render: (value, record, index) => {
    //     const { isDone, issues } = checkStatus(record)
    //     return isDone
    //       ?
    //       <Popover
    //         style={{ width: 300 }}
    //         content={"all field finished"}
    //         trigger="hover"
    //       >
    //         <Tag icon={<CheckCircleOutlined />} color="success">
    //           done
    //         </Tag>
    //       </Popover>
    //       :
    //       <Popover
    //         style={{ width: 300 }}
    //         content={<>{issues?.map((text) => <div>{text}</div>)}</>}
    //         trigger="hover"
    //       >
    //         <Tag icon={<ExclamationCircleOutlined />} color="warning" >
    //           issue
    //         </Tag >
    //       </Popover>
    //   },
    //   filters: [
    //     {
    //       text: "done",
    //       value: true,
    //     },
    //     {
    //       text: "issue",
    //       value: false,
    //     },
    //   ],
    //   onFilter: (value: any, record) => {
    //     // cancelSelection()
    //     const { isDone } = checkStatus(record)
    //     return isDone === value
    //   },
    // },
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
      title: 'Camera Shot',
      dataIndex: 'cameraShot',
      key: 'cameraShot',
      width: 120,
      ellipsis: true,
    },
    {
      title: 'Is Connected to Previous',
      dataIndex: 'isConnectedToPrevious',
      key: 'isConnectedToPrevious',
      width: 120,
      ellipsis: true,
      render(value, record, index) {
        return <div>{`${record.isConnectedToPrevious}`}</div>
      },
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
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => goToStart(record)}>
            <Tooltip title="Go to the start moment of this record.">
              to start
            </Tooltip>
          </Button>

          <Popover
            content={
              <Row style={{ width: "500px" }}>
                <Row>This will copy the values of this row. Choose copied fields:</Row>
                <Divider />
                <Checkbox indeterminate={otherCheckedList.length > 0 && otherCheckedList.length < cameraShotOptionsCopiedOther.length} onChange={onOtherCheckAllChange} checked={cameraShotOptionsCopiedOther.length === otherCheckedList.length}>
                  <b>Check all other fields</b>
                </Checkbox>
                <Checkbox.Group
                  options={cameraShotOptionsCopiedOther}
                  value={otherCheckedList}
                  onChange={onCopyOtherCheckboxChange}
                />

                <Divider />
                <Button style={{ width: "100%" }} size="small" type="primary" onClick={(e) => handleCopyCameraShot(record, e)}>copy as new</Button>
              </Row>}
            title="Copy as new"
            trigger="hover"
          >
            <Button type="link" size="small">copy as new</Button>
          </Popover>

          <Popover
            content={<Button size="small" type="primary" danger onClick={(e) => handleDeleteCameraShot(record, e)}>delete</Button>}
            title="Delete this row?"
            trigger="hover"
          >
            <Button type="link" size="small">delete</Button>
          </Popover>
        </Space>
      ),
    },
  ];

  const [otherCheckedList, setOtherCheckedList] = useState<any[]>(defaultCameraShotOptionsCopiedOther);
  function onOtherCheckAllChange(e: any) {
    setOtherCheckedList(e.target.checked ? cameraShotOptionsCopiedOther : [])
  }
  function onCopyOtherCheckboxChange(checkedValues: any) {
    setOtherCheckedList(checkedValues);
  }

  return (
    <div className={styles.cameraShotListContainer}>
      <AddNewCameraShotForm
        currentTime={currentTime}
        currentVideo={currentVideo}
        onAddNewCameraShotFormFinish={onAddNewCameraShotFormFinish}
        onResetForm={() => { setCopiedCameraShot(null); setCopiedFields([]) }}
        copiedCameraShot={copiedCameraShot}
        copiedFields={copiedFields} />
      <Space className={styles.cameraShotTextBox}>
        <Button className={styles.cancelSelectionBtn} type="default" size="small" onClick={cancelSelection}>cancel selection</Button>
        {` ${issueNumber}${issueNumber > 1 ? " records have" : " record has"} issues.`}
        {selectedCameraShot ? `Select an camer shot at ${selectedCameraShot.startMoment.toFixed(2)}.` : `No camera shot is selected.`}
      </Space>
      <Table
        className={styles.cameraShotTable}
        columns={columns}
        dataSource={[...store.cameraShotList.filter((camera) => {
          return camera.videoKey === currentVideo?.key
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
        scroll={{ x: 800, y: 500 }}
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

export default inject('store')(observer(CameraShotList))
