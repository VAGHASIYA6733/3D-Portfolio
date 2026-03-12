import React, { useState } from 'react'
import { Html } from '@react-three/drei'

const SCREEN_POSITIONS = [
  { position: [2.6, 1.65, 3], title: 'Project 01' },
  { position: [2.6, 1.65, -0.2], title: 'Project 02' },
  { position: [2.6, 1.65, -3.4], title: 'Project 03' },
]

export default function ProjectWalls({ onActivate, onFocusLabel }) {
  const [hoveredIndex, setHoveredIndex] = useState(-1)

  return (
    <group>
      {SCREEN_POSITIONS.map((screen, index) => {
        const hovered = hoveredIndex === index
        return (
          <group
            key={screen.title}
            position={screen.position}
            onPointerEnter={() => {
              setHoveredIndex(index)
              onFocusLabel('[ Projects ]')
            }}
            onPointerLeave={() => {
              setHoveredIndex(-1)
              onFocusLabel('')
            }}
            onClick={onActivate}
          >
            <mesh rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[1.5, 0.95]} />
              <meshStandardMaterial color={hovered ? '#0b1730' : '#07101f'} emissive="#0a3560" emissiveIntensity={hovered ? 1.6 : 0.8} />
            </mesh>
            <mesh rotation={[0, -Math.PI / 2, 0]} position={[0.02, 0, 0]}>
              <planeGeometry args={[1.62, 1.07]} />
              <meshBasicMaterial color="#57eaff" wireframe />
            </mesh>
            <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
              <div className="screen-label">{screen.title}</div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}
