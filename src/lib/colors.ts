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
