import React, { CSSProperties, SVGProps, useMemo, useEffect, useState } from 'react'
import { PigeonProps, Point } from '../types'

interface GeoJsonProps extends PigeonProps {
  className?: string
  data?: any
  svgAttributes?: any
  styleCallback?: any
  hover?: any
  feature?: any
  style?: CSSProperties
  children?: React.ReactNode

  // callbacks
  onClick?: (props: { event: React.MouseEvent<Element, MouseEvent>; anchor?: Point; payload: unknown }) => void
  onContextMenu?: (props: { event: React.MouseEvent<Element, MouseEvent>; anchor?: Point; payload: unknown }) => void
  onMouseOver?: (props: { event: React.MouseEvent<Element, MouseEvent>; anchor?: Point; payload: unknown }) => void
  onMouseOut?: (props: { event: React.MouseEvent<Element, MouseEvent>; anchor?: Point; payload: unknown }) => void
}

interface GeoJsonLoaderProps extends GeoJsonProps {
  link?: string
}

interface GeoJsonGeometry {
  type: string
  coordinates?:
    | [number, number]
    | Array<[number, number]>
    | Array<Array<[number, number]>>
    | Array<Array<Array<[number, number]>>>
  geometries?: Array<GeoJsonGeometry>
}

interface GeometryProps {
  coordinates?:
    | [number, number]
    | Array<[number, number]>
    | Array<Array<[number, number]>>
    | Array<Array<Array<[number, number]>>>
  latLngToPixel?: (latLng: Point, center?: Point, zoom?: number) => Point
  svgAttributes?: SVGProps<SVGElement>
  geometry?: GeoJsonGeometry
}

const defaultSvgAttributes = { fill: '#93c0d099', strokeWidth: '2', stroke: 'white', r: '30' }

export function PointComponent(props: GeometryProps): JSX.Element {
  const { latLngToPixel } = props
  const [y, x] = props.coordinates as [number, number]
  if (latLngToPixel) {
    const [cx, cy] = latLngToPixel([x, y])
    if (props.svgAttributes?.path) {
      const path = `M${cx},${cy}c${props.svgAttributes.path.split(/[c|C|L|l|v|V|h|H](.*)/s)[1]}`
      return <path d={path} {...(props.svgAttributes as SVGProps<SVGCircleElement>)} />
    }
    return <circle cx={cx} cy={cy} {...(props.svgAttributes as SVGProps<SVGCircleElement>)} />
  } else {
    return <></>
  }
}

export function MultiPoint(props: GeometryProps): JSX.Element {
  return (
    <>
      {props.coordinates?.map((point, i) => {
        if (typeof point == 'number') {
          return <></>
        } else {
          return <PointComponent {...props} coordinates={point} key={i} />
        }
      })}
    </>
  )
}

export function LineString(props: GeometryProps): JSX.Element {
  const { latLngToPixel } = props
  const p =
    'M' +
    (props.coordinates as Array<[number, number]>).reduce((a, [y, x]) => {
      const [v, w] = latLngToPixel?.([x, y]) || [0, 0]
      return a + ' ' + v + ' ' + w
    }, '')

  return <path d={p} {...(props.svgAttributes as SVGProps<SVGPathElement>)} />
}

export function MultiLineString(props: GeometryProps): JSX.Element {
  return (
    <>
      {props.coordinates?.map((line, i) => {
        if (typeof line == 'number') {
          return <></>
        } else {
          return <LineString {...props} coordinates={line} key={i} />
        }
      })}
    </>
  )
}

export function Polygon(props: GeometryProps): JSX.Element {
  const { latLngToPixel } = props
  // GeoJson polygons is a collection of linear rings
  const p = (props.coordinates as Array<Array<[number, number]>>).reduce(
    (a, part) =>
      a +
      ' M' +
      part.reduce((a, [y, x]) => {
        const [v, w] = latLngToPixel?.([x, y]) || [0, 0]
        return a + ' ' + v + ' ' + w
      }, '') +
      'Z',
    ''
  )
  return <path d={p} {...(props.svgAttributes as SVGProps<SVGPathElement>)} />
}

export function MultiPolygon(props: GeometryProps): JSX.Element {
  return (
    <>
      {props.coordinates?.map((polygon, i) => {
        if (typeof polygon == 'number') {
          return <></>
        } else {
          return <Polygon {...props} coordinates={polygon} key={i} />
        }
      })}
    </>
  )
}

export function GeometryCollection(props: GeometryProps) {
  const renderer = {
    Point: PointComponent,
    MultiPoint,
    LineString,
    MultiLineString,
    Polygon,
    MultiPolygon,
  }

  const { type, coordinates, geometries } = props.geometry || {}

  if (type === 'GeometryCollection') {
    return (
      <>
        {geometries?.map((geometry, i) => (
          <GeometryCollection key={i} {...props} geometry={geometry} />
        ))}
      </>
    )
  }

  const Component = renderer[type as keyof typeof renderer]

  if (Component === undefined) {
    console.warn(`The GeoJson Type ${type} is not known`)
    return null
  }
  return (
    <Component
      latLngToPixel={props.latLngToPixel}
      geometry={props.geometry}
      coordinates={coordinates}
      svgAttributes={props.svgAttributes}
    />
  )
}

export function GeoJsonFeature(props: GeoJsonProps): JSX.Element {
  const [internalHover, setInternalHover] = useState(props.hover || false)
  const hover = props.hover !== undefined ? props.hover : internalHover
  const callbackSvgAttributes = props.styleCallback && props.styleCallback(props.feature, hover)
  const svgAttributes = callbackSvgAttributes
    ? props.svgAttributes
      ? { ...props.svgAttributes, ...callbackSvgAttributes }
      : callbackSvgAttributes
    : props.svgAttributes
    ? props.svgAttributes
    : defaultSvgAttributes

  const eventParameters = (event: React.MouseEvent<SVGElement>) => ({
    event,
    anchor: props.anchor,
    payload: props.feature,
  })

  return (
    <g
      clipRule="evenodd"
      style={{ pointerEvents: 'auto' }}
      onClick={props.onClick ? (event) => props.onClick?.(eventParameters(event)) : undefined}
      onContextMenu={props.onContextMenu ? (event) => props.onContextMenu?.(eventParameters(event)) : undefined}
      onMouseOver={(event) => {
        props.onMouseOver && props.onMouseOver(eventParameters(event))
        setInternalHover(true)
      }}
      onMouseOut={(event) => {
        props.onMouseOut && props.onMouseOut(eventParameters(event))
        setInternalHover(false)
      }}
    >
      <GeometryCollection {...props} {...props.feature} svgAttributes={svgAttributes} />
    </g>
  )
}

export function GeoJson(props: GeoJsonProps): JSX.Element {
  const { width, height } = props.mapState || {}

  return (
    <div
      style={{
        position: 'absolute',
        left: '0',
        top: '0',
        pointerEvents: 'none',
        cursor: 'pointer',
        ...(props.style || {}),
      }}
      className={props.className ? `${props.className} pigeon-click-block` : 'pigeon-click-block'}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {props.data &&
          props.data.features.map((feature: unknown, i: React.Key | null | undefined) => (
            <GeoJsonFeature key={i} {...props} feature={feature} />
          ))}

        {React.Children.map(props.children, (child) => {
          if (!child) {
            return null
          }

          if (!React.isValidElement(child)) {
            return child
          }

          return React.cloneElement(child, props)
        })}
      </svg>
    </div>
  )
}

export function GeoJsonLoader(props: GeoJsonLoaderProps) {
  const [data, setData] = useState(props.data ? props.data : null)

  useEffect(() => {
    fetch(props.link || '')
      .then((response) => response.json())
      .then((data) => setData(data))
  }, [props.link])

  return data ? <GeoJson data={data} {...props} /> : null
}
