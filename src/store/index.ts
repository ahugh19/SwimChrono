import { makeAutoObservable, runInAction, action, observable } from "mobx";
import { PropsWithChildren } from "react";
import { initVideoData, initVisData, initPos, initUrlList, initCameraShotList, initEventList, initVisTriggerData, initVideoMetaData, generateUUID, readFile, downloadJson, calIntervalByTrigger, initGlobalSetting } from "../utils";
import { VisBboxType, UrlType, VideoType, VisType, dataType, VisTriggerType, EventType, CameraShotType, VideoMetaDataType, VideoFrameDataType, SwimmerVideoDataType, SwimmerVideoFrameType, LayerType, EmbeddedVisType, VideoObjType, VisIntervalType, EditableElementType, TriggerFormProps, TriggerCompType, GlobalSettingType } from "../types";
import { validateConfiguration } from "../types/validation";
import { toJS } from 'mobx';
import { message } from "antd";
import _, { min } from "lodash";
import { backendApiUrl } from "../utils/aiConfig";

export class Store {
  constructor() {
    makeAutoObservable(this, {
      layerList: observable,
      updateCurrentLayerVisPosX: action,
      updateCurrentLayerVisPosY: action,
    });
    this.videoList = initVideoData();
    this.visList = initVisData();
    this.urlList = initUrlList();
    this.eventList = initEventList();
    this.cameraShotList = initCameraShotList();
    this.pos = initPos();
    this.seekTime = null;
    this.selectedVideoRecord = null;
    this.selectedVisRecord = null;
    this.selectedEventRecord = null;
    this.selectedCameraShotRecord = null;
    this.processedVisData = [];
    this.processedVideoData = [];
    this.visTriggerVideoData = initVisTriggerData().video;
    this.visTriggerVisData = initVisTriggerData().visList;
    this.layerList = [];
    this.selectedLayerIndex = null;

    this.currentVideoMetaData = initVideoMetaData();
    this.currentSwimmerVideo = null;
    this.videoElement = null;
    this.svgElement = null;
    this.editingElementId = "";
    this.globalSetting = initGlobalSetting();
  }

  videoList: VideoType[]
  visList: VisType[]
  urlList: UrlType[]
  eventList: EventType[]
  cameraShotList: CameraShotType[]
  pos: VisBboxType
  seekTime: number | null
  selectedVideoRecord: VideoType | null
  selectedVisRecord: VisType | null
  selectedEventRecord: EventType | null
  selectedCameraShotRecord: CameraShotType | null
  processedVisData: VisType[][]
  processedVideoData: VideoType[]
  visTriggerVideoData: VideoType
  visTriggerVisData: VisType[]
  currentVideoMetaData: VideoMetaDataType | null
  currentSwimmerVideo: SwimmerVideoDataType | null
  layerList: LayerType[]
  videoElement: HTMLVideoElement | null
  selectedLayerIndex: number | null
  svgElement: SVGSVGElement | null
  editingElementId: string
  globalSetting: GlobalSettingType


  updateGlobalSettingBlur = (blur: number) => {
    this.globalSetting.blur = blur
  }

  updateGlobalSettingMinDuration = (minDuration: number) => {
    this.globalSetting.minDuration = minDuration
  }


  updateEditingElementId = (elementId: string) => {
    this.editingElementId = elementId
  }

  updateCurrentLayerVisShapeFillColor = (hex: string) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.editableElementList.forEach((e) => {
      if (e.id === this.editingElementId) {
        e.shapeFillColor = hex
        return
      }
    })
    selectedLayer.embeddedVis.editableElementList = [...selectedLayer.embeddedVis.editableElementList]
    this.layerList = [...this.layerList]
    this.log()
  }

  updateCurrentLayerVisShapeStrokeColor = (hex: string) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.editableElementList.forEach((e) => {
      if (e.id === this.editingElementId) {
        e.shapeStrokeColor = hex
        return
      }
    })
    selectedLayer.embeddedVis.editableElementList = [...selectedLayer.embeddedVis.editableElementList]
    this.layerList = [...this.layerList]
    this.log()
  }

  updateCurrentLayerVisShapeStrokeWidth = (width: number) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.editableElementList.forEach((e) => {
      if (e.id === this.editingElementId) {
        e.shapeStrokeWidth = width
        return
      }
    })
    selectedLayer.embeddedVis.editableElementList = [...selectedLayer.embeddedVis.editableElementList]
    this.layerList = [...this.layerList]
    this.log()
  }

    updateCurrentLayerVisShapeVisibility = (visible: boolean) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.editableElementList.forEach((e) => {
      if (e.id === this.editingElementId) {
        e.visible = visible
        return
      }
    })
    selectedLayer.embeddedVis.editableElementList = [...selectedLayer.embeddedVis.editableElementList]
    this.layerList = [...this.layerList]
    this.log()
  }


  updateCurrentLayerLanes = (values: number[]) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;

    selectedLayer.embeddedVis.visibleLanes = [...values]
    this.layerList = [...this.layerList]
    this.log()
  }

  updateCurrentLayerVisFontFillColor = (hex: string) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.editableElementList.forEach((e) => {
      if (e.id === this.editingElementId) {
        e.fontFillColor = hex
        return
      }
    })
    selectedLayer.embeddedVis.editableElementList = [...selectedLayer.embeddedVis.editableElementList]
    this.layerList = [...this.layerList]
    this.log()
  }

  updateCurrentLayerVisFontSize = (size: number) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.editableElementList.forEach((e) => {
      if (e.id === this.editingElementId) {
        e.fontSize = size
        return
      }
    })
    selectedLayer.embeddedVis.editableElementList = [...selectedLayer.embeddedVis.editableElementList]
    this.layerList = [...this.layerList]
    this.log()
  }

  updateCurrentLayerVisFontTextContent = (content: string) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.customizedText = content
    this.layerList = [...this.layerList]
  }

    updateCurrentLayerVisFontVisibility = (visible: boolean) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.editableElementList.forEach((e) => {
      if (e.id === this.editingElementId) {
        e.visible = visible
        return
      }
    })
    selectedLayer.embeddedVis.editableElementList = [...selectedLayer.embeddedVis.editableElementList]
    this.layerList = [...this.layerList]
    this.log()
  }

  updateCurrentLayerVisFontX = (v: number) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.editableElementList.forEach((e) => {
      if (e.id === this.editingElementId) {
        e.x = v
        return
      }
    })
    selectedLayer.embeddedVis.editableElementList = [...selectedLayer.embeddedVis.editableElementList]
    this.layerList = [...this.layerList]
    this.log()
  }

  updateCurrentLayerVisFontY = (v: number) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.editableElementList.forEach((e) => {
      if (e.id === this.editingElementId) {
        e.y = v
        return
      }
    })
    selectedLayer.embeddedVis.editableElementList = [...selectedLayer.embeddedVis.editableElementList]
    this.layerList = [...this.layerList]
    this.log()
  }

  updateCurrentLayerVisIconSize = (size: number) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.editableElementList.forEach((e) => {
      if (e.id === this.editingElementId) {
        e.iconSize = size
        return
      }
    })
    selectedLayer.embeddedVis.editableElementList = [...selectedLayer.embeddedVis.editableElementList]
    this.layerList = [...this.layerList]
    this.log()
  }

  updateCurrentLayerVisIconVisibility = (visible: boolean) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.editableElementList.forEach((e) => {
      if (e.id === this.editingElementId) {
        e.visible = visible
        return
      }
    })
    selectedLayer.embeddedVis.editableElementList = [...selectedLayer.embeddedVis.editableElementList]
    this.layerList = [...this.layerList]
    this.log()
  }

  updateCurrentLayerVisIntervals = (visIntervals: VisIntervalType[] | null, triggerCompList: TriggerCompType[] | null) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    if (!visIntervals || visIntervals && visIntervals.length === 0) {
      selectedLayer.intervalList = null
    } else {
      selectedLayer.intervalList = visIntervals;
    }
    if (!triggerCompList || triggerCompList && triggerCompList.length === 0) {
      selectedLayer.triggerCompList = null
    } else {
      selectedLayer.triggerCompList = triggerCompList
    }
    console.log(toJS(this.layerList))
    this.layerList = [...this.layerList]
  }

  updateCurrentLayerVisPosX = (x: number, xRatio: number | undefined) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.positionX = x;
    selectedLayer.embeddedVis.positionXAndWidthRatio = xRatio;
    this.layerList = [...this.layerList]
  }

  updateCurrentLayerVisPosY = (y: number, yRatio: number | undefined) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.positionY = y;
    selectedLayer.embeddedVis.positionYAndHeightRatio = yRatio;
    this.layerList = [...this.layerList]
  }

  updateCurrentLayerVisPosR = (r: number) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.positionR = r;
    this.layerList = [...this.layerList]
  }

  updateCurrentLayerVisPosS = (s: number, sRatio: number | undefined) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.positionS = s;
    selectedLayer.embeddedVis.positionSRatio = sRatio;
    this.layerList = [...this.layerList]
  }

  updateCurrentLayerVisPosMove = (isMove: boolean) => {
    console.log(isMove)
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null) return;
    selectedLayer.embeddedVis.positionMove = isMove;
    this.layerList = [...this.layerList]
  }

  updateCurrentLayerVisSvgContent = (svgContent: string) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null || selectedLayer.embeddedVis.customizedIcon === undefined) return;
    selectedLayer.embeddedVis.customizedIcon.svgContent = svgContent
    this.layerList = [...this.layerList]
  }

  updateCurrentLayerCustomizedVisIconSize = (size: number) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null || selectedLayer.embeddedVis.customizedIcon === undefined) return;
    selectedLayer.embeddedVis.customizedIcon.size = size;
    this.layerList = [...this.layerList]
  }

  updateCurrentLayerCustomizedVisIconVisibility = (visible: boolean) => {
    if (this.selectedLayerIndex === null) return;
    const selectedLayer = this.layerList[this.selectedLayerIndex];
    if (selectedLayer.embeddedVis === null || selectedLayer.embeddedVis.customizedIcon === undefined) return;
    selectedLayer.embeddedVis.customizedIcon.visible = visible;
    this.layerList = [...this.layerList]
  }

  setSvgElement = (ele: SVGSVGElement | null) => {
    this.svgElement = ele
  }

  addDefaultLayer = () => {
    if (this.layerList.length === 1 && this.layerList[0].name === "default layer") return
    const defaultLayer: LayerType = {
      uuid: generateUUID(),
      isSelected: true,
      visibility: true,
      name: "default layer",
      intervalList: null,
      triggerCompList: null,
      embeddedVis: {
        visName: "elapsedTimeCorner",
        visIcon: "generalCorner.png",
        dataName: "elapsedTime",
        triggerRecommendation: "This visualization usually appears during the whole race",
        composeType: "global",
        positionX: 0,
        positionY: 0,
        positionR: 0,
        positionS: 100,
        positionMove: false,
        editableElementList: [{
          id: "background-shape-1",
          type: "shape",
          visible: true,
          shapeFillColor: "#c9c9c9",
          shapeStrokeColor: "#c9c9c9",
          shapeStrokeWidth: 0
        }, {
          id: "text-1",
          type: "text",
          visible: true,
          fontFillColor: "#265656",
          fontSize: 10
        }]
      }
    }
    this.layerList = [defaultLayer]
    this.setSelectedLayerIndex(0)
  }

  addNewInitLayer = () => {
    console.log(this.selectedLayerIndex)
    if (this.selectedLayerIndex !== null || (this.selectedLayerIndex === 0 && this.layerList.length === 1)) {
      this.layerList[this.selectedLayerIndex].isSelected = false
    }
    this.layerList.push({
      uuid: generateUUID(),
      isSelected: true,
      visibility: true,
      name: `Layer ${this.layerList.length + 1}`,
      intervalList: null,
      triggerCompList: null,
      embeddedVis: null,
    })
    this.setSelectedLayerIndex(this.layerList.length - 1)
    // this.selectedLayerIndex = this.layerList.length - 1
  }

  importExample = async (exampleFileName: string) => {
    fetch(`configuration/${exampleFileName}`)
      .then((response) => response.json())
      .then((json) => {
        const newLayerList = json
        const _this = this
        runInAction(() => {
          newLayerList.forEach((newLayer: LayerType) => {
            if (!newLayer.intervalList) return

            const importTriggerCompList: TriggerFormProps = {
              triggerCompList: newLayer.triggerCompList
            }

            if (!_this.currentVideoMetaData || !_this.currentSwimmerVideo) return
            newLayer.intervalList = calIntervalByTrigger(_this.currentVideoMetaData, _this.currentSwimmerVideo, importTriggerCompList)

          })

          this.layerList = [...newLayerList]
          this.selectedLayerIndex = null
        })
      })
      .catch((error) => console.error("Error loading JSON:", error));
  };

  importConfig = async (e: any) => {
    // console.log(e);
    const text = await readFile(e.target.files[0])
    const newLayerList = JSON.parse(text as string)

    if (validateConfiguration(newLayerList)) {
      message.success("JSON file is valid.");
    } else {
      message.error("JSON is invalid!");
      return
    }

    const _this = this
    runInAction(() => {
      newLayerList.forEach((newLayer: LayerType) => {
        if (!newLayer.intervalList) return

        const importTriggerCompList: TriggerFormProps = {
          triggerCompList: newLayer.triggerCompList
        }

        if (!_this.currentVideoMetaData || !_this.currentSwimmerVideo) return
        newLayer.intervalList = calIntervalByTrigger(_this.currentVideoMetaData, _this.currentSwimmerVideo, importTriggerCompList)

      })

      this.layerList = [...newLayerList]
      this.selectedLayerIndex = null
      // this.setSelectedLayerIndex(null)
    })
  };

  exportConfig = () => {
    // console.log(JSON.stringify(this.layerList))
    downloadJson('SwimFlow2-layers.json', JSON.stringify(this.layerList.map((l) => {
      return {
        uuid: l.uuid,
        name: l.name,
        visibility: l.visibility,
        intervalList: l.intervalList,
        triggerCompList: l.triggerCompList,
        embeddedVis: l.embeddedVis,
        isSelected: false,
      }
    })))
  }

  setLayerList = (newLayerList: LayerType[]) => {
    this.layerList = JSON.parse(JSON.stringify(newLayerList))
  }

  copyLayer = (index: number) => {
    const newLayer = _.cloneDeep(this.layerList[index])
    newLayer.name = `${newLayer.name} copy`
    newLayer.isSelected = false
    this.layerList.splice(index + 1, 0, newLayer)
    this.layerList = [...this.layerList]
  }

  setLayerVisibility = (index: number) => {
    this.layerList[index].visibility = !this.layerList[index].visibility
    this.layerList = [...this.layerList]
    console.log(toJS(this.layerList))
  }

  setLayerName = (index: number, newName: string) => {
    this.layerList[index].name = newName
    this.layerList = [...this.layerList]
  }

  deleteLayer = (index: number) => {
    this.layerList.splice(index, 1)
    this.layerList = [...this.layerList]

    if (this.layerList.length === 0) {
      this.setSelectedLayerIndex(null)
    } else {
      if (this.selectedLayerIndex !== null) {
        if (this.selectedLayerIndex === index) {
          this.setSelectedLayerIndex(null)
        } else if (index < this.selectedLayerIndex) {
          this.setSelectedLayerIndex(this.selectedLayerIndex - 1)
        }
      }
    }
  }

  changeLayerOrder = (index: number, direction: string) => {
    if (direction === "up" && index > 0) {
      // move up: swap with the previous element via destructuring assignment
      this.layerList[index].isSelected = true;
      this.layerList[index - 1].isSelected = false;
      [this.layerList[index], this.layerList[index - 1]] = [this.layerList[index - 1], this.layerList[index]];
    } else if (direction === "down" && index < this.layerList.length - 1) {
      // move down: swap with the next element
      this.layerList[index].isSelected = true;
      this.layerList[index + 1].isSelected = false;
      [this.layerList[index], this.layerList[index + 1]] = [this.layerList[index + 1], this.layerList[index]];
    }
    this.layerList = [...this.layerList]
  }

  setSelectedLayerIndex = (index: number | null) => {
    console.log("old: ", this.selectedLayerIndex, "new: ", index)
    if (this.selectedLayerIndex === index) return

    const oldSelectedLayerIndex = this.selectedLayerIndex

    if (index === null && oldSelectedLayerIndex !== null) {
      if (this.layerList.length > oldSelectedLayerIndex) {
        this.layerList[oldSelectedLayerIndex].isSelected = false
      }
      this.selectedLayerIndex = null
      this.layerList = [...this.layerList]
    }

    if (index !== null && oldSelectedLayerIndex === null) {
      this.selectedLayerIndex = index
      this.layerList = [...this.layerList]
    }

    if (index !== null && oldSelectedLayerIndex !== null) {
      if (this.layerList.length > oldSelectedLayerIndex && this.layerList.length > index) {
        this.layerList[oldSelectedLayerIndex].isSelected = false
        this.layerList[index].isSelected = true
      }
      this.selectedLayerIndex = index
      this.layerList = [...this.layerList]
    }

    console.log("set as new: ", this.selectedLayerIndex)
  }

  setSelectedLayerVis = (vis: EmbeddedVisType) => {
    if (this.selectedLayerIndex === null) {
      message.error("invalid selectedLayerIndex")
      return
    }
    this.layerList[this.selectedLayerIndex].embeddedVis = vis
    this.layerList = [...this.layerList]
  }

  getExistingData = () => {
    fetch(`labelTool/result-vis25.json`)
      .then((res) => res.json())
      .then((response: any) => {
        console.log(response)
        runInAction(() => {
          this.videoList = this.mergeList([...this.videoList], [...response.videoList])
          this.visList = this.mergeList([...this.visList], [...response.visList])
          this.eventList = this.mergeList([...this.eventList], [...response.eventList])
          this.cameraShotList = this.mergeList([...this.cameraShotList], [...response.cameraShotList])
          this.urlList = this.mergeList([...this.urlList], [...response.urlList])
        })
        message.success(`Get ${response.urlList.length} URLs from backend.`)
      })
      .catch((error) => {
        console.error("get_existing_data failed", error)
      })
  }

  mergeList = (currentList: any[], inputList: any[]) => {
    const newList: any[] = inputList.slice()
    currentList.forEach((cd) => {
      let doubleFlag = false
      inputList.forEach((id) => {
        if (id.key === cd.key) {
          doubleFlag = true
        }
      })
      if (!doubleFlag) {
        newList.push(cd)
      }
    })
    return newList
  }

  setSelectedVideoRecord = (video: VideoType | null) => {
    this.selectedVideoRecord = video
  }

  setSelectedVisRecord = (vis: VisType | null) => {
    this.selectedVisRecord = vis
  }

  setSelectedEventRecord = (event: EventType | null) => {
    this.selectedEventRecord = event
  }

  setSelectedCameraShotRecord = (cameraShot: CameraShotType | null) => {
    this.selectedCameraShotRecord = cameraShot
  }

  log = () => {
    // console.log("videoList", toJS(this.videoList))
    // console.log("visList", toJS(this.visList))
    // console.log("eventList", toJS(this.eventList))
    // console.log("cameraShotList", toJS(this.cameraShotList))
    // console.log("processedVisData", toJS(this.processedVisData))
    // console.log("visTriggerVisData", toJS(this.visTriggerVisData))
    // console.log("currentSwimmerVideo", toJS(this.currentSwimmerVideo))
    console.log("layerList", toJS(this.layerList))
    // console.log("selectedLayerIndex", toJS(this.selectedLayerIndex))
    // console.log("editableElementList", toJS(this.layerList[this.selectedLayerIndex?this.selectedLayerIndex:0].embeddedVis?.editableElementList))
  }

  updatePos = (pos: VisBboxType) => {
    this.pos = pos
  }

  checkIsKeyExist = (newD: any, list: any[]) => {
    let flag = false
    list.forEach((d) => {
      if (d.key === newD.key) {
        flag = true
      }
    })
    return flag
  }

  setCurrentVideoMetaData = (newVideoMetaData: VideoMetaDataType) => {
    this.currentVideoMetaData = newVideoMetaData
  }

  setVideoElement = (newVideoEle: HTMLVideoElement) => {
    this.videoElement = newVideoEle
  }

  setCurrentSwimmerVideo = (newFrameDataList: VideoFrameDataType[]) => {
    // VideoFrameDataType[] -> SwimmerVideoDataType
    // single frame one swimmer -> single frame multiple swimmer
    console.log(newFrameDataList)
    if (newFrameDataList.length === 0) {
      this.currentSwimmerVideo = null
    } else {
      const newSwimmerVideo: SwimmerVideoDataType = {}
      let maxFrameId = -1
      let minFrameId = Infinity
      newFrameDataList.forEach((d) => {
        if (typeof d.frameId !== "number") return
        if (d.frameId > maxFrameId) maxFrameId = d.frameId
        if (d.frameId < minFrameId) minFrameId = d.frameId
      })
      // only frames between [minFrameId, maxFrameId] has data
      // fill other frame by null
      for (let i = 0; i <= maxFrameId; i++) {
        if (i < minFrameId) {
          newSwimmerVideo[i] = null
        } else {
          let index = 0
          newSwimmerVideo[i] = {} as SwimmerVideoFrameType
          do {
            //@ts-ignore
            newSwimmerVideo[i][newFrameDataList[0].swimmerId as number] = _.cloneDeep(newFrameDataList[0])
            newFrameDataList.shift()
            if (newFrameDataList.length === 0) break
          } while (newFrameDataList[0].frameId === i)
        }
      }
      this.currentSwimmerVideo = _.cloneDeep(newSwimmerVideo)
    }
  }

  updateVideo = (video: VideoType) => {
    if (this.checkIsKeyExist(video, [...this.videoList])) {
      this.videoList = this.videoList.map((v) => v.key === video.key ? video : v)
      // this.log()
      message.success(`update the video ${video.key}`)
    } else {
      this.videoList = [...this.videoList, video]
      message.success(`add a new video ${video.key}`)
    }
    this.saveData()
  }

  deleteVideo = (video: VideoType) => {
    const newList = this.videoList.filter((v) => { return v.key !== video.key })
    this.videoList = [...newList]
    if (this.selectedVideoRecord?.key === video.key) {
      this.setSelectedVideoRecord(null)
    }
    message.success(`Successfully delete ${video.key}.`)
    // this.log()
    this.saveData()
  }

  updateVideoEndMoment = (video: VideoType, time: number) => {
    this.videoList.map((v) => {
      if (v.key === video.key) {
        v.endMoment = time
      }
    })
    this.saveData()
  }

  updateVideoStartMoment = (video: VideoType, time: number) => {
    this.videoList.map((v) => {
      if (v.key === video.key) {
        v.startMoment = time
      }
    })
    this.saveData()
  }

  updateVis = (vis: VisType) => {
    if (this.checkIsKeyExist(vis, [...this.visList])) {
      this.visList = this.visList.map((v) => v.key === vis.key ? vis : v)
      message.success(`update the vis ${vis.key}`)
    } else {
      this.visList = [...this.visList, vis]
      message.success(`add a new vis ${vis.key}`)
    }
    this.saveData()
  }

  deleteVis = (vis: VisType) => {
    const newList = this.visList.filter((v) => { return v.key !== vis.key })
    this.visList = [...newList]
    if (this.selectedVisRecord?.key === vis.key) {
      this.setSelectedVisRecord(null)
    }
    message.success(`Successfully delete ${vis.key}.`)
    this.saveData()
  }

  updateVisStartMoment = (vis: VisType, time: number) => {
    this.visList.map((v) => {
      if (v.key === vis.key) {
        v.startMoment = time
      }
    })
    this.saveData()
  }

  updateVisEndMoment = (vis: VisType, time: number) => {
    this.visList.map((v) => {
      if (v.key === vis.key) {
        v.endMoment = time
        v.duration = time - v.startMoment
      }
    })
    this.saveData()
  }

  updateEvent = (event: EventType) => {
    if (this.checkIsKeyExist(event, [...this.eventList])) {
      this.eventList = this.eventList.map((e) => e.key === event.key ? event : e)
      // this.log()
      message.success(`update the vis ${event.key}`)
    } else {
      this.eventList = [...this.eventList, event]
      message.success(`add a new vis ${event.key}`)
    }
    this.saveData()
  }

  deleteEvent = (event: EventType) => {
    const newList = this.eventList.filter((e) => { return e.key !== event.key })
    this.eventList = [...newList]
    if (this.selectedEventRecord?.key === event.key) {
      this.setSelectedEventRecord(null)
    }
    message.success(`Successfully delete ${event.key}.`)
    this.saveData()
  }

  updateEventStartMoment = (event: EventType, time: number) => {
    this.eventList.map((e) => {
      if (e.key === event.key) {
        e.startMoment = time
      }
    })
    this.saveData()
  }

  updateEventEndMoment = (event: EventType, time: number) => {
    this.eventList.map((e) => {
      if (e.key === event.key) {
        e.endMoment = time
      }
    })
    this.saveData()
  }

  updateCameraShot = (cameraShot: CameraShotType) => {
    if (this.checkIsKeyExist(cameraShot, [...this.cameraShotList])) {
      this.cameraShotList = this.cameraShotList.map((c) => c.key === cameraShot.key ? cameraShot : c)
      // this.log()
      message.success(`update the cameraShot ${cameraShot.key}`)
    } else {
      this.cameraShotList = [...this.cameraShotList, cameraShot]
      message.success(`add a new cameraShot ${cameraShot.key}`)
    }
    this.saveData()
  }

  deleteCameraShot = (cameraShot: CameraShotType) => {
    const newList = this.cameraShotList.filter((c) => { return c.key !== cameraShot.key })
    this.cameraShotList = [...newList]
    if (this.selectedCameraShotRecord?.key === cameraShot.key) {
      this.setSelectedCameraShotRecord(null)
    }
    message.success(`Successfully delete ${cameraShot.key}.`)
    this.saveData()
  }

  updateCameraShotStartMoment = (cameraShot: CameraShotType, time: number) => {
    this.cameraShotList.map((c) => {
      if (c.key === cameraShot.key) {
        c.startMoment = time
      }
    })
    this.saveData()
  }

  // Backend persistence URL is sourced from VITE_BACKEND_API_URL.
  // Empty string disables backend calls (the public demo runs without one).
  apiURL = backendApiUrl;

  saveData = () => {
    message.success("This is just a demo without backend, so the labeling results won't be saved")
  }

  setVideoPlayerSeekTime = (t: number | null) => {
    this.seekTime = t
  }

  getProcessedData = () => {
    fetch(`labelTool/result-vis25.json`)
      .then((res) => res.json())
      .then((existingData: any) => {
        const visGroupList: any[][] = [];
        const videoList: any[] = [];

        for (const video of existingData.videoList) {
          const visList: any[] = [];
          const videoStartMoment = video.startMoment;

          for (const vis of existingData.visList) {
            if (vis.videoKey === video.key && vis.startMoment < vis.endMoment) {
              vis.relativeTimeInfo = {
                relativeStartMoment: vis.startMoment - videoStartMoment,
                relativeEndMoment: vis.endMoment - videoStartMoment
              };
              visList.push(vis);
            }
          }

          visList.sort((a, b) => a.startMoment - b.startMoment || a.movement.localeCompare(b.movement));
          visGroupList.push(visList);

          video.relativeTimeInfo = {
            relativeStartMoment: 0,
            relativeEndMoment: video.endMoment - videoStartMoment
          };

          videoList.push(video);
        }

        runInAction(() => {
          this.processedVisData = [...visGroupList]
          this.processedVideoData = [...videoList]
        })
        message.success(`Get processed data.`)
      })
      .catch((error) => {
        console.error("get_processed_data failed", error)
      })
  }

  sortProcessedVisDataByMovement = () => {
    this.processedVisData.forEach((visL) => {
      visL.sort((a, b) => a.movement.localeCompare(b.movement) || a.startMoment - b.startMoment)
    })
  }

  sortProcessedVisDataByPlacement = () => {
    this.processedVisData.forEach((visL) => {
      visL.sort((a, b) => a.placement.localeCompare(b.placement) || a.startMoment - b.startMoment)
    })
  }

  sortProcessedVisDataByStartMoment = () => {
    this.processedVisData.forEach((visL) => {
      visL.sort((a, b) => {
        if (a.relativeTimeInfo && b.relativeTimeInfo) {
          return a.relativeTimeInfo.relativeStartMoment - b.relativeTimeInfo.relativeStartMoment
        } else return 0
      })
    })
  }

  getVisTriggerData = () => {
    if (!this.apiURL) {
      message.warning("Backend not configured (VITE_BACKEND_API_URL); skipping get_trigger_list.")
      return
    }
    fetch(`${this.apiURL}/get_trigger_list`, {
      method: "GET",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response: any) => {
        if (response.msg === "success") {
          runInAction(() => {
            // this.visTriggerVisData = response.triggerData.visList
            // this.visTriggerVideoData = response.triggerData.video
          })
          message.success(`Get trigger data from backend.`)
        } else {
          alert("Error when get_trigger_list.");
        }
      })
      .catch((error) => {
        console.error("get_trigger_list failed", error)
      })
  }

  sortVisTriggerDataByMovement = () => {
    this.visTriggerVisData.sort((a, b) => a.movement.localeCompare(b.movement) || a.startMoment - b.startMoment)
  }

  sortVisTriggerDataByPlacement = () => {
    this.visTriggerVisData.sort((a, b) => a.placement.localeCompare(b.placement) || a.startMoment - b.startMoment)
  }

  sortVisTriggerDataByStartMoment = () => {
    this.visTriggerVisData.sort((a, b) => {
      if (a.relativeTimeInfo && b.relativeTimeInfo) {
        return a.relativeTimeInfo.relativeStartMoment - b.relativeTimeInfo.relativeStartMoment
      } else return 0
    })
  }
}

export interface IComponentPropsWithStore extends PropsWithChildren {
  store?: Store
}
