import React, { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/spaceship.glb')

function SpeedLines({ count = 220 }) {
  const meshRef = useRef(null)
  const { camera } = useThree()

  const data = useMemo(() => {
    const items = []
    for (let i = 0; i < count; i += 1) {
      items.push({
        x: (Math.random() - 0.5) * 12,
        y: (Math.random() - 0.5) * 7,
        z: -Math.random() * 80,
        scale: 0.8 + Math.random() * 2.2,
        speed: 26 + Math.random() * 38,
      })
    }
    return items
  }, [count])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    camera.position.lerp(new THREE.Vector3(0, 0.9, 6.2), 0.06)
    camera.lookAt(0, 0.7, 0)

    for (let i = 0; i < data.length; i += 1) {
      const item = data[i]
      item.z += item.speed * delta
      if (item.z > 6) {
        item.z = -80 - Math.random() * 60
        item.x = (Math.random() - 0.5) * 12
        item.y = (Math.random() - 0.5) * 7
        item.scale = 0.8 + Math.random() * 2.2
        item.speed = 26 + Math.random() * 38
      }

      const m = new THREE.Matrix4()
      m.compose(
        new THREE.Vector3(item.x, item.y, item.z),
        new THREE.Quaternion(),
        new THREE.Vector3(0.06, 0.06 * item.scale, 2.4 * item.scale),
      )
      meshRef.current.setMatrixAt(i, m)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color="#c8f5ff"
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  )
}

function ShipCenterpiece() {
  const groupRef = useRef(null)
  const engineLight = useRef(null)
  const { scene } = useGLTF('/models/spaceship.glb')
  const shipScene = useMemo(() => scene.clone(), [scene])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y += delta * 0.18
    groupRef.current.rotation.z = Math.sin(t * 0.6) * 0.03
    groupRef.current.position.y = 0.2 + Math.sin(t * 1.1) * 0.07
    groupRef.current.position.x = Math.sin(t * 0.9) * 0.06

    if (engineLight.current) {
      engineLight.current.intensity = 2.2 + Math.sin(t * 6) * 0.55
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      <primitive object={shipScene} scale={0.85} rotation={[0.08, Math.PI, 0]} />
      <pointLight ref={engineLight} position={[0, -0.15, -1.55]} distance={10} color="#4ef0ff" intensity={2.2} />
      <pointLight position={[0.45, 0.25, -1.1]} distance={7} color="#ff6f3f" intensity={0.65} />
    </group>
  )
}

export default function CinematicFlight() {
  return (
    <group>
      <ambientLight intensity={0.25} color="#102040" />
      <SpeedLines />
      <ShipCenterpiece />
    </group>
  )
}

