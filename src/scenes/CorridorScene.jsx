import React, { useEffect, useMemo, useRef } from 'react'
import { Html, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import gsap from 'gsap'
import * as THREE from 'three'
import HelmetSection from '../components/HelmetSection'
import ProjectWalls from '../components/ProjectWalls'
import ContactHologram from '../components/ContactHologram'

useGLTF.preload('/models/corridor.glb')

function GarageAccess({ onActivate, onFocusLabel }) {
  return (
    <group
      position={[0, 1.5, -11.8]}
      onPointerEnter={() => onFocusLabel('[ Garage Access ]')}
      onPointerLeave={() => onFocusLabel('')}
      onClick={onActivate}
    >
      <mesh>
        <planeGeometry args={[3.4, 3.8]} />
        <meshStandardMaterial color="#081120" emissive="#09192e" emissiveIntensity={0.65} metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[3.58, 3.98]} />
        <meshBasicMaterial color="#ff8d4d" wireframe />
      </mesh>
      <Html center position={[0, -2.7, 0]} distanceFactor={9} style={{ pointerEvents: 'none' }}>
        <div className="floating-label">[ Garage Access ]</div>
      </Html>
    </group>
  )
}

export default function CorridorScene({
  onOpenAbout,
  onOpenProjects,
  onOpenContact,
  onGoGarage,
  onFocusLabel,
}) {
  const { camera } = useThree()
  const scrollTarget = useRef(7.5)
  const { scene } = useGLTF('/models/corridor.glb')
  const corridorScene = useMemo(() => scene.clone(), [scene])

  useEffect(() => {
    gsap.set(camera.position, { x: 0, y: 1.45, z: 8 })
    camera.lookAt(0, 1.4, -8)

    const handleWheel = (event) => {
      scrollTarget.current = THREE.MathUtils.clamp(scrollTarget.current + event.deltaY * 0.01, -11.4, 8)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [camera])

  useFrame((state, delta) => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, scrollTarget.current, delta * 3.4)
    camera.position.y = 1.42 + Math.sin(state.clock.elapsedTime * 2.1) * 0.03
    camera.lookAt(0, 1.4, camera.position.z - 12)
  })

  return (
    <group>
      <fog attach="fog" args={['#030712', 10, 26]} />
      <ambientLight color="#16305d" intensity={0.34} />
      {[2, -1, -4, -7, -10].map((z) => (
        <pointLight key={z} position={[0, 2.7, z]} color="#4c88ff" intensity={0.9} distance={6} />
      ))}

      <primitive object={corridorScene} scale={1} />

      <HelmetSection onActivate={onOpenAbout} onFocusLabel={onFocusLabel} />
      <ProjectWalls onActivate={onOpenProjects} onFocusLabel={onFocusLabel} />
      <ContactHologram onActivate={onOpenContact} onFocusLabel={onFocusLabel} />
      <GarageAccess onActivate={onGoGarage} onFocusLabel={onFocusLabel} />

      <EffectComposer>
        <Bloom mipmapBlur intensity={0.55} luminanceThreshold={0.4} />
      </EffectComposer>
    </group>
  )
}
