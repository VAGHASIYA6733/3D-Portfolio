import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { portfolioData } from './data/portfolioData'
import GalaxyScene from './scenes/GalaxyScene'
import CinematicFlight from './scenes/CinematicFlight'
import ShipEntrance from './scenes/ShipEntrance'
import CorridorScene from './scenes/CorridorScene'
import GarageScene from './scenes/GarageScene'
import RendezvousScene from './scenes/RendezvousScene'
import {
  CorridorHUD,
  EnterPrompt,
  FlashOverlay,
  InfoPanel,
  MissionOverlay,
  SectionHint,
} from './components/InfoPanel'

export const PHASES = {
  HERO: 'hero',
  FLIGHT: 'flight',
  ENTRY: 'entry',
  CORRIDOR: 'corridor',
  GARAGE: 'garage',
  RENDEZVOUS: 'rendezvous',
  END: 'end',
}

const PANEL_CONTENT = {
  about: {
    side: 'left',
    title: 'Astronaut Profile',
    type: 'about',
  },
  projects: {
    side: 'right',
    title: 'Mission Log // Projects',
    type: 'projects',
  },
  contact: {
    side: 'center',
    title: 'Open Transmission',
    type: 'contact',
  },
}

export default function App() {
  const [phase, setPhase] = useState(PHASES.HERO)
  const [activePanel, setActivePanel] = useState(null)
  const [flashActive, setFlashActive] = useState(false)
  const [sectionHint, setSectionHint] = useState('')

  const openPanel = (name) => setActivePanel(name)
  const closePanel = () => setActivePanel(null)

  const flashAndRun = (callback) => {
    setFlashActive(true)
    window.setTimeout(() => {
      setFlashActive(false)
      callback()
    }, 320)
  }

  const activePanelConfig = activePanel ? PANEL_CONTENT[activePanel] : null

  return (
    <div className="app-shell" style={{ height: '100vh' }}>
      <div className="canvas-wrapper">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true }}
          camera={{ position: [0, 2, 12], fov: 55, near: 0.1, far: 1000 }}
        >
          <color attach="background" args={['#02040b']} />
          <Suspense fallback={null}>
            {phase === PHASES.HERO && <GalaxyScene scrollProgress={1} />}

            {phase === PHASES.FLIGHT && (
              <>
                <GalaxyScene scrollProgress={0.9} />
                <CinematicFlight />
              </>
            )}

            {phase === PHASES.ENTRY && (
              <ShipEntrance onEnterCorridor={() => flashAndRun(() => setPhase(PHASES.CORRIDOR))} />
            )}

            {phase === PHASES.CORRIDOR && (
              <CorridorScene
                onOpenAbout={() => openPanel('about')}
                onOpenProjects={() => openPanel('projects')}
                onOpenContact={() => openPanel('contact')}
                onGoGarage={() => flashAndRun(() => setPhase(PHASES.GARAGE))}
                onFocusLabel={setSectionHint}
              />
            )}

            {phase === PHASES.GARAGE && (
              <GarageScene
                onOpenContact={() => openPanel('contact')}
                onReturnCorridor={() => flashAndRun(() => setPhase(PHASES.CORRIDOR))}
              />
            )}

            {phase === PHASES.RENDEZVOUS && (
              <>
                <GalaxyScene scrollProgress={0.65} />
                <RendezvousScene onComplete={() => flashAndRun(() => setPhase(PHASES.END))} />
              </>
            )}
          </Suspense>
        </Canvas>
      </div>

      <MissionOverlay visible={phase === PHASES.HERO} data={portfolioData} />
      <EnterPrompt
        visible={phase === PHASES.HERO}
        label="Next"
        caption="Initiate launch sequence."
        onClick={() => setPhase(PHASES.FLIGHT)}
      />
      <EnterPrompt
        visible={phase === PHASES.FLIGHT}
        position="right"
        label="Next"
        caption="Approach the airlock."
        onClick={() => setPhase(PHASES.ENTRY)}
      />
      <CorridorHUD phase={phase} onReturnCorridor={() => flashAndRun(() => setPhase(PHASES.CORRIDOR))} />
      <SectionHint text={sectionHint} visible={phase === PHASES.CORRIDOR && !activePanel && Boolean(sectionHint)} />
      <FlashOverlay active={flashActive} />

      <EnterPrompt
        visible={phase === PHASES.CORRIDOR && !activePanel}
        position="bottom-right"
        label="Next"
        caption="Return to orbit."
        onClick={() => flashAndRun(() => setPhase(PHASES.RENDEZVOUS))}
      />

      <div className={`end-screen${phase === PHASES.END ? ' visible' : ''}`} />

      {activePanelConfig && (
        <InfoPanel
          side={activePanelConfig.side}
          title={activePanelConfig.title}
          type={activePanelConfig.type}
          data={portfolioData}
          isOpen={Boolean(activePanel)}
          onClose={closePanel}
        />
      )}

      <Loader
        containerStyles={{ background: 'rgba(2, 4, 11, 0.92)' }}
        innerStyles={{ width: 240, height: 4 }}
        barStyles={{ background: '#58f3ff' }}
        dataStyles={{
          color: '#d8f7ff',
          fontFamily: 'Orbitron, sans-serif',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
        dataInterpolation={(p) => `Streaming systems ${p.toFixed(0)}%`}
      />
    </div>
  )
}
