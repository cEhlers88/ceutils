import IVector2D from "../Interfaces/IVector2D";

const buildMetaInfo = (
  props: Array<
    | string
    | {
        name: string;
        type?: string | string[];
      }
  >,
  bodyBuilder: undefined | ((props: any) => IVector2D[]) = undefined
) => {
  const result: any = {
    props
  };
  if (bodyBuilder) {
    result.bodyBuilder = bodyBuilder;
  }
  return result;
};

export const drawEngine2dMeta = {
  beginPath: {},
  circle: buildMetaInfo([
    {
      name: "position",
      type: "vector2d"
    },
    {
      name: "radius",
      type: "number"
    },
    {
      name: "strokeStyle",
      type: "color"
    },
    {
      name: "fillStyle",
      type: "color"
    }
  ]),
  clipRect: buildMetaInfo([
    {
      name: "rect",
      type: "rectangle"
    }
  ]),
  clipRoundRect: buildMetaInfo([
    {
      name: "rect",
      type: "rectangle"
    },
    {
      name: "radius",
      type: "number"
    }
  ]),
  closePath: {},
  cls: {},
  cube: buildMetaInfo([
    {
      name: "planeRect",
      type: "rectangle"
    },
    {
      name: "depth",
      type: "number"
    },
    {
      name: "angles",
      type: ["vector3d", "vector3d[]", "number[]", "number[][]"]
    },
    {
      name: "strokeStyle",
      type: "color"
    },
    {
      name: "fillStyle",
      type: "color"
    }
  ]),
  cube3d: buildMetaInfo([
    {
      name: "planeRect",
      type: "rectangle"
    },
    {
      name: "depth",
      type: "number"
    },
    {
      name: "angles",
      type: ["vector3d", "vector3d[]", "number[]", "number[][]"]
    },
    {
      name: "strokeStyle",
      type: "color"
    },
    {
      name: "fillStyle",
      type: "color"
    },
    {
      name: "pivot",
      type: "vector3d"
    }
  ]),
  donut: buildMetaInfo([
    {
      name: "position",
      type: "vector2d"
    },
    {
      name: "outerRadius",
      type: "number"
    },
    {
      name: "innerRadius",
      type: "number"
    },
    {
      name: "strokeStyle",
      type: "color"
    },
    {
      name: "fillStyle",
      type: "color"
    }
  ]),
  fill: buildMetaInfo([
    {
      name: "fillRule",
      type: "canvasFillRule"
    }
  ]),
  gradientLines: buildMetaInfo([
    {
      name: "start",
      type: "vector2d"
    },
    {
      name: "destinations",
      type: "vector2d[]"
    },
    {
      name: "colors",
      type: "color[]"
    },
    {
      name: "width",
      type: "number"
    }
  ]),
  grid: buildMetaInfo([
    {
      name: "gridSize",
      type: "number"
    },
    {
      name: "strokeStyle",
      type: "color"
    },
    {
      name: "area",
      type: "rectangle"
    },
    {
      name: "angle",
      type: "number"
    }
  ]),
  hexagon: buildMetaInfo([
    "position",
    "radius",
    "strokeStyle",
    "fillStyle",
    "angle"
  ]),
  image: buildMetaInfo([
    "canvas",
    "sourceRect",
    "destinationRect",
    "angle",
    "pivot"
  ]),
  lines: buildMetaInfo([
    "startPosition",
    "destinations",
    "strokeStyle",
    "fillStyle",
    "lineWidth"
  ]),
  moveTo: buildMetaInfo(["position"]),
  quadraticCurveTo: buildMetaInfo(["controlPoint", "position"]),
  rectangle: buildMetaInfo([
    "rect",
    "strokeStyle",
    "fillStyle",
    "angle",
    "pivot"
  ]),
  removeDrawCondition: {},
  resetClip: {},
  roundRectangle: buildMetaInfo(["rect", "radius", "strokeStyle", "fillStyle"]),
  selectRect: buildMetaInfo(["body"]),
  selectRoundRect: buildMetaInfo(["rect", "borderRadius"]),
  setConditionalFilter: buildMetaInfo(["condition", "filter"]),
  setContext: buildMetaInfo(["ctx"]),
  setDrawCondition: buildMetaInfo(["condition"]),
  setFillStyle: buildMetaInfo(["fillStyle"]),
  setFilter: buildMetaInfo(["filter"]),
  setFont: buildMetaInfo(["font"]),
  setGlobalCompositeOperation: buildMetaInfo(["newState"]),
  setStrokeStyle: buildMetaInfo(["strokeStyle"]),
  setUnit: buildMetaInfo(["unit"]),
  start: {},
  stroke: {},
  text: buildMetaInfo(["dim", "text", "color", "font"])
};
