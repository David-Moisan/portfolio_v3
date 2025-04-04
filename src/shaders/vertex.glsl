precision mediump float;

uniform float uTime;
uniform sampler2D uMap;
uniform sampler2D uNormalMap;
uniform float uElevationScale;
uniform float uNormalStrength;

varying vec2 vUv;
varying float vTime;
varying float vElevation;
varying vec3 vNormal;

void main() {
    vUv = uv;
    vTime = uTime;

    // Lire la heightmap
    float height = texture2D(uMap, uv).r;

    // Récupération de la normal map et transformation en valeurs normales
    vec3 normalSample = texture2D(uNormalMap, uv).rgb * 2.0 - 1.0;
    normalSample.xy *= uNormalStrength;
    vec3 newNormal = normalize(normal + normalSample);

    // Elevation du terrain en fonction de la hauteur de la texture
    vec3 newPosition = position + normal * height * uElevationScale;

    // Maj de la normale pour corriger l'éclairage
    // vec3 newNormal = normalize(normal + vec3(0.0, height * 0.1, 0.0));

    vElevation = height;
    vNormal = newNormal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}