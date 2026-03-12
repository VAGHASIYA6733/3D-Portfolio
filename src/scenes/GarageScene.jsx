import React, { useEffect } from 'react'
import { Html, Stars } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import ContactHologram from '../components/ContactHologram'
import GarageSection from '../components/GarageSection'

export default function GarageScene({ onOpenContact, onReturnCorridor }) {
  const { camera } = useThree()

  useEffect(() => {
    gsap.fromTo(
      camera.position,
      { x: 0, y: 1.45, z: 7.5 },
      { x: 0, y: 2.1, z: 7.2, duration: 1.5, ease: 'power2.inOut' },
    )
    camera.lookAt(0, 1.4, 0)
  }, [camera])

  return (
    <group>
      <ambientLight intensity={0.28} color="#112746" />
      <spotLight position={[0, 4.2, 1.5]} angle={0.48} intensity={1.35} color="#eef7ff" penumbra={0.5} />
      <pointLight position={[-3.5, 1.4, 0]} color="#ff6a3d" intensity={1.5} distance={10} />
      <pointLight position={[3.5, 1.4, 0]} color="#2f89ff" intensity={1.6} distance={10} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#050b14" metalness={0.85} roughness={0.15} />
      </mesh>
      <gridHelper args={[14, 20, '#1f5fff', '#10233f']} position={[0, 0, 0]} />

      {[
        { position: [-7, 2, 0], rotation: [0, Math.PI / 2, 0] },
        { position: [7, 2, 0], rotation: [0, -Math.PI / 2, 0] },
        { position: [0, 2, -5], rotation: [0, 0, 0] },
        { position: [0, 4, 0], rotation: [Math.PI / 2, 0, 0] },
      ].map((wall) => (
        <mesh key={wall.position.join(',')} position={wall.position} rotation={wall.rotation}>
          <planeGeometry args={[14, 4]} />
          <meshStandardMaterial color="#08111d" metalness={0.65} roughness={0.7} />
        </mesh>
      ))}

      <mesh position={[0, 2, -4.92]}>
        <planeGeometry args={[4.5, 2.6]} />
        <meshBasicMaterial color="#02060f" transparent opacity={0.45} />
      </mesh>
      <Stars radius={18} depth={20} count={800} factor={3} saturation={0} fade speed={0.2} />

      <GarageSection />
      <ContactHologram position={[2.7, 0.05, 0.35]} onActivate={onOpenContact} onFocusLabel={() => {}} />

      <Html position={[-4.8, 2.4, -4]} distanceFactor={8}>
        <button className="hud-btn" onClick={onReturnCorridor}>
          Return to Corridor
        </button>
      </Html>

      <EffectComposer>
        <Bloom mipmapBlur intensity={0.7} luminanceThreshold={0.38} />
      </EffectComposer>
    </group>
  )
}
