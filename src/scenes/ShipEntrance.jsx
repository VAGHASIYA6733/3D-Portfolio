import React, { useEffect, useMemo, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'

useGLTF.preload('/models/spaceship-door.glb')

export default function ShipEntrance({ onEnterCorridor }) {
  const { camera } = useThree()
  const doorRef = useRef(null)
  const insideLight = useRef(null)
  const { scene, animations } = useGLTF('/models/spaceship-door.glb')
  const doorScene = useMemo(() => scene.clone(), [scene])
  const { actions } = useAnimations(animations, doorRef)

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

    const lookTarget = new THREE.Vector3(0, 1.3, -16)
    camera.lookAt(lookTarget)

    timeline.to(camera.position, {
      x: 0,
      y: 1.6,
      z: -11,
      duration: 0.9,
      onUpdate: () => camera.lookAt(lookTarget),
    })
    timeline.to(camera.position, { z: -12.2, duration: 0.8, onUpdate: () => camera.lookAt(lookTarget) })
    timeline.add(() => {
      const firstAction = Object.values(actions ?? {})[0]
      if (firstAction) {
        firstAction.reset()
        firstAction.clampWhenFinished = true
        firstAction.setLoop(THREE.LoopOnce, 1)
        firstAction.play()
      } else if (doorRef.current) {
        gsap.to(doorRef.current.rotation, { y: Math.PI / 2, duration: 1.4, ease: 'power2.out' })
      }
    })
    timeline.to(insideLight.current, { intensity: 4.2, duration: 1.1 }, '<0.1')
    timeline.to(camera.position, {
      x: 0,
      y: 1.45,
      z: -20,
      duration: 2.2,
      ease: 'power1.inOut',
      onUpdate: () => camera.lookAt(lookTarget),
      onComplete: onEnterCorridor,
    }, '>-0.1')

    return () => timeline.kill()
  }, [actions, camera, onEnterCorridor])

  return (
    <group>
      <ambientLight intensity={0.18} color="#12223f" />
      <pointLight ref={insideLight} position={[0, 1.7, -16]} distance={12} intensity={1.2} color="#8cd8ff" />
      <group ref={doorRef} position={[0, 0, -14.6]}>
        <primitive object={doorScene} scale={1.45} />
      </group>
      <mesh position={[0, 1.2, -18]}>
        <boxGeometry args={[4.8, 4.2, 5]} />
        <meshBasicMaterial color="#07101c" transparent opacity={0.45} />
      </mesh>
    </group>
  )
}
