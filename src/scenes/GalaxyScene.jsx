import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function StarField({ scrollProgress }) {
  const pointsRef = useRef(null)
  const positions = useMemo(() => {
    const array = new Float32Array(8000 * 3)
    for (let index = 0; index < 8000; index += 1) {
      const radius = 65 + Math.random() * 140
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      array[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
      array[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      array[index * 3 + 2] = radius * Math.cos(phi)
    }
    return array
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current) {
      return
    }
    const speed = 0.015 + (1 - Math.min(scrollProgress * 1.2, 1)) * 0.04
    pointsRef.current.rotation.y += delta * speed
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.08
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#dff7ff" size={0.22} sizeAttenuation transparent opacity={0.9} />
    </points>
  )
}

function GalaxyShell() {
  const texture = useTexture('/textures/galaxy.jpg')
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[280, 48, 48]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}

export default function GalaxyScene({ scrollProgress }) {
  return (
    <group>
      <Environment files="/textures/stars-hdr.hdr" />
      <GalaxyShell />
      <StarField scrollProgress={scrollProgress} />
      <ambientLight intensity={0.45} color="#102040" />
      <directionalLight position={[18, 10, 16]} intensity={1.2} color="#e7f7ff" />
      <pointLight position={[-10, -5, -18]} intensity={0.8} color="#2f7dff" />
    </group>
  )
}
