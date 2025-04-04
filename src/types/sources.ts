export interface SourceType {
    name: string;
    type: "texture" | "font";
    path: string | string[];
}

export const sources: SourceType[] = [
    {
        name: 'environmentMapTexture',
        type: 'texture',
        path: 'textures/map_height.png'
    },
    {
        name: 'environmentMapNormalTexture',
        type: 'texture',
        path: 'textures/map_normal.png'
    },
    {
        name: 'gridMapTexture',
        type: 'texture',
        path: 'textures/gridShader.jpg'
    },
    {
        name: 'uiFont',
        type: 'font',
        path: '/fonts/helvetiker_regular.typeface.json'
    }
]