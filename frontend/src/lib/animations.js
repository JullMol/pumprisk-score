import { animate, stagger } from "animejs";

/**
 * Animate a numeric count-up on a DOM element.
 * @param {HTMLElement} element - Target DOM element whose textContent will update.
 * @param {number} targetValue - Destination number.
 * @param {object} options - Configuration options (decimals, prefix, suffix, duration).
 */
export function animateCount(element, targetValue, options = {}) {
  if (!element || typeof targetValue !== "number" || isNaN(targetValue)) return null;

  const {
    decimals = 0,
    prefix = "",
    suffix = "",
    duration = 1200,
    ease = "outExpo",
  } = options;

  const state = { val: 0 };

  return animate(state, {
    val: targetValue,
    duration,
    ease,
    onUpdate: () => {
      if (!element) return;
      const formatted = decimals > 0
        ? state.val.toFixed(decimals)
        : Math.round(state.val).toLocaleString("en-US");
      element.textContent = `${prefix}${formatted}${suffix}`;
    },
  });
}

/**
 * Staggered entrance animation for lists of elements.
 * @param {string|NodeList|Array} targets - Selector or elements.
 * @param {object} options - Configuration (delay, duration, translateY).
 */
export function animateStagger(targets, options = {}) {
  const {
    duration = 650,
    ease = "outExpo",
    translateY = [16, 0],
    opacity = [0, 1],
    staggerDelay = 45,
  } = options;

  return animate(targets, {
    opacity,
    translateY,
    duration,
    ease,
    delay: stagger(staggerDelay),
  });
}

/**
 * Smoothly animate SVG stroke dashoffset for gauges and progress meters.
 */
export function animateGauge(circleElement, targetOffset, initialOffset, duration = 1400) {
  if (!circleElement) return null;

  const state = { offset: initialOffset };

  return animate(state, {
    offset: targetOffset,
    duration,
    ease: "outExpo",
    onUpdate: () => {
      if (circleElement) {
        circleElement.setAttribute("stroke-dashoffset", state.offset);
      }
    },
  });
}
