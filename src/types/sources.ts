export interface SourceType {
    name: string;
    type: "texture";
    path: string | string[];
}

export const sources: SourceType[] = [
    {
        name: 'environmentMapTexture',
        type: 'texture',
        path: 'textures/mapper2.png'
    }
]