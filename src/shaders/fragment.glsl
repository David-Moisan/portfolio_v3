precision mediump float;

#define PI 3.14159265358979323846
#define backgroundColor vec3(0.015, 0.05, 0.07)
#define blue vec3(0.1, 0.7, 0.8)
#define textColor vec3(0.6)

uniform sampler2D uMap;
uniform sampler2D uGridTexture;

varying float vTime;
varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotateUV(vec2 uv, float angle) {
    float cosA = cos(angle);
    float sinA = sin(angle);
    mat2 rotationMatrix = mat2(cosA, -sinA, sinA, cosA);
    return rotationMatrix * (uv - 0.5) + 0.5;
}

void main() {
    // Hauteur du terrain
    float height = vElevation;
    float contrast = smoothstep(0.2, 0.8, height);
    vec3 mapColor = mix(vec3(0.1, 0.5, 0.6), vec3(0.1, 0.7, 0.8), contrast);

    // 🔲 **Génération de la grille en particules** 🔲
    float gridSpacing = 10.0;
    float lineThickness = 0.015;
    float particleSize = 0.02;
    float particleDensity = 100.0;

    float gridX = abs(mod(vUv.x * gridSpacing, 1.0) - 0.5);
    float gridY = abs(mod(vUv.y * gridSpacing, 1.0) - 0.5);

    float particleX = step(particleSize, mod(vUv.x * particleDensity, 1.0));
    float particleY = step(particleSize, mod(vUv.y * particleDensity, 1.0));

    float gridParticlesX = step(gridX, lineThickness) * (1.0 - particleX);
    float gridParticlesY = step(gridY, lineThickness) * (1.0 - particleY);

    vec3 gridColor = blue * (gridParticlesX + gridParticlesY);

    vec2 cell = floor(vUv * gridSpacing);
    float cellRandom = random(cell);

    if (cellRandom > 0.97) {
        vec2 rotatedTextUv = rotateUV(fract(vUv * gridSpacing), radians(180.0));
        vec3 textSample = texture2D(uGridTexture, rotatedTextUv).rgb;
        gridColor = mix(gridColor, textColor * textSample, textSample.r);
    }

    // 🏆 **Fusion finale : background + grille + cibles**
    vec3 finalColor = backgroundColor + mix(gridColor, mapColor, height);

    gl_FragColor = vec4(finalColor, 1.0);
}
