import React, { useEffect } from 'react'

export function MissionOverlay({ data, visible }) {
  return (
    <div className={`mission-overlay${visible ? ' visible' : ''}`}>
      <h1 className="mission-name">{data.name}</h1>
      <div className="mission-vessel">Exploration Vessel: {data.vesselName}</div>
      <div className="mission-title">{data.title}</div>
    </div>
  )
}

export function ProgressDots({ progress, visible }) {
  const steps = [0.06, 0.25, 0.5, 0.75, 0.9]
  return (
    <div className={`progress-dots${visible ? ' visible' : ''}`}>
      {steps.map((step) => (
        <span key={step} className={`progress-dot${progress >= step ? ' active' : ''}`} />
      ))}
    </div>
  )
}

export function EnterPrompt({
  visible,
  onClick,
  position = 'bottom',
  label = 'Next',
  caption = 'Continue mission sequence.',
}) {
  return (
    <div className={`enter-prompt ${position}${visible ? ' visible' : ''}`}>
      <button className="enter-prompt-btn" onClick={onClick}>
        {label}
      </button>
      <span className="enter-prompt-caption">{caption}</span>
    </div>
  )
}

export function CorridorHUD({ phase, onReturnCorridor }) {
  const visible = phase === 'corridor' || phase === 'garage'
  const title = phase === 'garage' ? 'Hangar Bay' : phase === 'corridor' ? 'Main Corridor' : ''

  return (
    <>
      <div className={`room-label${visible ? ' visible' : ''}`}>
        <span className="room-label-tag">Location</span>
        <strong className="room-label-name">{title}</strong>
      </div>
      {phase === 'garage' && (
        <div className="corridor-hud visible">
          <button className="hud-btn" onClick={onReturnCorridor}>
            Return to Corridor
          </button>
        </div>
      )}
    </>
  )
}

export function SectionHint({ text, visible }) {
  return <div className={`section-hint${visible ? ' visible' : ''}`}>{text}</div>
}

export function FlashOverlay({ active }) {
  return <div className={`flash-overlay${active ? ' active' : ''}`} />
}

export function InfoPanel({ side, isOpen, onClose, title, type, data }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  return (
    <div className={`info-panel ${side}${isOpen ? ' open' : ''}`}>
      <div className="panel-header">
        <div>
          <div className="panel-label">Portfolio Section</div>
          <h2 className="panel-title">{title}</h2>
        </div>
        <button className="panel-close" onClick={onClose} aria-label="Close panel">
          x
        </button>
      </div>

      {type === 'about' && <AboutContent data={data} />}
      {type === 'projects' && <ProjectsContent data={data} />}
      {type === 'contact' && <ContactContent data={data} />}
    </div>
  )
}

function AboutContent({ data }) {
  return (
    <div className="panel-stack">
      <div className="about-avatar">Astronaut</div>
      <div className="about-name">{data.name}</div>
      <div className="about-role">
        {data.title} / {data.location}
      </div>
      <p className="about-bio">{data.bio}</p>
      <div className="skills-label">Core Systems</div>
      <div className="skills-grid">
        {data.skills.map((skill) => (
          <span key={skill} className="skill-badge">
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

function ProjectsContent({ data }) {
  return (
    <div className="panel-stack">
      {data.projects.map((project, index) => (
        <article key={project.name} className="project-card">
          <div className="project-index">Project {String(index + 1).padStart(2, '0')}</div>
          <h3 className="project-name">{project.name}</h3>
          <p className="project-desc">{project.description}</p>
          <div className="project-tech">
            {project.tech.map((tech) => (
              <span key={tech} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>
          <div className="project-links">
            {project.link && (
              <a className="link-btn" href={project.link} target="_blank" rel="noreferrer">
                View Live
              </a>
            )}
            {project.github && (
              <a className="link-btn" href={project.github} target="_blank" rel="noreferrer">
                View Code
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

function ContactContent({ data }) {
  const contactLinks = [
    { label: 'Open GitHub', href: data.social.github },
    { label: 'Open LinkedIn', href: data.social.linkedin },
    { label: 'Send Email', href: data.social.email ? `mailto:${data.social.email}` : '' },
    { label: 'Download Resume', href: data.social.resume },
  ].filter((item) => item.href)

  return (
    <div className="panel-stack">
      <div className="contact-header">Transmission Ready</div>
      <p className="contact-subtitle">Choose a secure channel to connect.</p>
      <div className="contact-buttons">
        {contactLinks.map((item) => (
          <a key={item.label} className="contact-btn" href={item.href} target="_blank" rel="noreferrer">
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export default InfoPanel
