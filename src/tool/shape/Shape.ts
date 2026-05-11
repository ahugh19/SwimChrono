import { createUuid } from "../tools"

interface ShapeProp {
    type: number
    [key: string]: any
}
export default class Shape {
    /** label text */
    public label: string = ''
    /** whether to hide the label */
    public hideLabel: boolean
    /** coordinates */
    public coor: any[] = []
    /** stroke colour */
    public strokeStyle: string
    /** fill colour */
    public fillStyle: string
    /** stroke width */
    public lineWidth: number
    /** label background colour */
    public labelFillStyle: string
    /** label text colour */
    public textFillStyle: string
    /** label font */
    public labelFont: string
    /** 1 rect, 2 polygon, 3 dot, 4 polyline, 5 circle */
    public type: number // shape kind
    /** whether currently active */
    public active: boolean = false
    /** whether currently being created */
    public creating: boolean = false
    /** whether currently being dragged */
    public dragging: boolean = false
    /** index */
    public index: number
    /** unique identifier */
    public uuid: string = createUuid()
    /** render label above the shape */
    public labelUp: boolean
    constructor(item: ShapeProp, index: number) {
        this.index = index
        Object.assign(this, item)
    }
}
