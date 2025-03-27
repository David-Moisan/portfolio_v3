export const COLORS = {
    primary: "rgb(26, 179, 204)",
    hover: "rgb(255, 100, 100)",
    background: "rgb(0, 0, 0)"
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