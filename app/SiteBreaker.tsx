"use client";

import { useEffect, useRef, useState } from "react";

type Target = {
  element: HTMLElement;
  kind: "text" | "image" | "top" | "bottom" | "left" | "right";
  rect: DOMRect;
  color: string;
};
const random = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(n, max));
const ease = "cubic-bezier(0.23, 1, 0.32, 1)";
const rebuildDelay = 900;
const rebuildDuration = 650;
const targetCooldown = 16000;

// Copy resolved typography so detached fragments match nested, inherited text styles.
function visualCopy(element: HTMLElement): HTMLElement {
  const copy = element.cloneNode(true) as HTMLElement;
  const sources = [element, ...element.querySelectorAll<HTMLElement>("*")];
  const copies = [copy, ...copy.querySelectorAll<HTMLElement>("*")];
  sources.forEach((source, index) => {
    const style = getComputedStyle(source);
    for (const property of Array.from(style))
      copies[index].style.setProperty(
        property,
        style.getPropertyValue(property),
      );
    copies[index].removeAttribute("id");
    copies[index].removeAttribute("data-breaker");
  });
  Object.assign(copy.style, {
    position: "absolute",
    margin: "0",
    top: "0",
    left: "0",
    transform: "none",
    animation: "none",
    transition: "none",
  });
  return copy;
}

export default function SiteBreaker() {
  const riderRef = useRef<HTMLDivElement>(null);
  const effectsRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    preference.addEventListener("change", update);
    const images = ["/breaker-run-v2.png", "/breaker-smash-v2.png"].map(
      (src) => {
        const image = new Image();
        image.src = src;
        return image.decode();
      },
    );
    let mounted = true;
    void Promise.all([...images, document.fonts.ready])
      .then(() => {
        if (mounted) {
          update();
          try {
            setPaused(
              localStorage.getItem("portfolio-breaker-paused") === "true",
            );
          } catch {
            /* Storage is optional. */
          }
          setReady(true);
        }
      })
      .catch(() => {
        /* Keep the portfolio intact if assets fail. */
      });
    return () => {
      mounted = false;
      preference.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const rider = riderRef.current;
    const effects = effectsRef.current;
    if (!rider || !effects || paused || reduced || !ready) return;
    let disposed = false;
    let controller: AbortController;
    let restartTimer: ReturnType<typeof setTimeout>;
    let restore = () => {};
    const animations = new Set<Animation>();
    let position = { x: 12, y: Math.max(130, innerHeight - 230) };
    const lastHit = new Map<HTMLElement, number>();
    let previousTarget: HTMLElement | null = null;
    let activeTarget: HTMLElement | null = null;

    const bounds = () => {
      const viewport = window.visualViewport;
      const left = (viewport?.offsetLeft ?? 0) + 8;
      const top = Math.max(
        (viewport?.offsetTop ?? 0) + 8,
        (document.querySelector(".site-header")?.getBoundingClientRect()
          .bottom ?? 80) + 12,
      );
      const right =
        (viewport?.offsetLeft ?? 0) + (viewport?.width ?? innerWidth) - 8;
      const bottom =
        (viewport?.offsetTop ?? 0) + (viewport?.height ?? innerHeight) - 12;
      return {
        left,
        top,
        right,
        bottom,
        maxX: right - rider.offsetWidth,
        maxY: bottom - rider.offsetHeight,
        fits:
          right - left >= rider.offsetWidth &&
          bottom - top >= rider.offsetHeight,
      };
    };
    const constrain = (point: { x: number; y: number }) => {
      const area = bounds();
      return {
        x: clamp(point.x, area.left, Math.max(area.left, area.maxX)),
        y: clamp(point.y, area.top, Math.max(area.top, area.maxY)),
      };
    };
    // Score a few possible routes against readable content, without per-frame layout work.
    const obstacles = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          "main h1, main h2, main h3, main p, main li, main a, main img, .breaker-toggle",
        ),
      )
        .filter((element) => !activeTarget?.contains(element))
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.bottom > 0 && rect.top < innerHeight);
    const routeCost = (
      from: { x: number; y: number },
      to: { x: number; y: number },
      content: DOMRect[],
    ) => {
      let cost = 0;
      for (let step = 1; step <= 6; step++) {
        const x = from.x + ((to.x - from.x) * step) / 6;
        const y = from.y + ((to.y - from.y) * step) / 6;
        for (const rect of content)
          cost +=
            Math.max(
              0,
              Math.min(x + rider.offsetWidth, rect.right) -
                Math.max(x, rect.left),
            ) *
            Math.max(
              0,
              Math.min(y + rider.offsetHeight, rect.bottom) -
                Math.max(y, rect.top),
            );
      }
      return cost;
    };
    const openSpace = () => {
      const area = bounds();
      const content = obstacles();
      const candidates = Array.from({ length: 8 }, (_, index) =>
        constrain({
          x:
            index < 2
              ? area.left
              : index < 4
                ? area.maxX
                : random(area.left, area.maxX),
          y: random(area.top, area.maxY),
        }),
      ).filter(
        (point) => Math.hypot(point.x - position.x, point.y - position.y) > 100,
      );
      return (
        candidates
          .map((point) => ({
            point,
            cost: routeCost(position, point, content),
          }))
          .sort((a, b) => a.cost - b.cost)[0]?.point ?? constrain(position)
      );
    };

    const animate = (
      element: HTMLElement,
      frames: Keyframe[],
      options: KeyframeAnimationOptions,
    ) => {
      const animation = element.animate(frames, {
        fill: "forwards",
        ...options,
      });
      animations.add(animation);
      return animation;
    };
    const wait = (ms: number, signal: AbortSignal) =>
      new Promise<void>((resolve, reject) => {
        const abort = () => {
          clearTimeout(timer);
          reject(new DOMException("Interrupted", "AbortError"));
        };
        const timer = setTimeout(() => {
          signal.removeEventListener("abort", abort);
          resolve();
        }, ms);
        signal.addEventListener("abort", abort, { once: true });
        if (signal.aborted) abort();
      });
    const protectedTarget = (element: HTMLElement) =>
      element.matches(":hover") ||
      element.contains(document.activeElement) ||
      Boolean(window.getSelection()?.containsNode(element, true));
    const measure = (element: HTMLElement): Target | null => {
      if (protectedTarget(element)) return null;
      const kind = element.dataset.breaker as Target["kind"];
      if (!["text", "image", "top", "bottom", "left", "right"].includes(kind))
        return null;
      if (
        kind === "image" &&
        (!(element instanceof HTMLImageElement) ||
          !element.complete ||
          !element.naturalWidth ||
          !element.currentSrc)
      )
        return null;
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      let rect = box;
      let color = style.color;
      if (kind !== "text" && kind !== "image") {
        const vertical = kind === "right" || kind === "left";
        const thickness = parseFloat(
          kind === "left"
            ? style.borderLeftWidth
            : vertical
              ? style.borderRightWidth
              : kind === "bottom"
                ? style.borderBottomWidth
                : style.borderTopWidth,
        );
        color =
          kind === "left"
            ? style.borderLeftColor
            : vertical
              ? style.borderRightColor
              : kind === "bottom"
                ? style.borderBottomColor
                : style.borderTopColor;
        if (
          !thickness ||
          color === "transparent" ||
          color === "rgba(0, 0, 0, 0)"
        )
          return null;
        rect = new DOMRect(
          kind === "right" ? box.right - thickness : box.left,
          kind === "bottom" ? box.bottom - thickness : box.top,
          vertical ? thickness : box.width,
          vertical ? box.height : thickness,
        );
      }
      const area = bounds();
      if (
        !area.fits ||
        rect.width <= 0 ||
        rect.height <= 0 ||
        rect.top < area.top ||
        rect.bottom > area.bottom ||
        rect.left < area.left ||
        rect.right > area.right
      )
        return null;
      const contactX = rect.left + rect.width / 2;
      const contactY = rect.top + rect.height / 2;
      const desiredX =
        contactX -
        rider.offsetWidth * (contactX > innerWidth / 2 ? 0.84 : 0.16);
      const desiredY = contactY - rider.offsetHeight * 0.82;
      if (
        desiredX < area.left ||
        desiredX > area.maxX ||
        desiredY < area.top ||
        desiredY > area.maxY
      )
        return null;
      return { element, kind, rect, color };
    };

    const prepareImage = async (
      element: HTMLImageElement,
      signal: AbortSignal,
    ) => {
      const copy = visualCopy(element) as HTMLImageElement;
      // Pin the decoded source: detached Next/Image copies must not choose a new srcset.
      copy.removeAttribute("srcset");
      copy.removeAttribute("sizes");
      copy.loading = "eager";
      copy.alt = "";
      copy.src = element.currentSrc;
      try {
        await Promise.race([
          copy.decode(),
          wait(1500, signal).then(() => {
            throw new Error("Image preparation timed out");
          }),
        ]);
        signal.throwIfAborted();
        return copy.src === element.currentSrc ? copy : null;
      } catch (error) {
        if (signal.aborted) throw error;
        return null; // A slow or failed image must never hide the original or stall other targets.
      }
    };

    const fracture = (target: Target, imageCopy: HTMLImageElement | null) => {
      const { element, kind, rect, color } = target;
      const isContent = kind === "text" || kind === "image";
      const property = isContent ? "opacity" : `border-${kind}-color`;
      const previous = element.style.getPropertyValue(property);
      const priority = element.style.getPropertyPriority(property);
      const template =
        kind === "image"
          ? imageCopy
          : kind === "text"
            ? visualCopy(element)
            : null;
      const group = document.createElement("div");
      group.className = "breaker-fracture";
      group.dataset.kind = kind;
      // Contain debris around its source, including large photos beside body copy.
      const spill = innerWidth < 640 ? 6 : 10;
      const left = Math.max(bounds().left, rect.left - spill);
      const top = Math.max(bounds().top, rect.top - spill);
      Object.assign(group.style, {
        left: `${left}px`,
        top: `${top}px`,
        width: `${Math.min(bounds().right, rect.right + spill) - left}px`,
        height: `${Math.min(bounds().bottom, rect.bottom + spill) - top}px`,
      });
      effects.append(group);
      const pieces: {
        node: HTMLElement;
        displaced: string;
        scatter: Animation;
      }[] = [];
      const columns =
        kind === "right" || kind === "left"
          ? 1
          : kind === "image"
            ? innerWidth < 640
              ? 3
              : 4
            : innerWidth < 640
              ? 5
              : 8;
      const rows =
        kind === "image"
          ? 3
          : kind === "text"
            ? 2
            : kind === "right" || kind === "left"
              ? 8
              : 1;
      // Shared irregular boundaries keep the assembled fragments seamless.
      const grid = Array.from({ length: rows + 1 }, (_, y) =>
        Array.from({ length: columns + 1 }, (_, x) => ({
          x:
            ((x + (x > 0 && x < columns ? random(-0.22, 0.22) : 0)) *
              rect.width) /
            columns,
          y:
            ((y + (y > 0 && y < rows ? random(-0.2, 0.2) : 0)) * rect.height) /
            rows,
        })),
      );
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < columns; col++) {
          const node = document.createElement("div");
          node.className = "breaker-fragment";
          const corners = [
            grid[row][col],
            grid[row][col + 1],
            grid[row + 1][col + 1],
            grid[row + 1][col],
          ];
          Object.assign(node.style, {
            left: `${rect.left - left}px`,
            top: `${rect.top - top}px`,
            transformOrigin: `${((col + 0.5) * rect.width) / columns}px ${((row + 0.5) * rect.height) / rows}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            clipPath: `polygon(${corners.map((p) => `${p.x}px ${p.y}px`).join(",")})`,
          });
          if (template) node.append(template.cloneNode(true));
          else node.style.background = color;
          group.append(node);
          const spread = Math.min(
            innerWidth < 640 ? 14 : 22,
            rect.width * 0.08 + 8,
          );
          const dx = ((col + 0.5) / columns - 0.5) * spread * 2;
          const dy = random(8, kind === "image" ? 20 : 16);
          const displaced = `translate(${dx}px, ${dy}px) rotate(${random(-4, 4)}deg)`;
          const scatter = animate(
            node,
            [
              { transform: "none", opacity: 1 },
              {
                transform: `translate(${dx * 0.6}px, -12px) rotate(${random(-2, 2)}deg)`,
                opacity: 1,
                offset: 0.3,
              },
              { transform: displaced, opacity: 0.55 },
            ],
            { duration: 480, easing: "linear" },
          );
          pieces.push({ node, displaced, scatter });
        }
      for (let index = 0; index < 6; index++) {
        const dust = document.createElement("span");
        dust.className = "breaker-dust";
        Object.assign(dust.style, {
          left: `${rect.left - left + rect.width / 2}px`,
          top: `${rect.top - top + rect.height / 2}px`,
          background: color,
        });
        group.append(dust);
        animate(
          dust,
          [
            { transform: "translate(0, 0)", opacity: 0.5 },
            {
              transform: `translate(${random(-35, 35)}px, ${random(-25, 25)}px)`,
              opacity: 0,
            },
          ],
          { duration: 420, easing: ease },
        );
      }
      element.style.setProperty(property, isContent ? "0" : "transparent");
      restore = () => {
        if (previous) element.style.setProperty(property, previous, priority);
        else element.style.removeProperty(property);
        effects.replaceChildren();
      };
      return {
        scattered: Promise.all(pieces.map((piece) => piece.scatter.finished)),
        rebuild: () =>
          Promise.all(
            pieces.map(
              ({ node, displaced }) =>
                animate(
                  node,
                  [
                    { transform: displaced, opacity: 0.55 },
                    { transform: "none", opacity: 1 },
                  ],
                  {
                    duration: rebuildDuration,
                    easing: "cubic-bezier(0.77, 0, 0.175, 1)",
                  },
                ).finished,
            ),
          ),
      };
    };

    const travel = async (
      destination: { x: number; y: number },
      signal: AbortSignal,
      facing?: number,
    ) => {
      destination = constrain(destination);
      if (!bounds().fits) return;
      rider.style.setProperty(
        "--breaker-facing",
        String(facing ?? (destination.x >= position.x ? 1 : -1)),
      );
      rider.dataset.phase = "running";
      const distance = Math.hypot(
        destination.x - position.x,
        destination.y - position.y,
      );
      if (distance < 1) {
        await wait(120, signal);
        return;
      }
      // A stable speed avoids accelerating out of a standstill at every waypoint.
      const duration = distance / 0.22;
      const animation = animate(
        rider,
        [
          { transform: `translate(${position.x}px, ${position.y}px)` },
          { transform: `translate(${destination.x}px, ${destination.y}px)` },
        ],
        { duration, easing: "linear" },
      );
      await animation.finished;
      signal.throwIfAborted();
      position = destination;
      rider.style.transform = `translate(${position.x}px, ${position.y}px)`;
      animation.cancel();
      animations.delete(animation);
      if (facing !== undefined)
        rider.style.setProperty("--breaker-facing", String(facing));
    };

    const roamFor = async (duration: number, signal: AbortSignal) => {
      const until = performance.now() + duration;
      do {
        await travel(openSpace(), signal);
      } while (performance.now() < until);
    };

    const approach = async (
      destination: { x: number; y: number },
      signal: AbortSignal,
      facing: number,
    ) => {
      const content = obstacles();
      const direct = routeCost(position, destination, content);
      const waypoint = openSpace();
      const detour =
        routeCost(position, waypoint, content) +
        routeCost(waypoint, destination, content);
      if (detour < direct * 0.7) await travel(waypoint, signal);
      await travel(destination, signal);
      rider.style.setProperty("--breaker-facing", String(facing));
    };

    const run = async (signal: AbortSignal, entranceDelay = 0) => {
      try {
        if (entranceDelay) await wait(entranceDelay, signal);
        while (!signal.aborted) {
          rider.style.opacity = bounds().fits ? "1" : "0";
          if (!bounds().fits) {
            await wait(1600, signal);
            continue;
          }
          const targets = Array.from(
            document.querySelectorAll<HTMLElement>("[data-breaker]"),
          )
            .map(measure)
            .filter((t): t is Target => t !== null);
          const alternatives = targets.filter(
            (target) => target.element !== previousTarget,
          );
          const eligible = alternatives.length ? alternatives : targets;
          const pool = eligible.filter(
            (target) =>
              Date.now() - (lastHit.get(target.element) ?? 0) >= targetCooldown,
          );
          if (!pool.length) {
            await travel(openSpace(), signal);
            continue;
          }
          if (Math.random() < 0.35) await travel(openSpace(), signal);
          const target = pool[Math.floor(Math.random() * pool.length)];
          activeTarget = target.element;
          // Image decoding can take time; keep moving while it is prepared.
          const imageCopy =
            target.kind === "image"
              ? (
                  await Promise.all([
                    prepareImage(target.element as HTMLImageElement, signal),
                    travel(openSpace(), signal),
                  ])
                )[0]
              : null;
          if (target.kind === "image" && !imageCopy) {
            lastHit.set(target.element, Date.now());
            activeTarget = null;
            continue;
          }
          const refreshed = measure(target.element);
          if (!refreshed) {
            activeTarget = null;
            continue;
          }
          target.rect = refreshed.rect;
          const x = target.rect.left + target.rect.width / 2;
          const y = target.rect.top + target.rect.height / 2;
          // Contact in frame four is at 84% across and 82% down the sprite.
          const facing = x > innerWidth / 2 ? 1 : -1;
          await approach(
            {
              x: x - rider.offsetWidth * (facing === 1 ? 0.84 : 0.16),
              y: y - rider.offsetHeight * 0.82,
            },
            signal,
            facing,
          );
          const live = measure(target.element);
          if (!live) {
            activeTarget = null;
            continue;
          }
          // Targets too close to a viewport edge cannot be struck accurately.
          if (
            Math.abs(
              position.x + rider.offsetWidth * (facing === 1 ? 0.84 : 0.16) - x,
            ) > 12 ||
            Math.abs(position.y + rider.offsetHeight * 0.82 - y) > 12
          ) {
            activeTarget = null;
            await wait(400, signal);
            continue;
          }
          rider.dataset.phase = "smashing";
          await wait(525, signal);
          if (!measure(target.element)) {
            rider.dataset.phase = "idle";
            activeTarget = null;
            continue;
          }
          if (
            imageCopy &&
            imageCopy.src !== (target.element as HTMLImageElement).currentSrc
          ) {
            activeTarget = null;
            rider.dataset.phase = "idle";
            continue;
          }
          const { rebuild, scattered } = fracture(live, imageCopy);
          lastHit.set(target.element, Date.now());
          previousTarget = target.element;
          await scattered;
          await wait(70, signal);
          // Keep the debris in place after the turn. Departure and recovery
          // run independently; the rider never waits for reconstruction.
          const impactPosition = { ...position };
          let departure = constrain({
            x: position.x - facing * 180,
            y: position.y + random(-50, 50),
          });
          if (
            Math.hypot(departure.x - position.x, departure.y - position.y) < 100
          )
            departure = openSpace();
          const departureClearance = Math.min(
            80,
            Math.hypot(
              departure.x - impactPosition.x,
              departure.y - impactPosition.y,
            ) * 0.8,
          );
          await Promise.all([
            (async () => {
              const started = performance.now();
              await travel(departure, signal);
              await roamFor(
                Math.max(
                  0,
                  rebuildDelay +
                    rebuildDuration -
                    (performance.now() - started),
                ),
                signal,
              );
            })(),
            (async () => {
              await wait(rebuildDelay, signal);
              // The visual distance matters too: a throttled browser must not
              // restore the object while the character is still beside it.
              while (true) {
                signal.throwIfAborted();
                const current = rider.getBoundingClientRect();
                if (
                  Math.hypot(
                    current.x - impactPosition.x,
                    current.y - impactPosition.y,
                  ) >= departureClearance
                )
                  break;
                await wait(80, signal);
              }
              await rebuild();
            })(),
          ]);
          restore();
          restore = () => {};
          animations.forEach((a) => a.cancel());
          animations.clear();
          activeTarget = null;
          await roamFor(random(1600, 2400), signal);
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Portfolio animation stopped", error);
          restore();
          animations.forEach((animation) => animation.cancel());
          animations.clear();
          rider.style.opacity = "0";
        }
      }
    };
    const interrupt = () => {
      controller?.abort();
      clearTimeout(restartTimer);
      const box = rider.getBoundingClientRect();
      position = constrain({ x: box.left, y: box.top });
      animations.forEach((a) => a.cancel());
      animations.clear();
      rider.style.transform = `translate(${position.x}px, ${position.y}px)`;
      rider.dataset.phase = "idle";
      rider.style.opacity =
        bounds().fits && !document.hidden && !disposed ? "1" : "0";
      restore();
      restore = () => {};
      activeTarget = null;
      if (!disposed && !document.hidden)
        restartTimer = setTimeout(() => {
          controller = new AbortController();
          void run(controller.signal);
        }, 300);
    };
    const protect = (event: Event) => {
      if (
        activeTarget &&
        event.target instanceof Node &&
        activeTarget.contains(event.target)
      )
        interrupt();
    };
    position = constrain(position);
    rider.style.transform = `translate(${position.x}px, ${position.y}px)`;
    controller = new AbortController();
    if (!document.hidden) void run(controller.signal, 700);
    window.addEventListener("scroll", interrupt, { passive: true });
    window.addEventListener("resize", interrupt);
    window.visualViewport?.addEventListener("resize", interrupt);
    window.visualViewport?.addEventListener("scroll", interrupt);
    document.addEventListener("visibilitychange", interrupt);
    document.addEventListener("focusin", protect);
    document.addEventListener("pointerover", protect);
    document.addEventListener("selectionchange", interrupt);
    return () => {
      disposed = true;
      interrupt();
      rider.style.opacity = "0";
      window.removeEventListener("scroll", interrupt);
      window.removeEventListener("resize", interrupt);
      window.visualViewport?.removeEventListener("resize", interrupt);
      window.visualViewport?.removeEventListener("scroll", interrupt);
      document.removeEventListener("visibilitychange", interrupt);
      document.removeEventListener("focusin", protect);
      document.removeEventListener("pointerover", protect);
      document.removeEventListener("selectionchange", interrupt);
    };
  }, [paused, reduced, ready]);

  return (
    <>
      <div ref={riderRef} className="breaker-rider" aria-hidden="true">
        <div className="breaker-facing">
          <div className="breaker-sprite" />
        </div>
      </div>
      <div
        ref={effectsRef}
        className="breaker-effects"
        aria-hidden="true"
        inert
      />
      {ready && !reduced && (
        <button
          className="breaker-toggle"
          type="button"
          onClick={() => {
            const next = !paused;
            setPaused(next);
            try {
              localStorage.setItem("portfolio-breaker-paused", String(next));
            } catch {
              /* Storage is optional. */
            }
          }}
        >
          {paused ? "Resume animation" : "Pause animation"}
        </button>
      )}
    </>
  );
}
