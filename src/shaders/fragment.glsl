precision mediump float;

#define PI 3.14159265358979323846
#define backgroundColor vec3(0.015, 0.05, 0.07)
#define blue vec3(0.1, 0.7, 0.8)

uniform sampler2D uMap;

varying float vTime;
varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;

// Fonction de bruit pseudo-aléatoire
// float random(vec2 uv) {
//     return fract(sin(dot(uv, vec2(127.1, 311.7))) * 43758.5453123);
// }

// float drawCircle(vec2 uv, vec2 center, float radius, float blur) {
//     float dist = distance(uv, center);
//     return smoothstep(radius, radius - blur, dist);
// }

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

    // // Génération des cercles aléatoire
    // vec3 circles = vec3(0.0);
    // const int numCircles = 5;

    // vec2 circlePositions[numCircles];
    // for (int i = 0; i < numCircles; i++) {
    //     vec2 seed = vec2(float(i) * 10.0, float(i) * 20.0);

    //     float margin = 0.1;
    //     circlePositions[i] = margin + (vec2(random(seed), random(seed + vec2(1.0, 1.0)))* (1.0 - 2.0 * margin));
    // }

    // // ⚙️ Paramètres pour l'effet futuriste des cercles
    // float circleSize = 0.01;
    // float glowSize = 0.04;
    // float pulse = sin(vTime * 2.0) * 0.005;

    // // Dessiner les cercles
    // for (int i = 0; i < numCircles; i++) {
    //     vec2 pos = circlePositions[i];

    //     float mainCircle = drawCircle(vUv, pos, circleSize, 0.005);
    //     float glow = drawCircle(vUv, pos, glowSize, 0.01) * 0.5;
    //     float outerCircle = drawCircle(vUv, pos, circleSize + 0.015 + pulse, 0.002) * 0.8;

    //     circles += (mainCircle + glow + outerCircle) * blue;
    // }

    // 🏆 **Fusion finale : background + grille + cibles**
    vec3 finalColor = backgroundColor + mix(gridColor, mapColor, height); // + targetColor;

    gl_FragColor = vec4(finalColor, 1.0);
}
