import React, { CSSProperties, SVGProps } from 'react';
import { PigeonProps, Point } from '../types';
interface GeoJsonProps extends PigeonProps {
    className?: string;
    data?: any;
    svgAttributes?: any;
    styleCallback?: any;
    hover?: any;
    feature?: any;
    style?: CSSProperties;
    children?: React.ReactNode;
    onClick?: (props: {
        event: React.MouseEvent<Element, MouseEvent>;
        anchor?: Point;
        payload: unknown;
    }) => void;
    onContextMenu?: (props: {
        event: React.MouseEvent<Element, MouseEvent>;
        anchor?: Point;
        payload: unknown;
    }) => void;
    onMouseOver?: (props: {
        event: React.MouseEvent<Element, MouseEvent>;
        anchor?: Point;
        payload: unknown;
    }) => void;
    onMouseOut?: (props: {
        event: React.MouseEvent<Element, MouseEvent>;
        anchor?: Point;
        payload: unknown;
    }) => void;
}
interface GeoJsonLoaderProps extends GeoJsonProps {
    link?: string;
}
interface GeoJsonGeometry {
    type: string;
    coordinates?: [number, number] | Array<[number, number]> | Array<Array<[number, number]>> | Array<Array<Array<[number, number]>>>;
    geometries?: Array<GeoJsonGeometry>;
}
interface GeometryProps {
    coordinates?: [number, number] | Array<[number, number]> | Array<Array<[number, number]>> | Array<Array<Array<[number, number]>>>;
    latLngToPixel?: (latLng: Point, center?: Point, zoom?: number) => Point;
    svgAttributes?: SVGProps<SVGElement>;
    geometry?: GeoJsonGeometry;
}
export declare function PointComponent(props: GeometryProps): JSX.Element;
export declare function MultiPoint(props: GeometryProps): JSX.Element;
export declare function LineString(props: GeometryProps): JSX.Element;
export declare function MultiLineString(props: GeometryProps): JSX.Element;
export declare function Polygon(props: GeometryProps): JSX.Element;
export declare function MultiPolygon(props: GeometryProps): JSX.Element;
export declare function GeometryCollection(props: GeometryProps): JSX.Element | null;
export declare function GeoJsonFeature(props: GeoJsonProps): JSX.Element;
export declare function GeoJson(props: GeoJsonProps): JSX.Element;
export declare function GeoJsonLoader(props: GeoJsonLoaderProps): JSX.Element | null;
export {};
