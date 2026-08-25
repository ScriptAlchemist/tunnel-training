'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'

export type TunnelAxisLabels = {
  title: string
  description: string
  sideToSide: string
  height: string
  forwardBack: string
  dragToRotate: string
  reset: string
  unavailable: string
}

type Axis = 'x' | 'y' | 'z'
type Position = Record<Axis, number>

const initialPosition: Position = { x: 0, y: 0, z: 0 }

function makeLimb(
  start: THREE.Vector3,
  end: THREE.Vector3,
  material: THREE.Material,
  radius = 0.065
) {
  const direction = new THREE.Vector3().subVectors(end, start)
  const limb = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, direction.length(), 12),
    material
  )
  limb.position.copy(new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5))
  limb.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  )
  return limb
}

export function TunnelAxisVisual({ labels }: { labels: TunnelAxisLabels }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetRef = useRef(new THREE.Vector3())
  const [position, setPosition] = useState<Position>(initialPosition)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!root || !stage || !canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    } catch {
      setUnavailable(true)
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const colorProbe = document.createElement('span')
    colorProbe.hidden = true
    root.append(colorProbe)
    const themeColor = (name: string) => {
      colorProbe.style.color = `var(${name})`
      return getComputedStyle(colorProbe).color
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    const structuralMaterial = new THREE.LineBasicMaterial({
      color: themeColor('--border'),
      transparent: true,
      opacity: 0.7,
    })
    const chamberMaterial = new THREE.MeshBasicMaterial({
      color: themeColor('--secondary'),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    })
    const bodyMaterial = new THREE.MeshBasicMaterial({
      color: themeColor('--primary'),
    })
    const jointMaterial = new THREE.MeshBasicMaterial({
      color: themeColor('--primary'),
    })
    const helmetMaterial = new THREE.MeshBasicMaterial({
      color: themeColor('--foreground'),
    })

    const chamberRadius = 2.1
    const chamberHeight = 5.6
    const chamber = new THREE.Mesh(
      new THREE.CylinderGeometry(chamberRadius, chamberRadius, chamberHeight, 48, 1, true),
      chamberMaterial
    )
    scene.add(chamber)

    for (const height of [-2.8, -1.4, 0, 1.4, 2.8]) {
      const points = Array.from({ length: 65 }, (_, index) => {
        const angle = (index / 64) * Math.PI * 2
        return new THREE.Vector3(
          Math.cos(angle) * chamberRadius,
          height,
          Math.sin(angle) * chamberRadius
        )
      })
      scene.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          structuralMaterial
        )
      )
    }

    for (let index = 0; index < 12; index += 1) {
      const angle = (index / 12) * Math.PI * 2
      const x = Math.cos(angle) * chamberRadius
      const z = Math.sin(angle) * chamberRadius
      scene.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, -chamberHeight / 2, z),
            new THREE.Vector3(x, chamberHeight / 2, z),
          ]),
          structuralMaterial
        )
      )
    }

    const axisOrigin = new THREE.Vector3(0, -2.45, 0)
    const axisColors = ['--foreground', '--secondary-foreground', '--accent-foreground']
    const axisArrows = [
      new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), axisOrigin, 1.05, themeColor(axisColors[0]), 0.2, 0.1),
      new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), axisOrigin, 1.05, themeColor(axisColors[1]), 0.2, 0.1),
      new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), axisOrigin, 1.05, themeColor(axisColors[2]), 0.2, 0.1),
    ]
    for (const arrow of axisArrows) scene.add(arrow)

    const figure = new THREE.Group()
    figure.scale.setScalar(0.66)
    scene.add(figure)

    const points = {
      head: new THREE.Vector3(0, 0.5, -1.08),
      neck: new THREE.Vector3(0, 0.34, -0.78),
      chest: new THREE.Vector3(0, 0.18, -0.34),
      pelvis: new THREE.Vector3(0, -0.1, 0.42),
      leftShoulder: new THREE.Vector3(-0.3, 0.22, -0.43),
      rightShoulder: new THREE.Vector3(0.3, 0.22, -0.43),
      leftElbow: new THREE.Vector3(-0.72, 0.2, -0.5),
      rightElbow: new THREE.Vector3(0.72, 0.2, -0.5),
      leftHand: new THREE.Vector3(-0.94, 0.35, -0.88),
      rightHand: new THREE.Vector3(0.94, 0.35, -0.88),
      leftHip: new THREE.Vector3(-0.22, -0.08, 0.5),
      rightHip: new THREE.Vector3(0.22, -0.08, 0.5),
      leftKnee: new THREE.Vector3(-0.55, 0.02, 1.02),
      rightKnee: new THREE.Vector3(0.55, 0.02, 1.02),
      leftFoot: new THREE.Vector3(-0.7, 0.43, 1.46),
      rightFoot: new THREE.Vector3(0.7, 0.43, 1.46),
    }

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 24, 16),
      helmetMaterial
    )
    head.position.copy(points.head)
    head.scale.set(0.94, 1, 1.08)
    figure.add(head)

    const jointGeometry = new THREE.SphereGeometry(0.105, 18, 12)
    for (const key of Object.keys(points) as Array<keyof typeof points>) {
      if (key === 'head') continue
      const joint = new THREE.Mesh(jointGeometry, jointMaterial)
      joint.position.copy(points[key])
      figure.add(joint)
    }

    figure.add(
      makeLimb(points.head, points.neck, bodyMaterial, 0.075),
      makeLimb(points.neck, points.chest, bodyMaterial, 0.1),
      makeLimb(points.chest, points.pelvis, bodyMaterial, 0.13),
      makeLimb(points.leftShoulder, points.rightShoulder, bodyMaterial, 0.09),
      makeLimb(points.leftShoulder, points.leftElbow, bodyMaterial, 0.075),
      makeLimb(points.leftElbow, points.leftHand, bodyMaterial),
      makeLimb(points.rightShoulder, points.rightElbow, bodyMaterial, 0.075),
      makeLimb(points.rightElbow, points.rightHand, bodyMaterial),
      makeLimb(points.leftHip, points.rightHip, bodyMaterial, 0.1),
      makeLimb(points.leftHip, points.leftKnee, bodyMaterial, 0.09),
      makeLimb(points.leftKnee, points.leftFoot, bodyMaterial, 0.075),
      makeLimb(points.rightHip, points.rightKnee, bodyMaterial, 0.09),
      makeLimb(points.rightKnee, points.rightFoot, bodyMaterial, 0.075)
    )

    let yaw = 0.68
    let pitch = 0.34
    let dragging = false
    let pointerId: number | undefined
    let pointerX = 0
    let pointerY = 0
    let frame = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const positionCamera = () => {
      const radius = 9
      camera.position.set(
        Math.sin(yaw) * Math.cos(pitch) * radius,
        Math.sin(pitch) * radius,
        Math.cos(yaw) * Math.cos(pitch) * radius
      )
      camera.lookAt(0, 0, 0)
    }

    const draw = () => {
      if (reducedMotion) figure.position.copy(targetRef.current)
      else figure.position.lerp(targetRef.current, 0.12)
      positionCamera()
      renderer.render(scene, camera)
      frame = window.requestAnimationFrame(draw)
    }

    const resize = () => {
      const width = stage.clientWidth
      const height = stage.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(stage)

    const handlePointerDown = (event: PointerEvent) => {
      dragging = true
      pointerId = event.pointerId
      pointerX = event.clientX
      pointerY = event.clientY
      stage.setPointerCapture(event.pointerId)
    }
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragging) return
      yaw -= (event.clientX - pointerX) * 0.008
      pitch = Math.max(-0.9, Math.min(0.9, pitch + (event.clientY - pointerY) * 0.006))
      pointerX = event.clientX
      pointerY = event.clientY
    }
    const stopDragging = () => {
      dragging = false
      if (pointerId !== undefined && stage.hasPointerCapture(pointerId)) {
        stage.releasePointerCapture(pointerId)
      }
      pointerId = undefined
    }
    stage.addEventListener('pointerdown', handlePointerDown)
    stage.addEventListener('pointermove', handlePointerMove)
    stage.addEventListener('pointerup', stopDragging)
    stage.addEventListener('pointercancel', stopDragging)

    const updateTheme = () => {
      structuralMaterial.color.set(themeColor('--border'))
      chamberMaterial.color.set(themeColor('--secondary'))
      bodyMaterial.color.set(themeColor('--primary'))
      jointMaterial.color.set(themeColor('--primary'))
      helmetMaterial.color.set(themeColor('--foreground'))
      axisArrows.forEach((arrow, index) => arrow.setColor(themeColor(axisColors[index])))
    }
    const themeObserver = new MutationObserver(updateTheme)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    })

    resize()
    draw()

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      stage.removeEventListener('pointerdown', handlePointerDown)
      stage.removeEventListener('pointermove', handlePointerMove)
      stage.removeEventListener('pointerup', stopDragging)
      stage.removeEventListener('pointercancel', stopDragging)
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Line)) return
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      })
      renderer.dispose()
      colorProbe.remove()
    }
  }, [])

  const updatePosition = (axis: Axis, value: number) => {
    const next = { ...position, [axis]: value }
    setPosition(next)
    targetRef.current.set(next.x * 0.0115, next.y * 0.017, next.z * 0.0115)
  }

  const resetPosition = () => {
    setPosition(initialPosition)
    targetRef.current.set(0, 0, 0)
  }

  const controls: Array<{ axis: Axis; label: string }> = [
    { axis: 'x', label: labels.sideToSide },
    { axis: 'y', label: labels.height },
    { axis: 'z', label: labels.forwardBack },
  ]

  return (
    <section ref={rootRef} className="my-8 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground">
      <div className="border-b border-border p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="!m-0 text-xl! sm:text-2xl!">{labels.title}</h2>
            <p className="!mb-0 !mt-2 text-sm leading-6 text-muted-foreground">{labels.description}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={resetPosition}>
            {labels.reset}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 border-b border-border p-5 sm:grid-cols-3 sm:p-6">
        {controls.map(({ axis, label }) => (
          <label key={axis} className="grid gap-2 text-sm font-bold" htmlFor={`tunnel-axis-${axis}`}>
            <span className="flex items-center justify-between gap-3">
              <span>{label}</span>
              <span className="font-mono text-xs text-muted-foreground">{position[axis]}%</span>
            </span>
            <input
              id={`tunnel-axis-${axis}`}
              type="range"
              min="-100"
              max="100"
              step="5"
              value={position[axis]}
              onChange={(event) => updatePosition(axis, Number(event.target.value))}
              className="w-full cursor-pointer accent-primary"
            />
          </label>
        ))}
      </div>

      <div
        ref={stageRef}
        className="relative h-96 cursor-grab touch-none overflow-hidden bg-secondary/15 active:cursor-grabbing sm:h-[30rem]"
        role="img"
        aria-label={`${labels.title}. ${labels.description}`}
      >
        {unavailable ? (
          <p className="grid h-full place-items-center p-8 text-center text-sm text-muted-foreground">
            {labels.unavailable}
          </p>
        ) : (
          <canvas ref={canvasRef} className="block size-full" />
        )}
        <span className="pointer-events-none absolute right-4 bottom-3 rounded-full bg-card/90 px-3 py-1 text-xs font-bold text-muted-foreground">
          {labels.dragToRotate}
        </span>
        <div className="pointer-events-none absolute bottom-3 left-4 flex gap-3 text-xs font-extrabold" aria-hidden="true">
          <span className="text-foreground">X</span>
          <span className="text-secondary-foreground">Y</span>
          <span className="text-accent-foreground">Z</span>
        </div>
      </div>
    </section>
  )
}
