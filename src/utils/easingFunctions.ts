/**
 * Easing Functions for Camera Transitions
 * Used to control the acceleration and deceleration of camera movements
 */

export type EasingFunction = (t: number) => number;

export type EasingName = 'linear' | 'ease_in' | 'ease_out' | 'ease_in_out' | 'ease_in_cubic' | 'ease_out_cubic';

export interface Position {
  x: number;
  y: number;
}

export const easingFunctions: Record<EasingName, EasingFunction> = {
  /**
   * Linear easing - constant speed
   * @param {number} t - Progress value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  linear: (t: number): number => t,

  /**
   * Ease In - slow start, fast end
   * @param {number} t - Progress value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  ease_in: (t: number): number => t * t,

  /**
   * Ease Out - fast start, slow end (recommended for natural camera motion)
   * @param {number} t - Progress value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  ease_out: (t: number): number => t * (2 - t),

  /**
   * Ease In Out - slow start and end
   * @param {number} t - Progress value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  ease_in_out: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  /**
   * Ease In Cubic - very slow start
   * @param {number} t - Progress value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  ease_in_cubic: (t: number): number => t * t * t,

  /**
   * Ease Out Cubic - very slow end
   * @param {number} t - Progress value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  ease_out_cubic: (t: number): number => {
    const t1 = t - 1;
    return t1 * t1 * t1 + 1;
  },
};

/**
 * Get easing function by name
 * @param {string} name - Easing function name
 * @returns {Function} Easing function
 */
export const getEasingFunction = (name: string): EasingFunction => {
  return easingFunctions[name as EasingName] || easingFunctions.ease_out;
};

/**
 * Interpolate between two values using an easing function
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} progress - Progress value between 0 and 1
 * @param {string} easingName - Name of easing function to use
 * @returns {number} Interpolated value
 */
export const interpolate = (start: number, end: number, progress: number, easingName: string = 'ease_out'): number => {
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
export const interpolatePosition = (startPos: Position, endPos: Position, progress: number, easingName: string = 'ease_out'): Position => {
  return {
    x: interpolate(startPos.x, endPos.x, progress, easingName),
    y: interpolate(startPos.y, endPos.y, progress, easingName),
  };
};

export default easingFunctions;
