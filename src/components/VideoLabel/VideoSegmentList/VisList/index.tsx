import { useState, useEffect, useRef } from 'react'
import { inject, observer } from "mobx-react";
import { Button, Space, Row, Collapse, theme, Popover, Table, message, Tag, Badge, Tooltip, Checkbox, Divider, Radio } from 'antd'
import { FileAddFilled, CaretRightOutlined, WarningTwoTone, CheckCircleTwoTone, WarningOutlined, CheckCircleOutlined, ExclamationCircleOutlined, HeartTwoTone, StarTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { visOptionsCopiedBbox, defaultVisOptionsCopiedBbox, visOptionsCopiedMoment, defaultVisOptionsCopiedMoment, visOptionsCopiedOther, defaultVisOptionsCopiedOther, dataOptions, dataOptionsStringList, visTypeOptions, movementOptions, placementOptionsStringList, temporalRelationOptions, uiHighlightStar } from '../../../../utils/values';
import '../../../../App.css'
import AddNewVisForm from './AddNewVisForm';
import { IComponentPropsWithStore, Store } from "../../../../store";
import type { ColumnsType } from 'antd/es/table'
import { VideoType, VisType } from '../../../../types';
import styles from "./index.module.less";

interface VisListProps extends IComponentPropsWithStore {
  currentTime: number,
  currentVideo: VideoType | null,
  canvasEl: React.RefObject<HTMLCanvasElement>,
}

function useForceUpdate() {
  const [, setToggle] = useState(false);
  return () => setToggle(toggle => !toggle);
}

function VisList(props: VisListProps) {
  const store = props.store as Store
  const { currentTime, currentVideo, canvasEl } = props
  const [selectedVis, setSelectedVis] = useState<VisType | null>(null)
  const [issueNumber, setIssueNumber] = useState<number>(0)
  const [copiedVis, setCopiedVis] = useState<VisType | null>(null)
  const [copiedFields, setCopiedFields] = useState<string[]>([])
  const forceUpdate = useForceUpdate()
  const [tablePageSize, setTablePageSize] = useState<number>(50)
  const [tablePage, setTablePage] = useState<number>(1)

  function onAddNewVisFormFinish(values: VisType) {
    setCopiedVis(null)
    setCopiedFields([])
    store.updateVis(values)
    setSelectedVis(null)
    store.log()
  }

  useEffect(() => {
    if (!currentVideo) return
    let n = 0
    store.visList.filter((vis) => vis.videoKey === currentVideo.key).forEach((v) => {
      const { isDone } = checkStatus(v)
      if (isDone === false) {
        n = n + 1
      }
    })
    setIssueNumber(n)
  }, [store.visList, currentVideo])

  useEffect(() => {
    if (selectedVis) {
      store.setSelectedVisRecord(selectedVis)
      showBbox(selectedVis)
      setCopiedVis(null)
      setCopiedFields([])
    } else {
      store.setSelectedVisRecord(null)
    }
    console.log(selectedVis)
  }, [selectedVis])

  function handleDeleteVis(v: VisType, e: any) {
    store.deleteVis(v)
    if (selectedVis?.key === v.key) {
      setSelectedVis(null)
    }
    forceUpdate()
    e.stopPropagation()
  }

  function handleCopyVis(v: VisType, e: any) {
    setCopiedVis(v)
    e.stopPropagation()
    if (copyRadioValue === "bbox") {
      setCopiedFields([...bboxCheckedList, ...otherCheckedList])
      showBbox(v)
    } else if (copyRadioValue === "moment") {
      setCopiedFields([...momentCheckedList, ...otherCheckedList])
    } else if (copyRadioValue === "none") {
      setCopiedFields([...otherCheckedList])
    }
  }

  useEffect(() => {
    if (copiedVis) {
      cancelSelection()
    }
  }, [copiedVis])

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys: selectedVis ? [selectedVis.key] : [],
    onChange: (selectedRowKeys: React.Key[], selectedRows: VisType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedVis(selectedRows[0])
      setCopiedVis(null)
      setCopiedFields([])
    },
  };

  function cancelSelection() {
    setSelectedVis(null)
  }

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

  function setStartMoment(v: VisType) {
    store.updateVisStartMoment(v, currentTime)
    forceUpdate()
  }

  function setEndMoment(v: VisType) {
    if (currentTime < v.startMoment) {
      message.error("End moment should be later than start moment.")
    } else {
      message.success("End moment is set.")
      store.updateVisEndMoment(v, currentTime)
      forceUpdate()
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

  function checkStatus(vis: VisType) {
    let isDone = true
    const lackKeyNames = []
    const issues = []

    if (vis.endMoment <= vis.startMoment) {
      isDone = false
      issues.push("End moment should be later than start moment.")
    }

    if (!vis.endMoment) {
      isDone = false
      lackKeyNames.push("end moment")
    }

    if (!vis.temporalRelation) {
      isDone = false
      lackKeyNames.push("temporal relation")
    }

    if (!vis.leavingAnimation) {
      isDone = false
      lackKeyNames.push("leaving animation")
    }

    if (!vis.updatingAnimation) {
      isDone = false
      lackKeyNames.push("updating animation")
    }

    if (isDone) {
      issues.push("All filled.")
    } else {
      if (lackKeyNames.length > 0) {
        issues.push(`Empty fields: ${lackKeyNames?.map((n, i) => `${n}${i === lackKeyNames.length - 1 ? "." : ", "}`)}`)
      }
    }
    // console.log(lackKeyNames, issues, vis)
    return { isDone, issues }
  }

  const columns: ColumnsType<VisType> = [
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
      title: <Tooltip title="A star means it's a highlighted case.">Notes <InfoCircleOutlined /></Tooltip>,
      dataIndex: 'note',
      key: 'note',
      fixed: 'left',
      width: 100,
      ellipsis: false,
      render: (value, record, index) => record.note && record.note !== ""
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
        return (record.note !== undefined && record.note !== "")
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
      filters: temporalRelationOptions.map((tro) => { return { text: tro, value: tro } }),
      onFilter: (value: any, record) => {
        // cancelSelection()
        return record.temporalRelation.indexOf(value) !== -1
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
      width: 360,
      render: (_, record) => (
        <Space size="middle">
          {/* <Button type="link" size="small" onClick={() => setStartMoment(record)}>set start</Button> */}
          {/* <Button type={record.startMoment >= record.endMoment ? "primary" : "link"} size="small" onClick={() => setEndMoment(record)}>set end</Button> */}
          {/* <Button type="link" size="small" onClick={() => showBbox(record)}>bbox</Button> */}

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
                <Row>This will copy the values of this row. Only one of bbox OR moment can be copied. Choose copied fields:</Row>
                <Divider />
                <Row style={{ width: "100%" }}>
                  <Radio.Group
                    onChange={onCopyRadioChange}
                    value={copyRadioValue}
                  >
                    <Radio value={"bbox"}>bbox</Radio>
                    <Radio value={"moment"}>moment</Radio>
                    <Radio value={"none"}>none of them</Radio>
                  </Radio.Group>
                </Row>
                <Row>
                  {
                    copyRadioValue === "none"
                      ?
                      null
                      :
                      copyRadioValue === "bbox"
                        ?
                        <Checkbox.Group
                          options={visOptionsCopiedBbox}
                          onChange={onCopyBboxCheckboxChange}
                          value={bboxCheckedList}
                        />
                        :
                        <>
                          <Checkbox indeterminate={momentCheckedList.length > 0 && momentCheckedList.length < visOptionsCopiedMoment.length} onChange={onMomentCheckAllChange} checked={visOptionsCopiedMoment.length === momentCheckedList.length}>
                            <b>Check all moments</b>
                          </Checkbox>
                          <Checkbox.Group
                            options={visOptionsCopiedMoment}
                            value={momentCheckedList}
                            onChange={onCopyMomentCheckboxChange}
                          />
                        </>
                  }
                </Row>
                <Divider />
                <Checkbox indeterminate={otherCheckedList.length > 0 && otherCheckedList.length < visOptionsCopiedOther.length} onChange={onOtherCheckAllChange} checked={visOptionsCopiedOther.length === otherCheckedList.length}>
                  <b>Check all other fields</b>
                </Checkbox>
                <Checkbox.Group
                  options={visOptionsCopiedOther}
                  value={otherCheckedList}
                  onChange={onCopyOtherCheckboxChange}
                />

                <Divider />
                <Button style={{ width: "100%" }} size="small" type="primary" onClick={(e) => handleCopyVis(record, e)}>copy as new</Button>
              </Row>}
            title="Copy as new"
            trigger="hover"
          >
            <Button type="link" size="small">copy as new</Button>
          </Popover>

          <Popover
            content={<Button size="small" type="primary" danger onClick={(e) => handleDeleteVis(record, e)}>delete</Button>}
            title="Delete this row?"
            trigger="hover"
          >
            <Button type="link" size="small">delete</Button>
          </Popover>
        </Space>
      ),
    },
  ];

  const [copyRadioValue, setCopyRadioValue] = useState<string>("none")
  function onCopyRadioChange(e: any) {
    setCopyRadioValue(e.target.value)
  }

  const [bboxCheckedList, setBboxCheckedList] = useState<any[]>(defaultVisOptionsCopiedBbox);
  function onCopyBboxCheckboxChange(checkedValues: any) {
    setBboxCheckedList(checkedValues)
  }

  const [momentCheckedList, setMomentCheckedList] = useState<any[]>(defaultVisOptionsCopiedMoment);
  function onMomentCheckAllChange(e: any) {
    setMomentCheckedList(e.target.checked ? visOptionsCopiedMoment : [])
  }
  function onCopyMomentCheckboxChange(checkedValues: any) {
    setMomentCheckedList(checkedValues);
  }

  const [otherCheckedList, setOtherCheckedList] = useState<any[]>(defaultVisOptionsCopiedOther);
  function onOtherCheckAllChange(e: any) {
    setOtherCheckedList(e.target.checked ? visOptionsCopiedOther : [])
  }
  function onCopyOtherCheckboxChange(checkedValues: any) {
    setOtherCheckedList(checkedValues);
  }

  return (
    <div className={styles.visListContainer}>
      <AddNewVisForm
        currentTime={currentTime}
        currentVideo={currentVideo}
        onAddNewVisFormFinish={onAddNewVisFormFinish}
        onResetForm={() => { setCopiedVis(null); setCopiedFields([]) }}
        copiedVis={copiedVis}
        copiedFields={copiedFields} />
      <Space className={styles.visTextBox}>
        <Button className={styles.cancelSelectionBtn} type="default" size="small" onClick={cancelSelection}>cancel selection</Button>
        {` ${issueNumber}${issueNumber > 1 ? " records have" : " record has"} issues.`}
        {selectedVis ? `Select a visualizaiton during ${selectedVis.startMoment.toFixed(2)}-${selectedVis.endMoment.toFixed(2)}s. Switch to editing mode to see the bbox.` : `No vis is selected.`}
      </Space>
      <Table
        className={styles.visTable}
        columns={columns}
        dataSource={[...store.visList.filter((vis) => {
          return vis.videoKey === currentVideo?.key
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
        scroll={{ x: 1500, y: 300 }}
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

export default inject('store')(observer(VisList))
