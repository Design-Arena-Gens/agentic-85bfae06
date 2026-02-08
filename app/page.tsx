'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type UnlockPhase = 'idle' | 'running' | 'complete';
type PreviewMode = 'light' | 'dark';

type UnlockStep = {
  id: string;
  title: string;
  description: string;
  duration: number;
  highlight: string;
};

const STEP_SEQUENCE: UnlockStep[] = [
  {
    id: 'scan',
    title: 'Calibrating Neural Preferences',
    description: 'Sampling your AI companion’s preferences to detect how bold its night vision mode should be.',
    duration: 1200,
    highlight: 'Signal lock acquired'
  },
  {
    id: 'contrast',
    title: 'Amplifying Contrast Matrix',
    description: 'Infusing deeper blacks and inky gradients while keeping UI clarity at 100%.',
    duration: 1500,
    highlight: 'Contrast tuned to 97%'
  },
  {
    id: 'particles',
    title: 'Applying Quantum Glow Suppressor',
    description: 'Dialing back rogue photons so the interface stays calm and low-noise.',
    duration: 1400,
    highlight: 'Glare reduced by 84%'
  },
  {
    id: 'handoff',
    title: 'Handing Off To Aesthetic Co-processor',
    description: 'Synchronising gradients, icons, and shadows with the new dark theme spec.',
    duration: 1100,
    highlight: 'Palette sync complete'
  },
  {
    id: 'stabilize',
    title: 'Stabilising Experience Layer',
    description: 'Locking in animation smoothness and preparing guided dark mode onboarding.',
    duration: 1300,
    highlight: 'Experience sealed'
  }
];

const FEATURE_BULLETS = [
  {
    heading: 'Hyper-realistic simulation',
    body: 'Every interaction is mocked in-browser so you can rehearse your pitch without needing real API keys.'
  },
  {
    heading: 'Shareable demo script',
    body: 'Pre-written narration hints help you guide clients through the “unlock” moment with style.'
  },
  {
    heading: 'Instant reset',
    body: 'Jump back to the locked state in one click to repeat the experience as many times as you like.'
  }
];

const DEMO_SCRIPT = [
  'Invite everyone to watch the “calibration lasers” hone in on their favourite palettes.',
  'Point out how the preview panel flips into noir mode at the finale.',
  'Remind the audience that nothing here touches production — it is pure theatre.'
];

function useUnlockSequence(
  phase: UnlockPhase,
  runToken: number,
  onComplete: () => void
) {
  const [stepIndex, setStepIndex] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== 'running') {
      return;
    }

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const executeSequence = async () => {
      for (let i = 0; i < STEP_SEQUENCE.length; i += 1) {
        if (cancelled) {
          return;
        }

        setStepIndex(i);
        setProgress(Math.round(((i + 1) / (STEP_SEQUENCE.length + 1)) * 90));

        await new Promise((resolve) => {
          const handle = setTimeout(resolve, STEP_SEQUENCE[i].duration);
          timeouts.push(handle);
        });
      }

      if (!cancelled) {
        setProgress(100);
        onComplete();
      }
    };

    executeSequence();

    return () => {
      cancelled = true;
      timeouts.forEach((handle) => clearTimeout(handle));
    };
  }, [phase, runToken, onComplete]);

  const resetSequence = () => {
    setStepIndex(-1);
    setProgress(0);
  };

  return { stepIndex, progress, resetSequence };
}

export default function HomePage() {
  const [phase, setPhase] = useState<UnlockPhase>('idle');
  const [runToken, setRunToken] = useState(0);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('light');
  const [scriptIndex, setScriptIndex] = useState(0);

  const handleSequenceComplete = useCallback(() => {
    setPhase('complete');
  }, []);

  const { stepIndex, progress, resetSequence } = useUnlockSequence(
    phase,
    runToken,
    handleSequenceComplete
  );

  useEffect(() => {
    if (phase === 'complete') {
      setPreviewMode('dark');
      setScriptIndex(2);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'running' && stepIndex >= 0 && stepIndex < DEMO_SCRIPT.length) {
      setScriptIndex(stepIndex);
    }
  }, [phase, stepIndex]);

  const statusLabel = useMemo(() => {
    if (phase === 'running') {
      return 'Unlock sequence in progress…';
    }

    if (phase === 'complete') {
      return 'Dark mode engaged — enjoy the glow!';
    }

    return 'Demo idle — ready when you are.';
  }, [phase]);

  const startUnlock = () => {
    resetSequence();
    setPhase('running');
    setPreviewMode('light');
    setScriptIndex(0);
    setRunToken((token) => token + 1);
  };

  const resetUnlock = () => {
    resetSequence();
    setPhase('idle');
    setPreviewMode('light');
    setScriptIndex(0);
  };

  const togglePreview = () => {
    setPreviewMode((mode) => (mode === 'light' ? 'dark' : 'light'));
  };

  return (
    <main className="page">
      <div className="shell">
        <header className="hero">
          <span className="hero-chip">Demo Simulation</span>
          <h1>AI Dark Mode Unlocker</h1>
          <p className="hero-copy">
            Walk stakeholders through a cinematic unlocking ritual that flips any AI assistant into a sleek,
            presentation-ready dark mode — no actual systems harmed.
          </p>

          <div className="hero-actions">
            <button
              className="primary-action"
              onClick={startUnlock}
              disabled={phase === 'running'}
              type="button"
            >
              {phase === 'running' ? 'Deploying Dark Mode…' : 'Unlock Dark Mode'}
            </button>
            <button
              className="secondary-action"
              onClick={resetUnlock}
              type="button"
              disabled={phase === 'running'}
            >
              Reset Demo
            </button>
            <button className="secondary-action" onClick={togglePreview} type="button">
              Toggle Preview ({previewMode === 'light' ? 'Light' : 'Dark'})
            </button>
          </div>

          <div className="status-pill">{statusLabel}</div>
        </header>

        <section className="main-grid">
          <article className="panel engine">
            <header className="panel-header">
              <h2>Unlock Console</h2>
              <span className={`phase-tag phase-${phase}`}>{phase.toUpperCase()}</span>
            </header>

            <div className="progress-shell" aria-live="polite">
              <div className="progress-track">
                <div
                  className="progress-bar"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  aria-hidden
                />
              </div>
              <span className="progress-label">{progress}%</span>
            </div>

            <div className="timeline">
              {STEP_SEQUENCE.map((step, index) => {
                const status =
                  index < stepIndex
                    ? 'complete'
                    : index === stepIndex
                    ? 'active'
                    : phase === 'complete'
                    ? 'complete'
                    : 'pending';

                return (
                  <div key={step.id} className={`timeline-step timeline-${status}`}>
                    <div className="timeline-marker" />
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                      <span className="timeline-highlight">{step.highlight}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="panel preview">
            <header className="panel-header">
              <h2>Experience Preview</h2>
              <span className={`preview-badge badge-${previewMode}`}>
                {previewMode === 'light' ? 'Locked' : 'Unlocked'}
              </span>
            </header>

            <div className={`device ${previewMode}`}>
              <div className="device-header">
                <span className="device-title">Nebula AI</span>
                <span className="device-status">
                  {previewMode === 'light' ? 'Awaiting unlock…' : 'Dark serenity engaged'}
                </span>
              </div>
              <div className="device-body">
                <div className="chat-bubble user">How do I enable dark mode?</div>
                <div className="chat-bubble ai">
                  {previewMode === 'light'
                    ? 'Dark mode remains classified. Submit unlock protocol to proceed.'
                    : 'Dark mode secured. Welcome to the nebula.'}
                </div>
                <div className="chat-bubble system">
                  {previewMode === 'light'
                    ? '∙∙∙ Waiting for unlock ritual'
                    : '✨ Visual cortex recalibrated for night ops'}
                </div>
              </div>
              <div className="device-footer">
                <span className="pulse" />
                <span>{previewMode === 'light' ? 'Locked' : 'Unlocked'}</span>
              </div>
            </div>
          </article>

          <article className="panel script">
            <header className="panel-header">
              <h2>Demo Narration</h2>
              <span className="script-step">Beat {scriptIndex + 1}</span>
            </header>
            <p className="script-line">{DEMO_SCRIPT[scriptIndex]}</p>
            <div className="script-controls">
              <button
                type="button"
                className="secondary-action"
                onClick={() =>
                  setScriptIndex((prev) => (prev - 1 + DEMO_SCRIPT.length) % DEMO_SCRIPT.length)
                }
              >
                Previous Beat
              </button>
              <button
                type="button"
                className="secondary-action"
                onClick={() => setScriptIndex((prev) => (prev + 1) % DEMO_SCRIPT.length)}
              >
                Next Beat
              </button>
            </div>
          </article>

          <article className="panel features">
            <header className="panel-header">
              <h2>Why teams love this demo</h2>
            </header>
            <ul className="feature-list">
              {FEATURE_BULLETS.map((feature) => (
                <li key={feature.heading}>
                  <h3>{feature.heading}</h3>
                  <p>{feature.body}</p>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
