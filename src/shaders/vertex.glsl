precision mediump float;

uniform float uTime;
uniform sampler2D uMap;
uniform float uElevationScale;

varying vec2 vUv;
varying float vTime;
varying float vElevation;
varying vec3 vNormal;

void main() {
    vUv = uv;
    vTime = uTime;

    // Lire la heightmap
    float height = texture2D(uMap, uv).r;

    // Elevation du terrain en fonction de la hauteur de la texture
    vec3 newPosition = position + normal * height * uElevationScale;

    // Maj de la normale pour corriger l'éclairage
    vec3 newNormal = normalize(normal + vec3(0.0, height * 0.1, 0.0));

    // Création d'un effet de légère onde
    // vec3 pos = position;
    // float distorsion = sin(pos.x * 5.0 + uTime) * 0.02;
    // pos.z += distorsion;

    vElevation = height;
    vNormal = newNormal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}