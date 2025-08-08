import React from 'react';
import { PigeonProps, Point } from '../types';
interface MarkerProps extends PigeonProps {
    color?: string;
    payload?: unknown;
    width?: number;
    height?: number;
    hover?: boolean;
    style?: React.CSSProperties;
    className?: string;
    children?: JSX.Element;
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
export declare function Marker(props: MarkerProps): JSX.Element;
export {};
