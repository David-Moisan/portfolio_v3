export const COLORS = {
    primary: 0x1ab3cc,
    hover: 0xff6464,
    background: 0x1a1a2e,
    brightTurquoise: 0x00ffcc,
    cyprus: 0x06151C,
    aqua: 0x00ffff,
    black: 0x0f0f0f
}

export const OPACITIES = {
    default: 0.8,
    hover: 1
}

export enum CURSORS {
    DEFAULT = "default",
    POINTER = "pointer"
}

export interface IStyleConfig {
    colors: typeof COLORS;
    opacities: typeof OPACITIES;
    cursors: typeof CURSORS;
}