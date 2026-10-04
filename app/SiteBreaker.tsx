"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "resting" | "running" | "smashing";

type Position = {
  x: number;
  y: number;
  duration: number;
};

type Impact = {
  id: number;
  x: number;
  y: number;
};

type Debris = {
  id: number;
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  rotation: number;
  color: string;
};

type BreakerStyle = CSSProperties & {
  "--breaker-x": string;
  "--breaker-y": string;
  "--breaker-duration": string;
  "--breaker-facing": number;
};

type DebrisStyle = CSSProperties & {
  "--debris-x": string;
  "--debris-y": string;
  "--debris-dx": string;
  "--debris-dy": string;
  "--debris-rotation": string;
  "--debris-size": string;
  "--debris-color": string;
};

const TARGET_SELECTOR = [
  ".hero-title-wrap",
  ".hero-portrait",
  ".hero-intro",
  ".proof-strip > div",
  ".profile-copy > *",
  ".experience-item",
  ".earlier-row",
  ".impact-band > div",
  ".impact-band > p",
  ".work-card",
  ".capability",
  ".tools-row",
  ".education-block",
  ".certification-block",
  ".language-block",
  ".contact-section h2",
  ".contact-actions",
  "footer > *",
].join(",");

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

const randomBetween = (minimum: number, maximum: number) =>
  Math.random() * (maximum - minimum) + minimum;

const playBreakSound = (context: AudioContext) => {
  if (context.state !== "running") return;

  const now = context.currentTime;
  const noiseDuration = 0.34;
  const noiseBuffer = context.createBuffer(
    1,
    Math.ceil(context.sampleRate * noiseDuration),
    context.sampleRate,
  );
  const noiseData = noiseBuffer.getChannelData(0);

  for (let index = 0; index < noiseData.length; index += 1) {
    const progress = index / noiseData.length;
    noiseData[index] =
      (Math.random() * 2 - 1) * Math.pow(1 - progress, 2.4);
  }

  const crack = context.createBufferSource();
  const crackFilter = context.createBiquadFilter();
  const crackGain = context.createGain();
  crack.buffer = noiseBuffer;
  crackFilter.type = "bandpass";
  crackFilter.frequency.setValueAtTime(1650, now);
  crackFilter.Q.setValueAtTime(0.75, now);
  crackGain.gain.setValueAtTime(0.0001, now);
  crackGain.gain.exponentialRampToValueAtTime(0.22, now + 0.008);
  crackGain.gain.exponentialRampToValueAtTime(0.0001, now + noiseDuration);
  crack.connect(crackFilter).connect(crackGain).connect(context.destination);
  crack.start(now);
  crack.stop(now + noiseDuration);

  const thud = context.createOscillator();
  const thudGain = context.createGain();
  thud.type = "triangle";
  thud.frequency.setValueAtTime(105, now);
  thud.frequency.exponentialRampToValueAtTime(42, now + 0.2);
  thudGain.gain.setValueAtTime(0.18, now);
  thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
  thud.connect(thudGain).connect(context.destination);
  thud.start(now);
  thud.stop(now + 0.25);

  [0.045, 0.095, 0.15].forEach((delay, index) => {
    const chip = context.createOscillator();
    const chipGain = context.createGain();
    chip.type = "square";
    chip.frequency.setValueAtTime(620 + index * 260, now + delay);
    chip.frequency.exponentialRampToValueAtTime(
      220 + index * 90,
      now + delay + 0.075,
    );
    chipGain.gain.setValueAtTime(0.035, now + delay);
    chipGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + delay + 0.08,
    );
    chip.connect(chipGain).connect(context.destination);
    chip.start(now + delay);
    chip.stop(now + delay + 0.085);
  });
};

const playChargeSound = (context: AudioContext) => {
  if (context.state !== "running") return;

  const now = context.currentTime;
  const horn = context.createOscillator();
  const hornFilter = context.createBiquadFilter();
  const hornGain = context.createGain();

  horn.type = "sawtooth";
  horn.frequency.setValueAtTime(145, now);
  horn.frequency.exponentialRampToValueAtTime(360, now + 0.18);
  horn.frequency.exponentialRampToValueAtTime(205, now + 0.4);
  hornFilter.type = "lowpass";
  hornFilter.frequency.setValueAtTime(1100, now);
  hornGain.gain.setValueAtTime(0.0001, now);
  hornGain.gain.exponentialRampToValueAtTime(0.055, now + 0.025);
  hornGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.44);
  horn.connect(hornFilter).connect(hornGain).connect(context.destination);
  horn.start(now);
  horn.stop(now + 0.45);
};

const makeDebris = (x: number, y: number, seed: number): Debris[] => {
  const colors = ["#171a21", "#2854e8", "#f4f1e8", "#8e6d45"];

  return Array.from({ length: 12 }, (_, index) => {
    const angle = randomBetween(Math.PI * 1.08, Math.PI * 1.92);
    const force = randomBetween(34, 105);

    return {
      id: seed + index,
      x,
      y,
      size: randomBetween(5, 14),
      dx: Math.cos(angle) * force,
      dy: Math.sin(angle) * force - randomBetween(8, 40),
      rotation: randomBetween(-210, 210),
      color: colors[index % colors.length],
    };
  });
};

export default function SiteBreaker() {
  const [phase, setPhase] = useState<Phase>("resting");
  const [position, setPosition] = useState<Position>({
    x: -180,
    y: 260,
    duration: 0,
  });
  const [facing, setFacing] = useState(1);
  const [impact, setImpact] = useState<Impact | null>(null);
  const [debris, setDebris] = useState<Debris[]>([]);
  const [battleCryId, setBattleCryId] = useState<number | null>(null);
  const [soundReady, setSoundReady] = useState(false);
  const positionRef = useRef(position);
  const lastTargetRef = useRef<Element | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const unlockAudio = useCallback(() => {
    const AudioContextConstructor =
      window.AudioContext ??
      (window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;

    if (!AudioContextConstructor) return;

    const context = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = context;

    const markReady = () => setSoundReady(context.state === "running");

    if (context.state === "suspended") {
      void context.resume().then(markReady);
    } else {
      markReady();
    }
  }, []);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      const context = audioContextRef.current;
      audioContextRef.current = null;
      if (context && context.state !== "closed") {
        void context.close();
      }
    };
  }, [unlockAudio]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      document.body.classList.remove("site-breaker-screen-shake");
      document
        .querySelectorAll(".site-breaker-broken")
        .forEach((element) => element.classList.remove("site-breaker-broken"));
      return;
    }

    let cancelled = false;
    const timers: number[] = [];

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        if (!cancelled) callback();
      }, delay);
      timers.push(timer);
    };

    const characterMetrics = () => {
      const mobile = window.innerWidth <= 640;
      const height = mobile ? 142 : 190;
      return { height, width: height * (543 / 724) };
    };

    const chooseTarget = () => {
      const visibleTargets = Array.from(
        document.querySelectorAll<HTMLElement>(TARGET_SELECTOR),
      ).filter((element) => {
        const rectangle = element.getBoundingClientRect();
        return (
          rectangle.width > 70 &&
          rectangle.height > 24 &&
          rectangle.bottom > 96 &&
          rectangle.top < window.innerHeight - 32 &&
          rectangle.right > 0 &&
          rectangle.left < window.innerWidth
        );
      });

      if (visibleTargets.length === 0) {
        schedule(chooseTarget, 1600);
        return;
      }

      const freshTargets = visibleTargets.filter(
        (element) => element !== lastTargetRef.current,
      );
      const targetPool = freshTargets.length > 0 ? freshTargets : visibleTargets;
      const target = targetPool[Math.floor(Math.random() * targetPool.length)];
      lastTargetRef.current = target;

      const rectangle = target.getBoundingClientRect();
      const character = characterMetrics();
      const impactX = clamp(
        rectangle.left + rectangle.width * randomBetween(0.35, 0.68),
        28,
        window.innerWidth - 28,
      );
      const impactY = clamp(
        rectangle.top + rectangle.height * randomBetween(0.35, 0.7),
        105,
        window.innerHeight - 30,
      );
      const destination = {
        x: clamp(
          impactX - character.width * 0.52,
          8,
          window.innerWidth - character.width - 8,
        ),
        y: clamp(
          impactY - character.height * 0.62,
          84,
          window.innerHeight - character.height - 8,
        ),
      };
      const distance = Math.hypot(
        destination.x - positionRef.current.x,
        destination.y - positionRef.current.y,
      );
      const travelTime = clamp(distance * 1.7, 700, 1700);
      const shouldCallOut = distance > 320 && Math.random() > 0.38;

      setFacing(destination.x >= positionRef.current.x ? 1 : -1);
      setPhase("running");
      if (shouldCallOut) {
        const cryId = Date.now();
        setBattleCryId(cryId);
        const audioContext = audioContextRef.current;
        if (audioContext) playChargeSound(audioContext);
        schedule(() => setBattleCryId(null), 920);
      }
      const nextPosition = {
        ...destination,
        duration: travelTime,
      };
      positionRef.current = nextPosition;
      setPosition(nextPosition);

      schedule(() => {
        const targetRectangle = target.getBoundingClientRect();
        const liveImpactX = clamp(
          targetRectangle.left + targetRectangle.width * 0.52,
          22,
          window.innerWidth - 22,
        );
        const liveImpactY = clamp(
          targetRectangle.top + targetRectangle.height * 0.52,
          94,
          window.innerHeight - 22,
        );
        const impactId = Date.now();

        setPhase("smashing");

        // Match the sound, debris, and damage to the hammer's contact frame.
        schedule(() => {
          const audioContext = audioContextRef.current;
          if (audioContext) playBreakSound(audioContext);
          document.body.classList.remove("site-breaker-screen-shake");
          void document.body.offsetWidth;
          document.body.classList.add("site-breaker-screen-shake");
          target.classList.remove("site-breaker-broken");
          // Restart the damage animation if a target is selected twice later.
          void target.getBoundingClientRect();
          target.classList.add("site-breaker-broken");
          setImpact({ id: impactId, x: liveImpactX, y: liveImpactY });
          setDebris(makeDebris(liveImpactX, liveImpactY, impactId));

          schedule(() => {
            setImpact(null);
            setDebris([]);
          }, 1050);

          schedule(() => {
            document.body.classList.remove("site-breaker-screen-shake");
          }, 460);

          schedule(() => {
            target.classList.remove("site-breaker-broken");
          }, 5600);
        }, 320);

        schedule(() => {
          setPhase("resting");
          schedule(chooseTarget, randomBetween(1600, 3200));
        }, 760);
      }, travelTime + 80);
    };

    schedule(chooseTarget, 1400);

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      document.body.classList.remove("site-breaker-screen-shake");
      document
        .querySelectorAll(".site-breaker-broken")
        .forEach((element) => element.classList.remove("site-breaker-broken"));
    };
  }, []);

  const breakerStyle: BreakerStyle = {
    "--breaker-x": `${position.x}px`,
    "--breaker-y": `${position.y}px`,
    "--breaker-duration": `${position.duration}ms`,
    "--breaker-facing": facing,
  };

  return (
    <>
      <div
        className={`site-breaker-shell is-${phase}`}
        style={breakerStyle}
        aria-hidden="true"
      >
        {battleCryId ? (
          <span className="site-breaker-battle-cry" key={battleCryId}>
            Hog rider!
          </span>
        ) : null}
        <div className="site-breaker-character">
          <span className="site-breaker-shadow" />
          <span className="site-breaker-dust" />
          <span className="site-breaker-speedlines" />
          <span className="site-breaker-sprite" />
        </div>
      </div>

      {impact ? (
        <span
          key={impact.id}
          className="site-breaker-impact"
          style={{ left: impact.x, top: impact.y }}
          aria-hidden="true"
        />
      ) : null}

      <div className="site-breaker-debris" aria-hidden="true">
        {debris.map((piece) => {
          const debrisStyle: DebrisStyle = {
            "--debris-x": `${piece.x}px`,
            "--debris-y": `${piece.y}px`,
            "--debris-dx": `${piece.dx}px`,
            "--debris-dy": `${piece.dy}px`,
            "--debris-rotation": `${piece.rotation}deg`,
            "--debris-size": `${piece.size}px`,
            "--debris-color": piece.color,
          };

          return (
            <span
              className="site-breaker-debris-piece"
              key={piece.id}
              style={debrisStyle}
            />
          );
        })}
      </div>

      {!soundReady ? (
        <button
          className="site-breaker-sound-toggle"
          type="button"
          onClick={unlockAudio}
        >
          Enable sound
        </button>
      ) : null}
    </>
  );
}
