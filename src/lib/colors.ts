export interface Color {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
}

export const Red: Color = {
  red: 255,
  green: 0,
  blue: 0,
};

export const Green: Color = {
  red: 0,
  green: 255,
  blue: 0,
};

export const Blue: Color = {
  red: 0,
  green: 0,
  blue: 255,
};

export const Yellow: Color = {
  red: 255,
  green: 255,
  blue: 0,
};

export function adjustIntensity(color: Color, intensity: number): Color {
  return {
    red: Math.max(0, Math.min(255, color.red * intensity)),
    green: Math.max(0, Math.min(255, color.green * intensity)),
    blue: Math.max(0, Math.min(255, color.blue * intensity)),
    alpha: color.alpha,
  };
}
