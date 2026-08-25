'use client'

import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, RoundedBox } from '@react-three/drei'
import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { HumanoidContent } from '@/lib/course'

const jointIds = [
  'chest',
  'neck',
  'leftShoulder',
  'leftElbow',
  'leftWrist',
  'rightShoulder',
  'rightElbow',
  'rightWrist',
  'leftHip',
  'leftKnee',
  'leftAnkle',
  'rightHip',
  'rightKnee',
  'rightAnkle',
] as const

type JointId = (typeof jointIds)[number]
type Axis = 'x' | 'y' | 'z'
type Rotation = Record<Axis, number>
type JointRotations = Record<JointId, Rotation>

const zeroRotation = (): Rotation => ({ x: 0, y: 0, z: 0 })

const initialJointRotations = (): JointRotations =>
  Object.fromEntries(jointIds.map((id) => [id, zeroRotation()])) as JointRotations

const toRadians = ({ x, y, z }: Rotation): [number, number, number] => [
  (x * Math.PI) / 180,
  (y * Math.PI) / 180,
  (z * Math.PI) / 180,
]

function RotationControls({
  value,
  onChange,
  axes,
}: {
  value: Rotation
  onChange: (axis: Axis, value: number) => void
  axes: HumanoidContent['axes']
}) {
  return (
    <div className="grid gap-4">
      {(['x', 'y', 'z'] as const).map((axis) => (
        <label key={axis} className="grid gap-2">
          <span className="flex items-center justify-between gap-4 text-sm font-bold">
            <span>{axes[axis]}</span>
            <output className="min-w-14 text-right font-mono text-xs text-muted-foreground">
              {value[axis]}°
            </output>
          </span>
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={value[axis]}
            onChange={(event) => onChange(axis, Number(event.target.value))}
            className="h-2 w-full cursor-pointer accent-primary"
          />
        </label>
      ))}
    </div>
  )
}

function LimbSegment({ length, radius }: { length: number; radius: number }) {
  return (
    <mesh position={[0, -length / 2, 0]} castShadow>
      <capsuleGeometry args={[radius, Math.max(0.01, length - radius * 2), 8, 16]} />
      <meshStandardMaterial color="#f2eee5" roughness={0.72} />
    </mesh>
  )
}

function JointMarker({
  id,
  activeJoint,
  onSelect,
}: {
  id: JointId
  activeJoint: JointId
  onSelect: (id: JointId) => void
}) {
  const active = id === activeJoint

  const selectJoint = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect(id)
  }

  return (
    <mesh
      onClick={selectJoint}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = ''
      }}
      scale={active ? 1.22 : 1}
      castShadow
    >
      <sphereGeometry args={[0.115, 20, 20]} />
      <meshStandardMaterial
        color={active ? '#ff8064' : '#55b9db'}
        emissive={active ? '#6d1f10' : '#102e38'}
        emissiveIntensity={active ? 0.35 : 0.12}
        roughness={0.5}
      />
    </mesh>
  )
}

function Hand({ side }: { side: -1 | 1 }) {
  return (
    <group>
      <RoundedBox args={[0.24, 0.36, 0.15]} radius={0.07} smoothness={3} position={[0, -0.2, 0]} castShadow>
        <meshStandardMaterial color="#f2eee5" roughness={0.72} />
      </RoundedBox>
      <mesh
        position={[side * 0.15, -0.16, 0]}
        rotation={[0, 0, side * 0.48]}
        castShadow
      >
        <capsuleGeometry args={[0.045, 0.12, 6, 12]} />
        <meshStandardMaterial color="#f2eee5" roughness={0.72} />
      </mesh>
    </group>
  )
}

function Foot() {
  return (
    <RoundedBox args={[0.34, 0.18, 0.58]} radius={0.08} smoothness={3} position={[0, -0.1, 0.19]} castShadow>
      <meshStandardMaterial color="#f2eee5" roughness={0.72} />
    </RoundedBox>
  )
}

function Arm({
  side,
  joints,
  activeJoint,
  onSelect,
}: {
  side: -1 | 1
  joints: JointRotations
  activeJoint: JointId
  onSelect: (id: JointId) => void
}) {
  const shoulder: JointId = side === -1 ? 'leftShoulder' : 'rightShoulder'
  const elbow: JointId = side === -1 ? 'leftElbow' : 'rightElbow'
  const wrist: JointId = side === -1 ? 'leftWrist' : 'rightWrist'

  return (
    <group position={[side * 0.68, 1.18, 0]} rotation={toRadians(joints[shoulder])}>
      <JointMarker id={shoulder} activeJoint={activeJoint} onSelect={onSelect} />
      <LimbSegment length={0.72} radius={0.12} />
      <group position={[0, -0.72, 0]} rotation={toRadians(joints[elbow])}>
        <JointMarker id={elbow} activeJoint={activeJoint} onSelect={onSelect} />
        <LimbSegment length={0.64} radius={0.105} />
        <group position={[0, -0.64, 0]} rotation={toRadians(joints[wrist])}>
          <JointMarker id={wrist} activeJoint={activeJoint} onSelect={onSelect} />
          <Hand side={side} />
        </group>
      </group>
    </group>
  )
}

function Leg({
  side,
  joints,
  activeJoint,
  onSelect,
}: {
  side: -1 | 1
  joints: JointRotations
  activeJoint: JointId
  onSelect: (id: JointId) => void
}) {
  const hip: JointId = side === -1 ? 'leftHip' : 'rightHip'
  const knee: JointId = side === -1 ? 'leftKnee' : 'rightKnee'
  const ankle: JointId = side === -1 ? 'leftAnkle' : 'rightAnkle'

  return (
    <group position={[side * 0.28, -0.14, 0]} rotation={toRadians(joints[hip])}>
      <JointMarker id={hip} activeJoint={activeJoint} onSelect={onSelect} />
      <LimbSegment length={0.86} radius={0.15} />
      <group position={[0, -0.86, 0]} rotation={toRadians(joints[knee])}>
        <JointMarker id={knee} activeJoint={activeJoint} onSelect={onSelect} />
        <LimbSegment length={0.78} radius={0.125} />
        <group position={[0, -0.78, 0]} rotation={toRadians(joints[ankle])}>
          <JointMarker id={ankle} activeJoint={activeJoint} onSelect={onSelect} />
          <Foot />
        </group>
      </group>
    </group>
  )
}

function HumanoidRig({
  bodyRotation,
  joints,
  activeJoint,
  onSelect,
}: {
  bodyRotation: Rotation
  joints: JointRotations
  activeJoint: JointId
  onSelect: (id: JointId) => void
}) {
  return (
    <group position={[0, 0.35, 0]} rotation={toRadians(bodyRotation)}>
      <RoundedBox args={[0.86, 0.46, 0.48]} radius={0.18} smoothness={4} castShadow>
        <meshStandardMaterial color="#e9e2d7" roughness={0.72} />
      </RoundedBox>

      <group position={[0, 0.22, 0]} rotation={toRadians(joints.chest)}>
        <JointMarker id="chest" activeJoint={activeJoint} onSelect={onSelect} />
        <RoundedBox args={[1.12, 1.18, 0.5]} radius={0.24} smoothness={4} position={[0, 0.62, 0]} castShadow>
          <meshStandardMaterial color="#e9e2d7" roughness={0.72} />
        </RoundedBox>

        <group position={[0, 1.32, 0]} rotation={toRadians(joints.neck)}>
          <JointMarker id="neck" activeJoint={activeJoint} onSelect={onSelect} />
          <mesh position={[0, 0.38, 0]} scale={[0.82, 1, 0.88]} castShadow>
            <sphereGeometry args={[0.31, 28, 28]} />
            <meshStandardMaterial color="#f2eee5" roughness={0.72} />
          </mesh>
        </group>

        <Arm side={-1} joints={joints} activeJoint={activeJoint} onSelect={onSelect} />
        <Arm side={1} joints={joints} activeJoint={activeJoint} onSelect={onSelect} />
      </group>

      <Leg side={-1} joints={joints} activeJoint={activeJoint} onSelect={onSelect} />
      <Leg side={1} joints={joints} activeJoint={activeJoint} onSelect={onSelect} />
    </group>
  )
}

function HumanoidScene({
  bodyRotation,
  joints,
  activeJoint,
  onSelect,
}: {
  bodyRotation: Rotation
  joints: JointRotations
  activeJoint: JointId
  onSelect: (id: JointId) => void
}) {
  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} castShadow />
      <directionalLight position={[-4, 1, -3]} intensity={0.75} color="#8edcf4" />
      <HumanoidRig
        bodyRotation={bodyRotation}
        joints={joints}
        activeJoint={activeJoint}
        onSelect={onSelect}
      />
      <gridHelper args={[7, 14, '#55b9db', '#667073']} position={[0, -1.7, 0]} />
      <mesh position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7, 7]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={3.6}
        maxDistance={8}
        target={[0, 0.2, 0]}
      />
    </>
  )
}

export function HumanoidEditor({ content }: { content: HumanoidContent }) {
  const [bodyRotation, setBodyRotation] = useState<Rotation>(zeroRotation)
  const [jointRotations, setJointRotations] = useState<JointRotations>(initialJointRotations)
  const [activeJoint, setActiveJoint] = useState<JointId>('chest')

  const resetPose = () => {
    setBodyRotation(zeroRotation())
    setJointRotations(initialJointRotations())
    setActiveJoint('chest')
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)]">
      <section className="panel overflow-hidden rounded-[2rem]" aria-label={content.viewportLabel}>
        <div className="h-[31rem] min-h-[28rem] w-full sm:h-[39rem]">
          <Canvas
            shadows
            dpr={[1, 1.75]}
            camera={{ position: [4.4, 2.3, 5.2], fov: 38, near: 0.1, far: 100 }}
          >
            <HumanoidScene
              bodyRotation={bodyRotation}
              joints={jointRotations}
              activeJoint={activeJoint}
              onSelect={setActiveJoint}
            />
          </Canvas>
        </div>
        <p className="border-t border-border px-5 py-4 text-sm leading-6 text-muted-foreground sm:px-7">
          {content.instructions}
        </p>
      </section>

      <aside className="panel rounded-[2rem] p-6 sm:p-7">
        <section>
          <h2 className="display-type text-xl font-black">{content.bodyTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.bodyDescription}</p>
          <div className="mt-5">
            <RotationControls
              value={bodyRotation}
              axes={content.axes}
              onChange={(axis, value) =>
                setBodyRotation((current) => ({ ...current, [axis]: value }))
              }
            />
          </div>
        </section>

        <div className="my-7 h-px bg-border" />

        <section>
          <h2 className="display-type text-xl font-black">{content.jointTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.jointDescription}</p>
          <label className="mt-5 grid gap-2 text-sm font-bold">
            <span>{content.jointSelect}</span>
            <select
              value={activeJoint}
              onChange={(event) => setActiveJoint(event.target.value as JointId)}
              className="h-11 rounded-xl border border-input bg-background px-3 text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
            >
              {jointIds.map((id) => (
                <option key={id} value={id}>
                  {content.joints[id]}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-5">
            <RotationControls
              value={jointRotations[activeJoint]}
              axes={content.axes}
              onChange={(axis, value) =>
                setJointRotations((current) => ({
                  ...current,
                  [activeJoint]: { ...current[activeJoint], [axis]: value },
                }))
              }
            />
          </div>
        </section>

        <Button type="button" variant="outline" className="mt-7 w-full rounded-full" onClick={resetPose}>
          <RotateCcw />
          {content.resetButton}
        </Button>
      </aside>
    </div>
  )
}
