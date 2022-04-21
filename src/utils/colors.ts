export const successColor = (colorMode = 'light') =>
  colorMode === 'light' ? 'var(--chakra-colors-success-600)' : 'var(--chakra-colors-success-600)';
export const warningColor = (colorMode = 'light') =>
  colorMode === 'light' ? 'var(--chakra-colors-warning-400)' : 'var(--chakra-colors-warning-400)';
export const errorColor = (colorMode = 'light') =>
  colorMode === 'light' ? 'var(--chakra-colors-danger-400)' : 'var(--chakra-colors-danger-400)';

const mix = (start: number, end: number, percent: number) => start + percent * (end - start);

const generateHex = (red: number, green: number, blue: number) => {
  let r = red.toString(16);
  let g = green.toString(16);
  let b = blue.toString(16);

  while (r.length < 2) {
    r = `0${r}`;
  }
  while (g.length < 2) {
    g = `0${g}`;
  }
  while (b.length < 2) {
    b = `0${b}`;
  }

  return `#${r}${g}${b}`;
};

export const getBlendedColor = (
  color1: [string, string, string, string, string, string, string],
  color2: [string, string, string, string, string, string, string],
  percent: number,
) => {
  const red1 = parseInt(color1[1] + color1[2], 16);
  const green1 = parseInt(color1[3] + color1[4], 16);
  const blue1 = parseInt(color1[5] + color1[6], 16);

  const red2 = parseInt(color2[1] + color2[2], 16);
  const green2 = parseInt(color2[3] + color2[4], 16);
  const blue2 = parseInt(color2[5] + color2[6], 16);

  const red = Math.round(mix(red1, red2, percent));
  const green = Math.round(mix(green1, green2, percent));
  const blue = Math.round(mix(blue1, blue2, percent));

  return generateHex(red, green, blue);
};
