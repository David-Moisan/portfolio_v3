export interface SourceType {
    name: string;
    type: "texture" | "font";
    path: string | string[];
}

export const sources: SourceType[] = [
    {
        name: 'environmentMapTexture',
        type: 'texture',
        path: 'textures/mapper2.png'
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