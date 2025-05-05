precision mediump float;

#define PI 3.14159265358979323846
#define BACKGROUND_COLOR vec3(0.015, 0.05, 0.07)
#define BLUE_COLOR vec3(0.1, 0.7, 0.8)
#define TEXT_COLOR vec3(0.6)
#define COAST_WAVES_AMOUNT 5.0
#define COAST_WAVES_SPEED 0.1
#define DATASTREAM_SPEED 50.0
#define DATASTREAM_ROADS 5.0
#define DATASTREAM_AMOUNT 0.8

uniform sampler2D uMap;
uniform sampler2D uGridTexture;

varying float vTime;
varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float random(float x) {
    return fract(sin(x * 12.9898) * 43758.5453123);
}

vec2 rotateUV(vec2 uv, float angle) {
    float cosA = cos(angle);
    float sinA = sin(angle);
    mat2 rotationMatrix = mat2(cosA, -sinA, sinA, cosA);
    return rotationMatrix * (uv - 0.5) + 0.5;
}

void main() {
    // Calcul de l'éclairage basé sur les normales
    vec3 lightDirection = normalize(vec3(0.3, 1.0, 0.5));
    float lightIntensity = max(dot(vNormal, lightDirection), 0.0);
    lightIntensity = mix(0.3, 1.0, lightIntensity);

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

    vec3 gridColor = BLUE_COLOR * (gridParticlesX + gridParticlesY);

    // 📌 **Ajout des caractères aléatoires sur la grille**
    vec2 cell = floor(vUv * gridSpacing);
    float cellRandom = random(cell);

    if (cellRandom > 0.97) {
        vec2 rotatedTextUv = rotateUV(fract(vUv * gridSpacing), radians(180.0));
        vec3 textSample = texture2D(uGridTexture, rotatedTextUv).rgb;
        gridColor = mix(gridColor, TEXT_COLOR * textSample, textSample.r);
    }

    // Cellules barrées/grisées aléatoires
    bool isBlockedCell = cellRandom > 0.92 && cellRandom <= 0.95;
    if (isBlockedCell) {
        vec2 cellOrigin = cell / gridSpacing;
        vec2 localUV = (vUv - cellOrigin) * gridSpacing;

        float stripes = step(0.5, abs(sin((localUV.x + localUV.y) * 45.0)));
        vec3 blockedColor = BLUE_COLOR;
        gridColor = mix(gridColor, blockedColor, stripes * 0.3);
    }

    vec3 finalColor = BACKGROUND_COLOR + mix(gridColor, mapColor, height) * lightIntensity;

    gl_FragColor = vec4(finalColor, 1.0);
}
