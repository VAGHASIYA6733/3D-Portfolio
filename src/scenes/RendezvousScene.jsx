import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/spaceship.glb')
useGLTF.preload('/models/mothership.glb')

function SceneShips({ onMeet }) {
  const shipRef = useRef(null)
  const mothershipRef = useRef(null)
  const metRef = useRef(false)

  const { scene: shipSceneRaw } = useGLTF('/models/spaceship.glb')
  const { scene: mothershipSceneRaw } = useGLTF('/models/mothership.glb')

  const shipScene = useMemo(() => shipSceneRaw.clone(), [shipSceneRaw])
  const mothershipScene = useMemo(() => mothershipSceneRaw.clone(), [mothershipSceneRaw])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const ship = shipRef.current
    const mother = mothershipRef.current
    if (!ship || !mother) return

    // Ship approaches from camera side; mothership approaches from deep space.
    ship.position.z = THREE.MathUtils.lerp(ship.position.z, -6.8, delta * 0.75)
    ship.position.x = Math.sin(t * 0.5) * 0.35
    ship.position.y = 0.6 + Math.sin(t * 0.7) * 0.16
    ship.rotation.y += delta * 0.18

    mother.position.z = THREE.MathUtils.lerp(mother.position.z, -10.5, delta * 0.35)
    mother.position.x = THREE.MathUtils.lerp(mother.position.x, 0, delta * 0.25)
    mother.position.y = THREE.MathUtils.lerp(mother.position.y, 0.25, delta * 0.25)
    mother.rotation.y += delta * 0.03

    const distance = ship.position.distanceTo(mother.position)
    if (!metRef.current && distance < 3.6) {
      metRef.current = true
      onMeet?.()
    }
  })

  return (
    <group>
      <group ref={shipRef} position={[0, 0.6, 2]} rotation={[0.08, Math.PI, 0]} scale={0.85}>
        <primitive object={shipScene} />
        <pointLight position={[0, -0.2, -1.55]} distance={10} color="#4ef0ff" intensity={2.2} />
      </group>

      <group ref={mothershipRef} position={[0, 0.25, -40]} rotation={[0.02, 0, 0]} scale={2.1}>
        <primitive object={mothershipScene} />
        <pointLight position={[0, 2.2, 6]} distance={30} color="#8cd8ff" intensity={1.1} />
      </group>
    </group>
  )
}

export default function RendezvousScene({ onComplete }) {
  const completedRef = useRef(false)

  return (
    <group>
      <fog attach="fog" args={['#02040b', 8, 70]} />
      <ambientLight intensity={0.28} color="#0d1b38" />
      <directionalLight position={[12, 10, 10]} intensity={1} color="#e7f7ff" />

      <SceneShips
        onMeet={() => {
          if (completedRef.current) return
          completedRef.current = true
          onComplete?.()
        }}
      />
    </group>
  )
}

