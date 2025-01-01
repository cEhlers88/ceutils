import IVector2D from "../Interfaces/IVector2D";
import IVector3D from "../Interfaces/IVector3D";

const buildMetaInfo = (props: Array<{
    examples?: any[],
    key?: string,
    name: string,
    type?: string | string[]
}> = [], hasStandAloneView: boolean = false) => {
    const generateCombinations = (examples: any[][]): any[][] => {
        return examples.reduce((acc, curr) => {
            return acc.flatMap(accItem => curr.map(currItem => [...accItem, currItem]));
        }, [[]]);
    };

    const filterInvalidCombinations = (combinations: any[][], props: any): any[][] => {
        return combinations.filter(combo => {
            const seen: Record<string, any> = {};
            for (let i = 0; i < combo.length; i++) {
                const key = props[i].key;
                const value = combo[i];
                if (key && seen[key] === value) {
                    return false;
                }
                seen[key] = value;
            }
            return true;
        });
    };

    const exampleArrays = props.map(prop => prop.examples || []);
    const combinations = generateCombinations(exampleArrays);
    const validCombinations = filterInvalidCombinations(combinations, props);

    const result = {
        hasStandAloneView,
        props: props.map((prop, index) => ({
            ...prop,
            examples: validCombinations.map(combo => combo[index])
        }))
    };

    return result;
};

const _dummyPosition:IVector2D = {x:100, y:70};
const _dummyPosition3d:IVector3D = {..._dummyPosition, z: 50};
const _dummyPivot:IVector2D = {x:0.5, y:0.5};
const dummyProps = {
    angle: 40,
    angle2: 50,
    color: '#287aaa',
    color2: '#000',
    colorNone: -1,
    condition: true,
    depth: 50,
    font: '12px Arial',
    height: 100,
    image: document.createElement('canvas'),
    pivot: _dummyPivot,
    pivot3d: {..._dummyPivot, z: 0.5},
    position: _dummyPosition,
    position2: {
        x: _dummyPosition.x + 50,
        y: _dummyPosition.y + 50
    },
    position3D: _dummyPosition3d,
    position3D2: {
        x: _dummyPosition3d.x + 50,
        y: _dummyPosition3d.y + 50,
        z: _dummyPosition3d.z + 50
    },
    size: 10,
    text: 'Hello World',
    width: 100,
}

export const drawEngine2dMeta = {
    beginPath: buildMetaInfo(),
    circle: buildMetaInfo([{
            examples: [dummyProps.position, dummyProps.position2],
            key: 'position',
            name: 'position',
            type: 'vector2d'
        },{
            examples: [dummyProps.angle, dummyProps.angle2],
            key: 'angle',
            name: 'radius',
            type: 'number'
        },{
            examples: [dummyProps.color, dummyProps.color2, dummyProps.colorNone],
            key: 'color',
            name: 'strokeStyle',
            type: 'color'
        },{
            examples: [dummyProps.color2, dummyProps.colorNone, dummyProps.color],
            key: 'color',
            name: 'fillStyle',
            type: 'color'
        }], true),
    clipRect: buildMetaInfo([{
            examples: [{
                ...dummyProps.position,
                height: dummyProps.height,
                width: dummyProps.width
            },{
                ...dummyProps.position2,
                height: dummyProps.height,
                width: dummyProps.width
            }],
            key: 'position_dimension',
            name: 'rect',
            type: 'rectangle'
        }]),
    clipRoundRect: buildMetaInfo([{
            examples: [{
                ...dummyProps.position,
                height: dummyProps.height,
                width: dummyProps.width
            }],
            key: 'position_dimension',
            name: 'rect',
            type: 'rectangle'
        }, {
            examples: [dummyProps.angle],
            key: 'angle',
            name: 'radius',
            type: 'number'
        }]),
    closePath: buildMetaInfo(),
    cls: buildMetaInfo(),
    cube: buildMetaInfo([{
            examples: [{
                ...dummyProps.position,
                height: dummyProps.height,
                width: dummyProps.width
            },{
                ...dummyProps.position2,
                height: dummyProps.height,
                width: dummyProps.width
            }],
            key: 'position_dimension',
            name: 'planeRect',
            type: 'rectangle'
        }, {
            examples: [dummyProps.depth],
            key: 'dimension',
            name: 'depth',
            type: 'number'
        }, {
            examples: [dummyProps.position3D],
            key: 'angles',
            name: 'angles',
            type: ['vector3d', 'vector3d[]', 'number[]', 'number[][]']
        }, {
            examples: [dummyProps.color, dummyProps.color2, dummyProps.colorNone],
            key: 'color',
            name: 'strokeStyle',
            type: 'color'
        }, {
            examples: [dummyProps.color2, dummyProps.colorNone, dummyProps.color],
            key: 'color',
            name: 'fillStyle',
            type: 'color'
        }], true),
    cube3d: buildMetaInfo([{
            examples: [{
                x:0, y:0, height: 100, width: 100
            },{
                ...dummyProps.position,
                height: dummyProps.height,
                width: dummyProps.width
            },{
                ...dummyProps.position2,
                height: dummyProps.height,
                width: dummyProps.width
            }],
            key: 'position_dimension',
            name: 'planeRect',
            type: 'rectangle'
        }, {
            examples: [dummyProps.depth, dummyProps.depth * 2, dummyProps.depth * 3],
            key: 'dimension',
            name: 'depth',
            type: 'number'
        }, {
            examples: [dummyProps.position3D, dummyProps.position3D2,{
                x: dummyProps.position3D.x + 50,
                y: dummyProps.position3D.y + 50,
                z: dummyProps.position3D.z + 50
            },{
                x: dummyProps.position3D.x + 150,
                y: dummyProps.position3D.y + 150,
                z: dummyProps.position3D.z + 150
            },{
                x: dummyProps.position3D.x + 250,
                y: dummyProps.position3D.y - 150,
                z: dummyProps.position3D.z - 350
            }],
            key: 'angles',
            name: 'angles',
            type: ['vector3d', 'vector3d[]', 'number[]', 'number[][]']
        }, {
            examples: [dummyProps.color],
            key: 'color',
            name: 'strokeStyle',
            type: 'color'
        }, {
            examples: [dummyProps.color2],
            key: 'color',
            name: 'fillStyle',
            type: 'color'
        }, {
            examples: [dummyProps.pivot3d],
            key: 'position',
            name: 'pivot',
            type: 'vector3d'
        }], true),
    donut: buildMetaInfo([{
            examples: [dummyProps.position, dummyProps.position2],
            key: 'position',
            name: 'position',
            type: 'vector2d'
        }, {
            examples: [dummyProps.angle, dummyProps.angle2, dummyProps.angle * 2, dummyProps.angle2 * 2],
            key: 'angle',
            name: 'outerRadius',
            type: 'number'
        }, {
            examples: [dummyProps.angle2, dummyProps.angle],
            key: 'angle',
            name: 'innerRadius',
            type: 'number'
        }, {
            examples: [dummyProps.color],
            key: 'color',
            name: 'strokeStyle',
            type: 'color'
        }, {
            examples: [dummyProps.color2],
            key: 'color',
            name: 'fillStyle',
            type: 'color'
        }], true),
    fill: buildMetaInfo([{
            name: 'fillRule',
            type: 'canvasFillRule'
        }]),
    gradientLines: buildMetaInfo([{
            examples: [dummyProps.position],
            key: 'position',
            name: 'start',
            type: 'vector2d'
        }, {
            examples: [[dummyProps.position2]],
            key: 'position_dimension',
            name: 'destinations',
            type: 'vector2d[]'
        }, {
            examples: [[dummyProps.color, dummyProps.color2]],
            name: 'colors',
            type: 'color[]'
        }, {
            examples: [dummyProps.width],
            key: 'dimension',
            name: 'width',
            type: 'number'
        }], true),
    grid: buildMetaInfo([{
            examples: [dummyProps.size, dummyProps.width, dummyProps.height],
            name: 'gridSize',
            type: 'number'
        }, {
            examples: [dummyProps.color, dummyProps.color2],
            name: 'strokeStyle',
            type: 'color'
        }, {
            examples: [undefined,{
                ...dummyProps.position,
                height: dummyProps.height,
                width: dummyProps.width
            }],
            key: 'position_dimension',
            name: 'area',
            type: 'rectangle'
        }, {
            examples: [0,dummyProps.angle],
            key: 'angle',
            name: 'angle',
            type: 'number'
        }], true),
    hexagon: buildMetaInfo([
        {
            examples: [dummyProps.position, dummyProps.position2],
            key: 'position',
            name: 'position',
            type: 'vector2d'
        }, {
            examples: [dummyProps.angle, dummyProps.angle2],
            key: 'angle',
            name: 'radius',
            type: 'number'
        }, {
            examples: [dummyProps.color, dummyProps.color2, dummyProps.colorNone],
            key: 'color',
            name: 'strokeStyle',
            type: 'color'
        }, {
            examples: [dummyProps.color2, dummyProps.colorNone, dummyProps.color],
            key: 'color',
            name: 'fillStyle',
            type: 'color'
        }, {
            examples: [dummyProps.angle2],
            key: 'angle',
            name: 'angle',
            type: 'number'
        }],true),
    image: buildMetaInfo([{
            examples: [dummyProps.image],
            key: 'image',
            name: 'canvas',
            type: 'canvas'
        }, {
            examples: [{
                ...dummyProps.position,
                height: dummyProps.height,
                width: dummyProps.width
            }],
            key: 'position_dimension',
            name: 'sourceRect',
            type: 'rectangle'
        }, {
            examples: [{
                ...dummyProps.position2,
                height: dummyProps.height,
                width: dummyProps.width
            }],
            key: 'position_dimension',
            name: 'destinationRect',
            type: 'rectangle'
        }, {
            examples: [dummyProps.angle],
            key: 'angle',
            name: 'angle',
            type: 'number'
        }, {
            examples: [dummyProps.pivot],
            key: 'position',
            name: 'pivot',
            type: 'vector2d'
        }], true),
    lines: buildMetaInfo([{
            examples: [dummyProps.position],
            key: 'position',
            name: 'startPosition',
            type: 'vector2d'
        }, {
            examples: [[dummyProps.position2]],
            key: 'position_dimension',
            name: 'destinations',
            type: 'vector2d[]'
        }, {
            examples: [dummyProps.color],
            key: 'color',
            name: 'strokeStyle',
            type: 'color'
        }, {
            examples: [dummyProps.color2],
            key: 'color',
            name: 'fillStyle',
            type: 'color'
        }, {
            examples: [dummyProps.width],
            key: 'dimension',
            name: 'lineWidth',
            type: 'number'
        }, {
            examples: [dummyProps.condition],
            key: 'condition',
            name: 'autoClose',
            type: 'boolean'
        }], true),
    moveTo: buildMetaInfo([{
            examples: [dummyProps.position],
            key: 'position',
            name: 'position',
            type: 'vector2d'
        }]),
    quadraticCurveTo: buildMetaInfo([{
            examples: [dummyProps.position],
            key: 'position',
            name: 'controlPoint',
            type: 'vector2d'
        }, {
            examples: [dummyProps.position2],
            key: 'position',
            name: 'position',
            type: 'vector2d'
        }],true),
    rectangle: buildMetaInfo([{
            examples: [{
                ...dummyProps.position,
                height: dummyProps.height,
                width: dummyProps.width
            },{
                ...dummyProps.position2,
                height: dummyProps.height,
                width: dummyProps.width
            }],
            key: 'position_dimension',
            name: 'rect',
            type: 'rectangle'
        }, {
            examples: [dummyProps.color, dummyProps.color2],
            key: 'color',
            name: 'strokeStyle',
            type: 'color'
        }, {
            examples: [dummyProps.color2, dummyProps.color],
            key: 'color',
            name: 'fillStyle',
            type: 'color'
        }, {
            examples: [dummyProps.angle, dummyProps.angle2],
            key: 'angle',
            name: 'angle',
            type: 'number'
        }, {
            examples: [dummyProps.pivot],
            key: 'position',
            name: 'pivot',
            type: 'vector2d'
        }], true),
    removeDrawCondition: buildMetaInfo(),
    resetClip: buildMetaInfo(),
    roundRectangle: buildMetaInfo([{
            examples: [{
                ...dummyProps.position,
                height: dummyProps.height,
                width: dummyProps.width
            }],
            key: 'position_dimension',
            name: 'rect',
            type: 'rectangle'
        }, {
            examples: [dummyProps.angle],
            key: 'angle',
            name: 'radius',
            type: 'number'
        }, {
            examples: [dummyProps.color],
            key: 'color',
            name: 'strokeStyle',
            type: 'color'
        }, {
            examples: [dummyProps.color2],
            key: 'color',
            name: 'fillStyle',
            type: 'color'
        }], true),
    selectRect: buildMetaInfo([{
            examples: [{
                ...dummyProps.position,
                height: dummyProps.height,
                width: dummyProps.width
            }],
            key: 'position_dimension',
            name: 'rect',
            type: 'rectangle'
        }]),
    selectRoundRect: buildMetaInfo([{
            examples: [{
                ...dummyProps.position,
                height: dummyProps.height,
                width: dummyProps.width
            }],
            key: 'position_dimension',
            name: 'rect',
            type: 'rectangle'
        }, {
            examples: [dummyProps.angle],
            key: 'angle',
            name: 'borderRadius',
            type: 'number'
        }]),
    setConditionalFilter: buildMetaInfo([{
            examples: [dummyProps.condition],
            key: 'condition',
            name: 'condition',
            type: 'boolean'
        }, {
            key: 'filter',
            name: 'filter',
            type: 'string'
        }]),
    setContext: buildMetaInfo([{
            key: 'context',
            name: 'ctx',
            type: 'canvasRenderingContext2D'
        }]),
    setDrawCondition: buildMetaInfo([{
            examples: [dummyProps.condition],
            key: 'condition',
            name: 'condition',
            type: 'boolean'
        }]),
    setFillStyle: buildMetaInfo([{
            examples: [dummyProps.color],
            key: 'color',
            name: 'fillStyle',
            type: 'color'
        }]),
    setFilter: buildMetaInfo([{
            key: 'filter',
            name: 'filter',
            type: 'string'
        }]),
    setFont: buildMetaInfo([{
            examples: [dummyProps.font],
            key: 'font',
            name: 'font',
            type: 'string'
        }]),
    setGlobalCompositeOperation: buildMetaInfo([{
            key: 'newState',
            name: 'newState',
            type: 'compositeOperation'
        }]),
    setStrokeStyle: buildMetaInfo([{
            examples: [dummyProps.color],
            key: 'color',
            name: 'strokeStyle',
            type: 'color'
        }]),
    setUnit: buildMetaInfo([{
            key: 'unit',
            name: 'unit',
            type: 'unit'
        }]),
    start: buildMetaInfo(),
    stroke: buildMetaInfo(),
    text: buildMetaInfo([{
            examples: [{
                ...dummyProps.position,
                lineHeight: dummyProps.height,
                width: dummyProps.width
            }],
            key: 'position_dimension',
            name: 'dim',
            type: 'vector2d'
        }, {
            examples: [dummyProps.text],
            name: 'text',
            type: 'text'
        }, {
            examples: [dummyProps.color],
            key: 'color',
            name: 'color',
            type: 'color'
        }, {
            examples: [dummyProps.font],
            key: 'font',
            name: 'font',
            type: 'string'
        }], true)
};