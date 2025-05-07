export const COLORS = {
    primary: 0x1ab3cc,
    hover: 0xff6464,
    background: 0x1a1a2e,
    brightTurquoise: 0x00ffcc,
    cyprus: 0x06151C,
    aqua: 0x00ffff,
    black: 0x0f0f0f
}

export enum CURSORS {
    DEFAULT = "default",
    POINTER = "pointer"
}

export const DOMStyle = {
    flex: "flex",
    displayNone: 'none',
    inlineBlock: 'inline-block',
    block: 'block',
    fullOpacity: '0',
    visibleOpacity: "1",
    opacityTransition: 'opacity 0.5s ease',
    z1000: '1000'
}

export interface IStyleConfig {
    colors: typeof COLORS;
    cursors: typeof CURSORS;
}