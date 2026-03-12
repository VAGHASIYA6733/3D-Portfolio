import React, { useMemo, useRef, useState } from 'react'
import { Html, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

useGLTF.preload('/models/helmet.glb')

export default function HelmetSection({ onActivate, onFocusLabel }) {
  const [hovered, setHovered] = useState(false)
  const rootRef = useRef(null)
  const { scene } = useGLTF('/models/helmet.glb')
  const helmetScene = useMemo(() => scene.clone(), [scene])

  useFrame(() => {
    if (!rootRef.current) {
      return
    }
    rootRef.current.rotation.y += 0.01
    const targetScale = hovered ? 0.7 : 0.64
    rootRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08)
  })

  return (
    <group
      position={[-2.8, 1.3, 3]}
      onPointerEnter={() => {
        setHovered(true)
        onFocusLabel('[ About Me ]')
      }}
      onPointerLeave={() => {
        setHovered(false)
        onFocusLabel('')
      }}
      onClick={onActivate}
    >
      <primitive ref={rootRef} object={helmetScene} />
      <pointLight position={[0, 0.2, 0]} color="#5ee7ff" intensity={hovered ? 2.2 : 1.2} distance={4} />
      {hovered && (
        <Html center position={[0, 1.35, 0]} distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div className="floating-label">[ About Me ]</div>
        </Html>
      )}
    </group>
  )
}
