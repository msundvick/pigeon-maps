import React, { useEffect, useRef, useState } from 'react'
import { PigeonProps, Point } from '../types'

function isDescendentOf(element: EventTarget | null, ancestor: HTMLDivElement | undefined | null) {
  while (element) {
    if (element === ancestor) {
      return true
    }
    element = (element as any).parentElement
  }

  return false
}

interface DraggableProps extends PigeonProps {
  className?: string
  style?: React.CSSProperties

  children?: React.ReactNode

  onDragStart?: (anchor?: Point) => void
  onDragMove?: (anchor?: Point) => void
  onDragEnd?: (anchor?: Point) => void
}

interface DraggableState {
  isDragging: boolean
  startX?: number
  startY?: number
  startLeft?: number
  startTop?: number
  deltaX: number
  deltaY: number
}

const defaultState: DraggableState = {
  isDragging: false,
  startX: undefined,
  startY: undefined,
  startLeft: undefined,
  startTop: undefined,
  deltaX: 0,
  deltaY: 0,
}

export function Draggable(props: DraggableProps): JSX.Element {
  const dragRef = useRef<HTMLDivElement>(null)
  const propsRef = useRef<DraggableProps>(props)
  const stateRef = useRef({ ...defaultState })
  const [_state, _setState] = useState(defaultState)

  propsRef.current = props

  const setState = (stateUpdate: Partial<DraggableState>): void => {
    const newState = { ...stateRef.current, ...stateUpdate }
    stateRef.current = newState
    _setState(newState)
  }

  const { mouseEvents, touchEvents } = props.mapProps || {}

  useEffect(() => {
    const handleDragStart = (event: MouseEvent | TouchEvent) => {
      if (isDescendentOf(event.target, dragRef.current)) {
        event.preventDefault()

        setState({
          isDragging: true,
          startX: ('touches' in event ? event.touches[0] : event).clientX,
          startY: ('touches' in event ? event.touches[0] : event).clientY,
          startLeft: propsRef.current.left,
          startTop: propsRef.current.top,
          deltaX: 0,
          deltaY: 0,
        })

        if (propsRef.current.onDragStart) {
          const { left, top, offset, pixelToLatLng } = propsRef.current
          propsRef.current.onDragMove?.(
            pixelToLatLng?.([(left || 0) + (offset ? offset[0] : 0), (top || 0) + (offset ? offset[1] : 0)])
          )
        }
      }
    }

    const handleDragMove = (event: MouseEvent | TouchEvent) => {
      if (!stateRef.current.isDragging) {
        return
      }

      event.preventDefault()

      const x = ('touches' in event ? event.touches[0] : event).clientX
      const y = ('touches' in event ? event.touches[0] : event).clientY

      const deltaX = x - (stateRef.current.startX || 0)
      const deltaY = y - (stateRef.current.startY || 0)

      setState({ deltaX, deltaY })

      if (propsRef.current.onDragMove) {
        const { offset, pixelToLatLng } = propsRef.current
        const { startLeft, startTop } = stateRef.current

        propsRef.current.onDragMove(
          pixelToLatLng?.([
            (startLeft || 0) + deltaX + (offset ? offset[0] : 0),
            (startTop || 0) + deltaY + (offset ? offset[1] : 0),
          ])
        )
      }
    }

    const handleDragEnd = (event: MouseEvent | TouchEvent) => {
      if (!stateRef.current.isDragging) {
        return
      }

      event.preventDefault()

      const { offset, pixelToLatLng } = propsRef.current
      const { deltaX, deltaY, startLeft, startTop } = stateRef.current

      propsRef.current.onDragEnd?.(
        pixelToLatLng?.([
          (startLeft || 0) + deltaX + (offset ? offset[0] : 0),
          (startTop || 0) + deltaY + (offset ? offset[1] : 0),
        ])
      )

      setState({
        isDragging: false,
        startX: undefined,
        startY: undefined,
        startLeft: undefined,
        startTop: undefined,
        deltaX: 0,
        deltaY: 0,
      })
    }

    if (mouseEvents) {
      window.addEventListener('mousedown', handleDragStart)
      window.addEventListener('mousedown', handleDragStart)
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
    }

    if (touchEvents) {
      window.addEventListener('touchstart', handleDragStart, { passive: false })
      window.addEventListener('touchmove', handleDragMove, { passive: false })
      window.addEventListener('touchend', handleDragEnd, { passive: false })
    }

    return () => {
      if (mouseEvents) {
        window.removeEventListener('mousedown', handleDragStart)
        window.removeEventListener('mousemove', handleDragMove)
        window.removeEventListener('mouseup', handleDragEnd)
      }

      if (touchEvents) {
        window.removeEventListener('touchstart', handleDragStart)
        window.removeEventListener('touchmove', handleDragMove)
        window.removeEventListener('touchend', handleDragEnd)
      }
    }
  }, [mouseEvents, touchEvents])

  const { left, top, className, style } = props
  const { deltaX, deltaY, startLeft, startTop, isDragging } = _state

  return (
    <div
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        ...(style || {}),
        position: 'absolute',
        // eslint-disable-next-line prettier/prettier
        transform: `translate(${isDragging ? (startLeft || 0) + deltaX : left}px, ${isDragging ? (startTop || 0) + deltaY : top
          // eslint-disable-next-line prettier/prettier
          }px)`,
      }}
      ref={dragRef}
      className={`pigeon-drag-block${className ? ` ${className}` : ''}`}
    >
      {props.children}
    </div>
  )
}
