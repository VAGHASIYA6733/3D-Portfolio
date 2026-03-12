import React, { useMemo, useRef } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

useGLTF.preload('/models/car.glb')

export default function GarageSection() {
  const groupRef = useRef(null)
  const { scene } = useGLTF('/models/car.glb')
  const carScene = useMemo(() => scene.clone(), [scene])

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.85) * 0.08
  })

  return (
    <>
      <group ref={groupRef} position={[-1.4, 0.2, 0.5]}>
        <primitive object={carScene} scale={1.18} />
      </group>
      <OrbitControls enablePan={false} minDistance={4} maxDistance={10} maxPolarAngle={Math.PI / 1.85} />
    </>
  )
}
