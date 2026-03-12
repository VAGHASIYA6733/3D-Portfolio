import React, { useMemo, useRef } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

useGLTF.preload('/models/spaceship.glb')

function Ship({ scrollProgress }) {
  const groupRef = useRef(null)
  const engineLight = useRef(null)
  const { scene } = useGLTF('/models/spaceship.glb')
  const shipScene = useMemo(() => scene.clone(), [scene])
  const { camera } = useThree()
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.4, -2), [])
  const cameraTarget = useMemo(() => new THREE.Vector3(0, 2, 12), [])

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return
    }

    const time = state.clock.elapsedTime
    const approach = THREE.MathUtils.clamp((scrollProgress - 0.08) / 0.84, 0, 1)

    groupRef.current.position.x = Math.sin(time * 0.55) * 0.4 * (1 - approach)
    groupRef.current.position.y = Math.sin(time * 0.7) * 0.18 * (1 - approach * 0.65)
    groupRef.current.position.z = -2 + Math.sin(time * 0.4) * 0.25 * (1 - approach)
    groupRef.current.rotation.z = Math.sin(time * 0.25) * 0.04 * (1 - approach)
    groupRef.current.rotation.y += delta * (0.14 * (1 - approach) + 0.015)

    if (engineLight.current) {
      engineLight.current.intensity = 2 + Math.sin(time * 4) * 0.45 + (1 - approach) * 1.2
    }

    if (approach < 0.45) {
      cameraTarget.set(0, 2, 12 - approach * 5.5)
      lookTarget.set(0, 0.6, -2)
    } else if (approach < 0.82) {
      const sub = (approach - 0.45) / 0.37
      cameraTarget.set(0, 1.9 + sub * 0.6, 9.5 - sub * 15)
      lookTarget.set(0, 0.8, -2.5 - sub * 5.5)
    } else {
      const sub = (approach - 0.82) / 0.18
      cameraTarget.set(0, 1.55, -5.5 - sub * 5.8)
      lookTarget.set(0, 1.2, -9.5 - sub * 4.5)
    }

    camera.position.lerp(cameraTarget, 0.06)
    camera.lookAt(lookTarget)
  })

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      <primitive object={shipScene} scale={1.85} rotation={[0.1, Math.PI, 0]} />
      <pointLight ref={engineLight} position={[0, -0.2, -3.4]} distance={12} color="#4ef0ff" intensity={2.2} />
      <pointLight position={[0.5, 0.2, -3]} distance={8} color="#ff6f3f" intensity={0.7} />
    </group>
  )
}

export default function SpaceFlight({ scrollProgress }) {
  return (
    <>
      <Ship scrollProgress={scrollProgress} />
      {scrollProgress < 0.08 && (
        <OrbitControls enablePan={false} minDistance={7} maxDistance={18} target={[0, 0.4, -2]} />
      )}
    </>
  )
}
