import React, { useMemo, useState } from 'react'
import { Html, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

useGLTF.preload('/models/hologram.glb')

export default function ContactHologram({ position = [0, 0.15, -8], onActivate, onFocusLabel }) {
  const [hovered, setHovered] = useState(false)
  const { scene } = useGLTF('/models/hologram.glb')
  const hologramScene = useMemo(() => scene.clone(), [scene])

  useFrame(() => {
    hologramScene.rotation.y += 0.01
  })

  return (
    <group
      position={position}
      onPointerEnter={() => {
        setHovered(true)
        onFocusLabel('[ Contact ]')
      }}
      onPointerLeave={() => {
        setHovered(false)
        onFocusLabel('')
      }}
      onClick={onActivate}
    >
      <primitive object={hologramScene} scale={0.62} />
      <pointLight position={[0, 0.9, 0]} color="#46f6ff" intensity={hovered ? 2.2 : 1.1} distance={5} />
      {hovered && (
        <Html center position={[0, 1.55, 0]} distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div className="floating-label">[ Contact ]</div>
        </Html>
      )}
    </group>
  )
}
