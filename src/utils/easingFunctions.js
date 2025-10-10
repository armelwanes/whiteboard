/**
 * Easing Functions for Camera Transitions
 * Used to control the acceleration and deceleration of camera movements
 */

export const easingFunctions = {
  /**
   * Linear easing - constant speed
   * @param {number} t - Progress value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  linear: (t) => t,

  /**
   * Ease In - slow start, fast end
   * @param {number} t - Progress value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  ease_in: (t) => t * t,

  /**
   * Ease Out - fast start, slow end (recommended for natural camera motion)
   * @param {number} t - Progress value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  ease_out: (t) => t * (2 - t),

  /**
   * Ease In Out - slow start and end
   * @param {number} t - Progress value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  ease_in_out: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  /**
   * Ease In Cubic - very slow start
   * @param {number} t - Progress value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  ease_in_cubic: (t) => t * t * t,

  /**
   * Ease Out Cubic - very slow end
   * @param {number} t - Progress value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  ease_out_cubic: (t) => {
    const t1 = t - 1;
    return t1 * t1 * t1 + 1;
  },
};

/**
 * Get easing function by name
 * @param {string} name - Easing function name
 * @returns {Function} Easing function
 */
export const getEasingFunction = (name) => {
  return easingFunctions[name] || easingFunctions.ease_out;
};

/**
 * Interpolate between two values using an easing function
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} progress - Progress value between 0 and 1
 * @param {string} easingName - Name of easing function to use
 * @returns {number} Interpolated value
 */
export const interpolate = (start, end, progress, easingName = 'ease_out') => {
  const easingFn = getEasingFunction(easingName);
  const easedProgress = easingFn(progress);
  return start + (end - start) * easedProgress;
};

/**
 * Interpolate between two positions using an easing function
 * @param {object} startPos - Start position {x, y}
 * @param {object} endPos - End position {x, y}
 * @param {number} progress - Progress value between 0 and 1
 * @param {string} easingName - Name of easing function to use
 * @returns {object} Interpolated position {x, y}
 */
export const interpolatePosition = (startPos, endPos, progress, easingName = 'ease_out') => {
  return {
    x: interpolate(startPos.x, endPos.x, progress, easingName),
    y: interpolate(startPos.y, endPos.y, progress, easingName),
  };
};

export default easingFunctions;
