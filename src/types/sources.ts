export interface SourceType {
    name: string;
    type: "texture" | "font" | "hdr" | "gltf";
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
    },
    {
        name: 'profileEnvironment',
        type: 'hdr',
        path: 'textures/hdr/futuristic_command_center_2K.hdr'
    },
    {
        name: 'profileModel',
        type: 'gltf',
        path: '/models/gltf/LeePerrySmith-optimized.glb'
    },
    {
        name: 'cityModel',
        type: 'gltf',
        path: '/models/gltf/city-optimized.glb'
    },
    {
        name: 'droneModel',
        type: 'gltf',
        path: '/models/gltf/drone-optimized.glb'
    }
]