import Rect from './shape/Rect';
import Polygon from './shape/Polygon';
import Dot from './shape/Dot';
import EventBus from './EventBus';
import Line from './shape/Line';
import Circle from './shape/Circle';
import { isNested } from "./tools";

export type Point = [number, number];
export type AllShape = Rect | Polygon | Dot | Line | Circle;

export default class CanvasSelect extends EventBus {
    /** read-only mode: no interaction allowed */
    lock: boolean = false;
    /** read-only mode: view only */
    readonly: boolean = false;
    /** minimum rect width */
    MIN_WIDTH = 10;
    /** minimum rect height */
    MIN_HEIGHT = 10;
    /** minimum circle radius */
    MIN_RADIUS = 5;
    /** stroke colour */
    strokeStyle = '#0f0';
    /** fill colour */
    fillStyle = 'rgba(0, 0, 255,0.1)';
    /** stroke width */
    lineWidth = 1;
    /** stroke colour of the currently active shape */
    activeStrokeStyle = '#f00';
    /** fill colour of the currently active shape */
    activeFillStyle = 'rgba(255, 0, 0,0.1)';
    /** control-point stroke colour */
    ctrlStrokeStyle = '#000';
    /** control-point fill colour */
    ctrlFillStyle = '#fff';
    /** control-point radius */
    ctrlRadius = 3;
    /** whether to hide the label */
    hideLabel = false;
    /** label background fill */
    labelFillStyle = '#fff';
    /** label font */
    labelFont = '10px sans-serif';
    /** label text colour */
    textFillStyle = '#000';
    /** maximum label length; longer text is ellipsised */
    labelMaxLen = 10;
    /** canvas width */
    WIDTH = 0;
    /** canvas height */
    HEIGHT = 0;

    canvas: HTMLCanvasElement;

    ctx: CanvasRenderingContext2D;
    /** all annotation shapes */
    dataset: AllShape[] = [];

    offScreen: HTMLCanvasElement;

    offScreenCtx: CanvasRenderingContext2D;
    /** anchor offsets cache */
    remmber: number[][];
    /** last known mouse position */
    mouse: Point;
    /** background-image drag offset */
    remmberOrigin: number[] = [0, 0];
    /** 0 none, 1 rect, 2 polygon, 3 dot, 4 polyline, 5 circle */
    createType = 0; //
    /** index of the active control point */
    ctrlIndex = -1;
    /** background image */
    image: HTMLImageElement = new Image();
    /** original image width */
    IMAGE_ORIGIN_WIDTH: number;
    /** scaled image width */
    IMAGE_WIDTH = 0;
    /** original image height */
    IMAGE_ORIGIN_HEIGHT = 0;
    /** scaled image height */
    IMAGE_HEIGHT = 0;
    /** origin x */
    originX = 0;
    /** origin y */
    originY = 0;
    /** zoom step */
    scaleStep = 0;
    /** zoom by scroll */
    scrollZoom = true;

    private timer: any;
    /** minimum touch double-tap interval */
    dblTouch = 300;
    /** timestamp of the previous touch */
    dblTouchStore = 0; //
    /** lets the browser apply internal optimisations */
    alpha = true;
    /** focus mode: render only the active shape */
    focusMode = false;
    /** last DOM event captured */
    private evt: MouseEvent | TouchEvent | KeyboardEvent;
    /** previous distance between two touch points (pinch zoom) */
    scaleTouchStore = 0;
    /** whether two-finger touch is in progress */
    isTouch2 = false;
    isMobile = navigator.userAgent.includes('Mobile');
    /** render label above the shape */
    labelUp = false;
    /**
     * @param el Valid CSS selector string, or DOM
     * @param src image src
     */
    constructor(el: HTMLCanvasElement | string, src?: string) {
        super();
        this.handleLoad = this.handleLoad.bind(this);
        this.handleContextmenu = this.handleContextmenu.bind(this);
        // this.handleMousewheel = this.handleMousewheel.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handelMouseMove = this.handelMouseMove.bind(this);
        this.handelMouseUp = this.handelMouseUp.bind(this);
        this.handelDblclick = this.handelDblclick.bind(this);
        this.handelKeyup = this.handelKeyup.bind(this);
        const container = typeof el === 'string' ? document.querySelector(el) : el;
        if (container instanceof HTMLCanvasElement) {
            this.canvas = container;
            this.offScreen = document.createElement('canvas');
            this.initSetting();
            this.initEvents();
            src && this.setImage(src);
        } else {
            console.warn('HTMLCanvasElement is required!');
        }
    }

    /** currently active shape */
    get activeShape() {
        return this.dataset.find(x => x.active) || {} as any;
    }

    /** current scale ratio */
    get scale() {
        if (this.IMAGE_ORIGIN_WIDTH && this.IMAGE_WIDTH) {
            return this.IMAGE_WIDTH / this.IMAGE_ORIGIN_WIDTH;
        }
        return 1;
    }

    /** image minimum side */
    get imageMin() {
        return Math.min(this.IMAGE_WIDTH, this.IMAGE_HEIGHT);
    }

    /** image original maximum side */
    get imageOriginMax() {
        return Math.max(this.IMAGE_ORIGIN_WIDTH, this.IMAGE_ORIGIN_HEIGHT);
    }

    /** compose mouse / touch events */
    mergeEvent(e: TouchEvent | MouseEvent) {
        let mouseX = 0;
        let mouseY = 0;
        let mouseCX = 0;
        let mouseCY = 0;
        if (this.isMobile) {
            const { clientX, clientY } = (e as TouchEvent).touches[0];
            const target = e.target as HTMLCanvasElement;
            const { left, top } = target.getBoundingClientRect();
            mouseX = Math.round(clientX - left);
            mouseY = Math.round(clientY - top);
            if ((e as TouchEvent).touches.length === 2) {
                const { clientX: clientX1 = 0, clientY: clientY1 = 0 } = (e as TouchEvent).touches[1] || {};
                mouseCX = Math.round(Math.abs((clientX1 - clientX) / 2 + clientX) - left);
                mouseCY = Math.round(Math.abs((clientY1 - clientY) / 2 + clientY) - top);
            }
        } else {
            mouseX = (e as MouseEvent).offsetX;
            mouseY = (e as MouseEvent).offsetY;
        }
        return { ...e, mouseX, mouseY, mouseCX, mouseCY };
    }

    handleLoad() {
        this.emit('load', this.image.src);
        this.IMAGE_ORIGIN_WIDTH = this.IMAGE_WIDTH = this.image.width;
        this.IMAGE_ORIGIN_HEIGHT = this.IMAGE_HEIGHT = this.image.height;
        this.fitZoom();
    }

    handleContextmenu(e: MouseEvent) {
        e.preventDefault();
        this.evt = e;
        if (this.lock) return;
    }

    handleMousewheel(e: WheelEvent) {
        e.stopPropagation();
        this.evt = e;
        if (this.lock || !this.scrollZoom) return;
        const { mouseX, mouseY } = this.mergeEvent(e);
        this.mouse = [mouseX, mouseY];
        this.setScale(e.deltaY < 0, true);
    }

    handleMouseDown(e: MouseEvent | TouchEvent) {
        e.stopPropagation();
        this.evt = e;
        if (this.lock) return;
        const { mouseX, mouseY, mouseCX, mouseCY } = this.mergeEvent(e);
        const offsetX = Math.round(mouseX / this.scale);
        const offsetY = Math.round(mouseY / this.scale);
        this.mouse = this.isMobile && (e as TouchEvent).touches.length === 2 ? [mouseCX, mouseCY] : [mouseX, mouseY];
        this.remmberOrigin = [mouseX - this.originX, mouseY - this.originY];
        if ((!this.isMobile && (e as MouseEvent).buttons === 1) || (this.isMobile && (e as TouchEvent).touches.length === 1)) { // left mouse button
            const ctrls = this.activeShape.ctrlsData || [];
            this.ctrlIndex = ctrls.findIndex((coor: Point) => this.isPointInCircle(this.mouse, coor, this.ctrlRadius));
            if (this.ctrlIndex > -1) { // hit on a control point
                const [x0, y0] = ctrls[this.ctrlIndex];
                this.remmber = [[offsetX - x0, offsetY - y0]];
            } else if (this.isInBackground(e)) {
                if (this.activeShape.creating && !this.readonly) { // shape is being created
                    if ([2, 4].includes(this.activeShape.type)) {
                        const [x, y] = this.activeShape.coor[this.activeShape.coor.length - 1];
                        if (x !== offsetX && y !== offsetY) {
                            const nx = Math.round(offsetX - this.originX / this.scale);
                            const ny = Math.round(offsetY - this.originY / this.scale);
                            this.activeShape.coor.push([nx, ny]);
                        }
                    }
                } else if (this.createType > 0 && !this.readonly) { // start creating a shape
                    let newShape: AllShape;
                    const nx = Math.round(offsetX - this.originX / this.scale);
                    const ny = Math.round(offsetY - this.originY / this.scale);
                    const curPoint: Point = [nx, ny];
                    switch (this.createType) {
                        case 1:
                            newShape = new Rect({ coor: [curPoint, curPoint] }, this.dataset.length);
                            newShape.creating = true;
                            break;
                        case 2:
                            newShape = new Polygon({ coor: [curPoint] }, this.dataset.length);
                            newShape.creating = true;
                            break;
                        case 3:
                            newShape = new Dot({ coor: curPoint }, this.dataset.length);
                            this.emit('add', newShape);
                            break;
                        case 4:
                            newShape = new Line({ coor: [curPoint] }, this.dataset.length);
                            newShape.creating = true;
                            break;
                        case 5:
                            newShape = new Circle({ coor: curPoint }, this.dataset.length);
                            newShape.creating = true;
                            break;
                        default:
                            break;
                    }
                    this.dataset.forEach((sp) => { sp.active = false; });
                    newShape!.active = true;
                    this.dataset.push(newShape!);
                } else {
                    // did the click land on a shape?
                    const [hitShapeIndex, hitShape] = this.hitOnShape(this.mouse);
                    if (hitShapeIndex > -1) {
                        hitShape.dragging = true;
                        this.dataset.forEach((item, i) => item.active = i === hitShapeIndex);
                        this.dataset.splice(hitShapeIndex, 1);
                        this.dataset.push(hitShape);
                        if (!this.readonly) {
                            this.remmber = [];
                            if ([3, 5].includes(hitShape.type)) {
                                const [x, y] = hitShape.coor;
                                this.remmber = [[offsetX - x, offsetY - y]];
                            } else {
                                hitShape.coor.forEach((pt: any) => {
                                    this.remmber.push([offsetX - pt[0], offsetY - pt[1]]);
                                });
                            }
                        }
                        this.emit('select', hitShape);
                    } else {
                        this.activeShape.active = false;
                        this.dataset.sort((a, b) => a.index - b.index);
                        this.emit('select', null);
                    }
                }
                this.update();
            }
        }
    }

    handelMouseMove(e: MouseEvent | TouchEvent) {
        e.stopPropagation();
        this.evt = e;
        if (this.lock) return;
        const { mouseX, mouseY, mouseCX, mouseCY } = this.mergeEvent(e);
        const offsetX = Math.round(mouseX / this.scale);
        const offsetY = Math.round(mouseY / this.scale);
        this.mouse = this.isMobile && (e as TouchEvent).touches.length === 2 ? [mouseCX, mouseCY] : [mouseX, mouseY];
        if (((!this.isMobile && (e as MouseEvent).buttons === 1) || (this.isMobile && (e as TouchEvent).touches.length === 1)) && this.activeShape.type) {
            if (this.ctrlIndex > -1 && (this.isInBackground(e) || this.activeShape.type === 5)) {
                const [[x, y]] = this.remmber;
                // resize rect
                if (this.activeShape.type === 1) {
                    const [[x0, y0], [x1, y1]] = this.activeShape.coor;
                    let coor: Point[] = [];
                    switch (this.ctrlIndex) {
                        case 0:
                            coor = [[offsetX - x, offsetY - y], [x1, y1]];
                            break;
                        case 1:
                            coor = [[x0, offsetY - y], [x1, y1]];
                            break;
                        case 2:
                            coor = [[x0, offsetY - y], [offsetX - x, y1]];
                            break;
                        case 3:
                            coor = [[x0, y0], [offsetX - x, y1]];
                            break;
                        case 4:
                            coor = [[x0, y0], [offsetX - x, offsetY - y]];
                            break;
                        case 5:
                            coor = [[x0, y0], [x1, offsetY - y]];
                            break;
                        case 6:
                            coor = [[offsetX - x, y0], [x1, offsetY - y]];
                            break;
                        case 7:
                            coor = [[offsetX - x, y0], [x1, y1]];
                            break;
                        default:
                            break;
                    }
                    let [[a0, b0], [a1, b1]] = coor;
                    if (
                        a0 < 0 ||
                        a1 < 0 ||
                        b0 < 0 ||
                        b1 < 0 ||
                        a1 > this.IMAGE_ORIGIN_WIDTH ||
                        b1 > this.IMAGE_ORIGIN_HEIGHT
                    ) {
                        // rare path: clamp out-of-bounds coordinates
                        a0 < 0 && (a0 = 0);
                        a1 < 0 && (a1 = 0);
                        b0 < 0 && (b0 = 0);
                        b1 < 0 && (b1 = 0);
                        if (a1 > this.IMAGE_ORIGIN_WIDTH) {
                            a1 = this.IMAGE_ORIGIN_WIDTH;
                        }
                        if (b1 > this.IMAGE_ORIGIN_HEIGHT) {
                            b1 = this.IMAGE_ORIGIN_HEIGHT;
                        }
                    }

                    if (a1 - a0 >= this.MIN_WIDTH && b1 - b0 >= this.MIN_HEIGHT) {
                        this.activeShape.coor = [[a0, b0], [a1, b1]];
                    } else {
                        this.emit('warn', `Width cannot be less than ${this.MIN_WIDTH},Height cannot be less than${this.MIN_HEIGHT}。`);
                    }
                } else if ([2, 4].includes(this.activeShape.type)) {
                    const nx = Math.round(offsetX - this.originX / this.scale);
                    const ny = Math.round(offsetY - this.originY / this.scale);
                    const newPoint = [nx, ny];
                    this.activeShape.coor.splice(this.ctrlIndex, 1, newPoint);
                } else if (this.activeShape.type === 5) {
                    const nx = Math.round(offsetX - this.originX / this.scale);
                    const newRadius = nx - this.activeShape.coor[0];
                    if (newRadius >= this.MIN_RADIUS) this.activeShape.radius = newRadius;
                }
            } else if (this.activeShape.dragging && !this.readonly) { // dragging
                let coor = [];
                let noLimit = true;
                const w = this.IMAGE_ORIGIN_WIDTH || this.WIDTH;
                const h = this.IMAGE_ORIGIN_HEIGHT || this.HEIGHT;
                if ([3, 5].includes(this.activeShape.type)) {
                    const [t1, t2] = this.remmber[0];
                    const x = offsetX - t1;
                    const y = offsetY - t2;
                    if (x < 0 || x > w || y < 0 || y > h) noLimit = false;
                    coor = [x, y];
                } else {
                    for (let i = 0; i < this.activeShape.coor.length; i++) {
                        const tar = this.remmber[i];
                        const x = offsetX - tar[0];
                        const y = offsetY - tar[1];
                        if (x < 0 || x > w || y < 0 || y > h) noLimit = false;
                        coor.push([x, y]);
                    }
                }
                if (noLimit) this.activeShape.coor = coor;
            } else if (this.activeShape.creating && this.isInBackground(e)) {
                const x = Math.round(offsetX - this.originX / this.scale);
                const y = Math.round(offsetY - this.originY / this.scale);
                // creating a rect
                if (this.activeShape.type === 1) {
                    this.activeShape.coor.splice(1, 1, [x, y]);
                } else if (this.activeShape.type === 5) {
                    const [x0, y0] = this.activeShape.coor;
                    const r = Math.sqrt((x0 - x) ** 2 + (y0 - y) ** 2);
                    this.activeShape.radius = r;
                }
            }
            this.update();
        } else if ([2, 4].includes(this.activeShape.type) && this.activeShape.creating) {
            // adding a vertex to a polygon
            this.update();
        } else if ((!this.isMobile && (e as MouseEvent).buttons === 2 && (e as MouseEvent).which === 3) || (this.isMobile && (e as TouchEvent).touches.length === 1 && !this.isTouch2)) {
            // drag the background
            // this.originX = Math.round(mouseX - this.remmberOrigin[0]);
            // this.originY = Math.round(mouseY - this.remmberOrigin[1]);
            // this.update();
        } else if (this.isMobile && (e as TouchEvent).touches.length === 2) {
            this.isTouch2 = true;
            const touch0 = (e as TouchEvent).touches[0];
            const touch1 = (e as TouchEvent).touches[1];
            const cur = this.scaleTouchStore;
            this.scaleTouchStore = Math.abs((touch1.clientX - touch0.clientX) * (touch1.clientY - touch0.clientY));
            this.setScale(this.scaleTouchStore > cur, true);
        }
    }

    handelMouseUp(e: MouseEvent | TouchEvent) {
        e.stopPropagation();
        this.evt = e;
        if (this.lock) return;
        if (this.isMobile) {
            if ((e as TouchEvent).touches.length === 0) {
                this.isTouch2 = false;
            }
            if ((Date.now() - this.dblTouchStore) < this.dblTouch) {
                this.handelDblclick(e);
                return;
            }
            this.dblTouchStore = Date.now();
        }
        this.remmber = [];
        if (this.activeShape.type) {
            this.activeShape.dragging = false;
            if (this.activeShape.creating) {
                if (this.activeShape.type === 1) {
                    const [[x0, y0], [x1, y1]] = this.activeShape.coor;
                    if (Math.abs(x0 - x1) < this.MIN_WIDTH || Math.abs(y0 - y1) < this.MIN_HEIGHT) {
                        this.dataset.pop();
                        this.emit('warn', `Width cannot be less than ${this.MIN_WIDTH},Height cannot be less than ${this.MIN_HEIGHT}`);
                    } else {
                        this.activeShape.coor = [[Math.min(x0, x1), Math.min(y0, y1)], [Math.max(x0, x1), Math.max(y0, y1)]];
                        this.activeShape.creating = false;
                        this.emit('add', this.activeShape);
                    }
                } else if (this.activeShape.type === 5) {
                    if (this.activeShape.radius < this.MIN_RADIUS) {
                        this.dataset.pop();
                        this.emit('warn', `Radius cannot be less than ${this.MIN_WIDTH}`);
                    } else {
                        this.activeShape.creating = false;
                        this.emit('add', this.activeShape);
                    }
                }
                this.update();
            }
        }
    }

    handelDblclick(e: MouseEvent | TouchEvent) {
        e.stopPropagation();
        this.evt = e;
        if (this.lock) return;
        if ([2, 4].includes(this.activeShape.type)) {
            if ((this.activeShape.type === 2 && this.activeShape.coor.length > 2) ||
                (this.activeShape.type === 4 && this.activeShape.coor.length > 1)
            ) {
                this.emit('add', this.activeShape);
                this.activeShape.creating = false;
                this.update();
            }
        }
    }

    handelKeyup(e: KeyboardEvent) {
        e.stopPropagation();
        this.evt = e;
        if (this.lock || document.activeElement !== document.body || this.readonly) return;
        if (this.activeShape.type) {
            if ([2, 4].includes(this.activeShape.type) && e.key === 'Escape') {
                if (this.activeShape.coor.length > 1 && this.activeShape.creating) {
                    this.activeShape.coor.pop();
                } else {
                    this.deleteByIndex(this.activeShape.index);
                }
                this.update();
            } else if (e.key === 'Backspace') {
                this.deleteByIndex(this.activeShape.index);
            }
        }
    }

    /** init settings */
    initSetting() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.style.userSelect = 'none';
        this.ctx = this.ctx || this.canvas.getContext('2d', { alpha: this.alpha });
        this.WIDTH = this.canvas.clientWidth;
        this.HEIGHT = this.canvas.clientHeight;
        this.canvas.width = this.WIDTH * dpr;
        this.canvas.height = this.HEIGHT * dpr;
        this.canvas.style.width = this.WIDTH + 'px';
        this.canvas.style.height = this.HEIGHT + 'px';
        this.offScreen.width = this.WIDTH;
        this.offScreen.height = this.HEIGHT;
        this.offScreenCtx = this.offScreenCtx || this.offScreen.getContext('2d', { willReadFrequently: true });
        this.ctx.scale(dpr, dpr);
    }

    /** bind DOM events */
    initEvents() {
        this.image.addEventListener('load', this.handleLoad);
        this.canvas.addEventListener('touchstart', this.handleMouseDown);
        this.canvas.addEventListener('touchmove', this.handelMouseMove);
        this.canvas.addEventListener('touchend', this.handelMouseUp);
        this.canvas.addEventListener('contextmenu', this.handleContextmenu);
        // this.canvas.addEventListener('mousewheel', this.handleMousewheel);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handelMouseMove);
        this.canvas.addEventListener('mouseup', this.handelMouseUp);
        this.canvas.addEventListener('dblclick', this.handelDblclick);
        document.body.addEventListener('keyup', this.handelKeyup);
    }

    /**
     * Set or switch the background image.
     * @param url image url
     */
    setImage(url: string) {
        this.image.src = url;
    }

    /**
     * Set the dataset.
     * @param data shape array
     */
    setData(data: AllShape[]) {
        setTimeout(() => {
            const initdata: AllShape[] = [];
            data.forEach((item, index) => {
                if (Object.prototype.toString.call(item).includes('Object')) {
                    let shape: AllShape;
                    switch (item.type) {
                        case 1:
                            shape = new Rect(item, index);
                            break;
                        case 2:
                            shape = new Polygon(item, index);
                            break;
                        case 3:
                            shape = new Dot(item, index);
                            break;
                        case 4:
                            shape = new Line(item, index);
                            break;
                        case 5:
                            shape = new Circle(item, index);
                            break;
                        default:
                            console.warn('Invalid shape', item);
                            break;
                    }
                    // @ts-ignore
                    [1, 2, 3, 4, 5].includes(item.type) && initdata.push(shape);
                } else {
                    console.warn('Shape must be an enumerable Object.', item);
                }
            });
            this.dataset = initdata;
            this.update();
        });
    }

    /**
     * Hit-test against existing shapes.
     * @param mousePoint cursor position
     */
    hitOnShape(mousePoint: Point): [number, AllShape] {
        let hitShapeIndex = -1;
        let hitShape: AllShape;
        for (let i = this.dataset.length - 1; i > -1; i--) {
            const shape = this.dataset[i];
            if (
                (shape.type === 3 && this.isPointInCircle(mousePoint, shape.coor as Point, this.ctrlRadius)) ||
                (shape.type === 5 && this.isPointInCircle(mousePoint, shape.coor as Point, (shape as Circle).radius * this.scale)) ||
                (shape.type === 1 && this.isPointInRect(mousePoint, (shape as Rect).coor)) ||
                (shape.type === 2 && this.isPointInPolygon(mousePoint, (shape as Polygon).coor)) ||
                (shape.type === 4 && this.isPointInLine(mousePoint, (shape as Line).coor))
            ) {
                if (this.focusMode && !shape.active) continue;
                hitShapeIndex = i;
                hitShape = shape;
                break;
            }
        }
        // @ts-ignore
        return [hitShapeIndex, hitShape];
    }

    /**
     * Whether the cursor is over the background image.
     * @param e MouseEvent
     * @returns boolean
     */
    isInBackground(e: MouseEvent | TouchEvent): boolean {
        const { mouseX, mouseY } = this.mergeEvent(e);
        return mouseX >= this.originX &&
            mouseY >= this.originY &&
            mouseX <= this.originX + this.IMAGE_ORIGIN_WIDTH * this.scale &&
            mouseY <= this.originY + this.IMAGE_ORIGIN_HEIGHT * this.scale;
    }

    /**
     * Point-in-rect test.
     * @param point coordinate
     * @param coor rect coordinates
     * @returns boolean
     */
    isPointInRect(point: Point, coor: Point[]): boolean {
        const [x, y] = point;
        const [[x0, y0], [x1, y1]] = coor.map((a) => a.map((b) => b * this.scale));
        return x0 + this.originX <= x &&
            x <= x1 + this.originX &&
            y0 + this.originY <= y &&
            y <= y1 + this.originY;
    }

    /**
     * Point-in-polygon test.
     * @param point coordinate
     * @param coor polygon vertices
     * @returns boolean
     */
    isPointInPolygon(point: Point, coor: Point[]): boolean {
        this.offScreenCtx.save();
        this.offScreenCtx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.offScreenCtx.translate(this.originX, this.originY);
        this.offScreenCtx.beginPath();
        coor.forEach((pt, i) => {
            const [x, y] = pt.map((a) => Math.round(a * this.scale));
            if (i === 0) {
                this.offScreenCtx.moveTo(x, y);
            } else {
                this.offScreenCtx.lineTo(x, y);
            }
        });
        this.offScreenCtx.closePath();
        this.offScreenCtx.fill();
        const areaData = this.offScreenCtx.getImageData(0, 0, this.WIDTH, this.HEIGHT);
        const index = (point[1] - 1) * this.WIDTH * 4 + point[0] * 4;
        this.offScreenCtx.restore();
        return areaData.data[index + 3] !== 0;
    }

    /**
     * Point-in-circle test.
     * @param point coordinate
     * @param center circle centre
     * @param r radius
     * @returns boolean
     */
    isPointInCircle(point: Point, center: Point, r: number): boolean {
        const [x, y] = point;
        const [x0, y0] = center.map((a) => a * this.scale);
        const distance = Math.sqrt((x0 + this.originX - x) ** 2 + (y0 + this.originY - y) ** 2);
        return distance <= r;
    }

    /**
     * Hit-test against a polyline.
     * @param point coordinate
     * @param coor polyline vertices
     * @returns boolean
     */
    isPointInLine(point: Point, coor: Point[]): boolean {
        this.offScreenCtx.save();
        this.offScreenCtx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.offScreenCtx.translate(this.originX, this.originY);
        this.offScreenCtx.lineWidth = 5;
        this.offScreenCtx.beginPath();
        coor.forEach((pt, i) => {
            const [x, y] = pt.map((a) => Math.round(a * this.scale));
            if (i === 0) {
                this.offScreenCtx.moveTo(x, y);
            } else {
                this.offScreenCtx.lineTo(x, y);
            }
        });
        this.offScreenCtx.stroke();
        const areaData = this.offScreenCtx.getImageData(0, 0, this.WIDTH, this.HEIGHT);
        const index = (point[1] - 1) * this.WIDTH * 4 + point[0] * 4;
        this.offScreenCtx.restore();
        return areaData.data[index + 3] !== 0;
    }

    /**
     * Whether shape2 is nested inside shape1 (rect / polygon only).
     * @param shape1 outer shape
     * @param shape2 inner shape
     * @returns boolean
     */
    isNested(shape1: Rect | Polygon, shape2: Rect | Polygon): boolean {
      return isNested(shape1, shape2);
    }

    /**
     * Render a rect.
     * @param shape shape instance
     */
    drawRect(shape: Rect) {
        if (shape.coor.length !== 2) return;
        const { strokeStyle, fillStyle, active, creating, coor, lineWidth } = shape;
        const [[x0, y0], [x1, y1]] = coor.map((a: Point) => a.map((b) => Math.round(b * this.scale)));
        this.ctx.save();
        this.ctx.lineWidth = lineWidth || this.lineWidth;
        this.ctx.fillStyle = fillStyle || this.fillStyle;
        this.ctx.strokeStyle = (active || creating) ? this.activeStrokeStyle : (strokeStyle || this.strokeStyle);
        const w = x1 - x0;
        const h = y1 - y0;
        if (!creating) this.ctx.fillRect(x0, y0, w, h);
        this.ctx.strokeRect(x0, y0, w, h);
        this.ctx.restore();
        this.drawLabel(coor[0], shape);
    }

    /**
     * Render a polygon.
     * @param shape shape instance
     */
    drawPolygon(shape: Polygon) {
        const { strokeStyle, fillStyle, active, creating, coor, lineWidth } = shape;
        this.ctx.save();
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = lineWidth || this.lineWidth;
        this.ctx.fillStyle = fillStyle || this.fillStyle;
        this.ctx.strokeStyle = (active || creating) ? this.activeStrokeStyle : (strokeStyle || this.strokeStyle);
        this.ctx.beginPath();
        coor.forEach((el: Point, i) => {
            const [x, y] = el.map((a) => Math.round(a * this.scale));
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        if (creating) {
            const [x, y] = this.mouse || [];
            this.ctx.lineTo(x - this.originX, y - this.originY);
        } else if (coor.length > 2) {
            this.ctx.closePath();
        }
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
        this.drawLabel(coor[0], shape);
    }

    /**
     * Render a dot.
     * @param shape shape instance
     */
    drawDot(shape: Dot) {
        const { strokeStyle, fillStyle, active, coor, lineWidth } = shape;
        const [x, y] = coor.map((a) => a * this.scale);
        this.ctx.save();
        this.ctx.lineWidth = lineWidth || this.lineWidth;
        this.ctx.fillStyle = fillStyle || this.ctrlFillStyle;
        this.ctx.strokeStyle = active ? this.activeStrokeStyle : (strokeStyle || this.strokeStyle);
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.ctrlRadius, 0, 2 * Math.PI, true);
        this.ctx.fill();
        this.ctx.arc(x, y, this.ctrlRadius, 0, 2 * Math.PI, true);
        this.ctx.stroke();
        this.ctx.restore();
        this.drawLabel(coor as Point, shape);
    }

    /**
     * Render a circle.
     * @param shape shape instance
     */
    drawCirle(shape: Circle) {
        const { strokeStyle, fillStyle, active, coor, label, creating, radius, ctrlsData, lineWidth } = shape;
        const [x, y] = coor.map((a) => a * this.scale);
        this.ctx.save();
        this.ctx.lineWidth = lineWidth || this.lineWidth;
        this.ctx.fillStyle = fillStyle || this.fillStyle;
        this.ctx.strokeStyle = (active || creating) ? this.activeStrokeStyle : (strokeStyle || this.strokeStyle);
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * this.scale, 0, 2 * Math.PI, true);
        this.ctx.fill();
        this.ctx.arc(x, y, radius * this.scale, 0, 2 * Math.PI, true);
        this.ctx.stroke();
        this.ctx.restore();
        this.drawLabel(ctrlsData[0] as Point, shape);
    }

    /**
     * Render a polyline.
     * @param shape shape instance
     */
    drawLine(shape: Line) {
        const { strokeStyle, active, creating, coor, lineWidth } = shape;
        this.ctx.save();
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = lineWidth || this.lineWidth;
        this.ctx.strokeStyle = (active || creating) ? this.activeStrokeStyle : (strokeStyle || this.strokeStyle);
        this.ctx.beginPath();
        coor.forEach((el: Point, i) => {
            const [x, y] = el.map((a) => Math.round(a * this.scale));
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        if (creating) {
            const [x, y] = this.mouse || [];
            this.ctx.lineTo(x - this.originX, y - this.originY);
        }
        this.ctx.stroke();
        this.ctx.restore();
        this.drawLabel(coor[0], shape);
    }

    /**
     * Render a control point.
     * @param point coordinate
     */
    drawCtrl(point: Point) {
        const [x, y] = point.map((a) => a * this.scale);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.ctrlFillStyle;
        this.ctx.strokeStyle = this.ctrlStrokeStyle;
        this.ctx.arc(x, y, this.ctrlRadius, 0, 2 * Math.PI, true);
        this.ctx.fill();
        this.ctx.arc(x, y, this.ctrlRadius, 0, 2 * Math.PI, true);
        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Render every control point of a shape.
     * @param shape shape instance
     */
    drawCtrlList(shape: Rect | Polygon | Line) {
        shape.ctrlsData.forEach((point, i) => {
            if (shape.type === 5) {
                if (i === 1) this.drawCtrl(point);
            } else {
                this.drawCtrl(point);
            }
        });
    }

    /**
     * Render the label for a shape.
     * @param point anchor coordinate
     * @param shape shape providing the label text/style
     */
    drawLabel(point: Point, shape: AllShape) {
        const { label = '', labelFillStyle = '', labelFont = '', textFillStyle = '', hideLabel, labelUp, lineWidth } = shape;
        const isHideLabel = typeof hideLabel === 'boolean' ? hideLabel : this.hideLabel;
        const isLabelUp = typeof labelUp === 'boolean' ? labelUp : this.labelUp;
        const currLineWidth = lineWidth || this.lineWidth;

        if (label.length && !isHideLabel) {
            this.ctx.font = labelFont || this.labelFont;
            const textPaddingLeft = 4;
            const textPaddingTop = 4;
            const newText = label.length < this.labelMaxLen + 1 ? label : `${label.slice(0, this.labelMaxLen)}...`;
            const text = this.ctx.measureText(newText);
            const font = parseInt(this.ctx.font) - 4;
            const labelWidth = text.width + textPaddingLeft * 2;
            const labelHeight = font + textPaddingTop * 2;
            const [x, y] = point.map((a) => a * this.scale);
            const toleft = (this.IMAGE_ORIGIN_WIDTH - point[0]) < labelWidth / this.scale;
            const toTop = (this.IMAGE_ORIGIN_HEIGHT - point[1]) < labelHeight / this.scale;
            const toTop2 = point[1] > labelHeight / this.scale;
            const isup = isLabelUp ? toTop2 : toTop;
            this.ctx.save();
            this.ctx.fillStyle = labelFillStyle || this.labelFillStyle;
            this.ctx.fillRect(toleft ? (x - text.width - textPaddingLeft - currLineWidth / 2) : (x + currLineWidth / 2), isup ? (y - labelHeight - currLineWidth / 2) : (y + currLineWidth / 2), labelWidth, labelHeight);
            this.ctx.fillStyle = textFillStyle || this.textFillStyle;
            this.ctx.fillText(newText, toleft ? (x - text.width) : (x + textPaddingLeft + currLineWidth / 2), isup ? (y - labelHeight + font + textPaddingTop) : (y + font + textPaddingTop + currLineWidth / 2), 180);
            this.ctx.restore();
        }
    }

    /**
     * Repaint the canvas.
     */
    update() {
        window.cancelAnimationFrame(this.timer);
        this.timer = window.requestAnimationFrame(() => {
            this.ctx.save();
            this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
            this.ctx.translate(this.originX, this.originY);
            if (this.IMAGE_WIDTH && this.IMAGE_HEIGHT) {
                this.ctx.drawImage(this.image, 0, 0, this.IMAGE_WIDTH, this.IMAGE_HEIGHT);
            }
            const renderList = this.focusMode ? (this.activeShape.type ? [this.activeShape] : []) : this.dataset;
            for (let i = 0; i < renderList.length; i++) {
                const shape = renderList[i];
                if (shape.hide) continue;
                switch (shape.type) {
                    case 1:
                        this.drawRect(shape as Rect);
                        break;
                    case 2:
                        this.drawPolygon(shape as Polygon);
                        break;
                    case 3:
                        this.drawDot(shape as Dot);
                        break;
                    case 4:
                        this.drawLine(shape as Line);
                        break;
                    case 5:
                        this.drawCirle(shape as Circle);
                        break;
                    default:
                        break;
                }
            }
            if ([1, 2, 4, 5].includes(this.activeShape.type) && !this.activeShape.hide) {
                this.drawCtrlList(this.activeShape);
            }
            this.ctx.restore();
            this.emit('updated', this.dataset);
        });
    }

    /**
     * Delete the shape at the given index.
     * @param index shape index
     */
    deleteByIndex(index: number) {
        const num = this.dataset.findIndex((x) => x.index === index);
        if (num > -1) {
            this.emit('delete', this.dataset[num]);
            this.dataset.splice(num, 1);
            this.dataset.forEach((item, i) => { item.index = i; });
            this.update();
        }
    }

    /**
     * Compute the zoom step that fits the image to the canvas.
     */
    calcStep(flag = '') {
        if (this.IMAGE_WIDTH < this.WIDTH && this.IMAGE_HEIGHT < this.HEIGHT) {
            if (flag === '' || flag === 'b') {
                this.setScale(true, false, true);
                this.calcStep('b');
            }
        }
        if (this.IMAGE_WIDTH > this.WIDTH || this.IMAGE_HEIGHT > this.HEIGHT) {
            if (flag === '' || flag === 's') {
                this.setScale(false, false, true);
                this.calcStep('s');
            }
        }
    }

    /**
     * Apply a zoom step.
     * @param type true to zoom in 5%, false to zoom out 5%
     * @param byMouse if true, zoom around the cursor instead of the centre
     * @param pure if true, do not redraw
     */
    setScale(type: boolean, byMouse = false, pure = false) {
        if (this.lock) return;
        if ((!type && this.imageMin < 20) || (type && this.IMAGE_WIDTH > this.imageOriginMax * 100)) return;
        if (type) { this.scaleStep++; } else { this.scaleStep--; }
        let realToLeft = 0;
        let realToRight = 0;
        const [x, y] = this.mouse || [];
        if (byMouse) {
            realToLeft = (x - this.originX) / this.scale;
            realToRight = (y - this.originY) / this.scale;
        }
        const abs = Math.abs(this.scaleStep);
        const width = this.IMAGE_WIDTH;
        this.IMAGE_WIDTH = Math.round(this.IMAGE_ORIGIN_WIDTH * (this.scaleStep >= 0 ? 1.05 : 0.95) ** abs);
        this.IMAGE_HEIGHT = Math.round(this.IMAGE_ORIGIN_HEIGHT * (this.scaleStep >= 0 ? 1.05 : 0.95) ** abs);
        if (byMouse) {
            this.originX = x - realToLeft * this.scale;
            this.originY = y - realToRight * this.scale;
        } else {
            const scale = this.IMAGE_WIDTH / width;
            this.originX = this.WIDTH / 2 - (this.WIDTH / 2 - this.originX) * scale;
            this.originY = this.HEIGHT / 2 - (this.HEIGHT / 2 - this.originY) * scale;
        }
        if (!pure) {
            this.update();
        }
    }

    /**
     * Fit the background image inside the canvas.
     */
    fitZoom() {
        this.calcStep();
        if (this.IMAGE_HEIGHT / this.IMAGE_WIDTH >= this.HEIGHT / this.WIDTH) {
            this.IMAGE_WIDTH = this.IMAGE_ORIGIN_WIDTH / (this.IMAGE_ORIGIN_HEIGHT / this.HEIGHT);
            this.IMAGE_HEIGHT = this.HEIGHT;
        } else {
            this.IMAGE_WIDTH = this.WIDTH;
            this.IMAGE_HEIGHT = this.IMAGE_ORIGIN_HEIGHT / (this.IMAGE_ORIGIN_WIDTH / this.WIDTH);
        }
        this.originX = (this.WIDTH - this.IMAGE_WIDTH) / 2;
        this.originY = (this.HEIGHT - this.IMAGE_HEIGHT) / 2;
        this.update();
    }

    /**
     * Toggle focus mode.
     * @param type {boolean}
     */
    setFocusMode(type: boolean) {
        this.focusMode = type;
        this.update();
    }

    /**
     * Detach all event listeners and reset the canvas.
     */
    destroy() {
        this.image.removeEventListener('load', this.handleLoad);
        this.canvas.removeEventListener('contextmenu', this.handleContextmenu);
        // this.canvas.removeEventListener('mousewheel', this.handleMousewheel);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('touchend', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handelMouseMove);
        this.canvas.removeEventListener('touchmove', this.handelMouseMove);
        this.canvas.removeEventListener('mouseup', this.handelMouseUp);
        this.canvas.removeEventListener('touchend', this.handelMouseUp);
        this.canvas.removeEventListener('dblclick', this.handelDblclick);
        document.body.removeEventListener('keyup', this.handelKeyup);
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.canvas.style.width = null as any;
        this.canvas.style.height = null as any;
        this.canvas.style.userSelect = null as any;
    }

    /**
     * Re-measure and redraw after the canvas has been resized.
     */
    resize() {
        this.canvas.width = 0;
        this.canvas.height = 0;
        this.canvas.style.width = null as any;
        this.canvas.style.height = null as any;
        this.initSetting();
        this.update();
    }
}
