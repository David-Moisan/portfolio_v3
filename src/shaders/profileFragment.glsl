precision mediump float;

uniform vec3 uColor;
uniform float uScanY;
uniform float uTime;

varying vec3 vPosition;

// Random noise function for flicker dots
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    // ----- Scan Line effect -----
    float scanWidth = 0.5;
    float scanLine = smoothstep(uScanY - scanWidth, uScanY, vPosition.y) * 
                     (1.0 - smoothstep(uScanY, uScanY + scanWidth, vPosition.y));

    // ----- Pulse / Battement lumineux -----
    float pulse = 0.5 + 0.5 * sin(uTime * 8.0);
    float intensity = pow(scanLine, 8.0) * pulse;

    // ----- Halo circulaire -----
    float dist = length(vPosition.xy); 
    float halo = 0.4 / (dist * 5.0 + 0.5);
    halo *= pulse;

    // ----- Particles flicker -----
    float flicker = rand(vPosition.xy + uTime * 0.5);
    float particles = step(0.96, flicker) * 0.8; 

    // ----- Couleur finale -----
    vec3 scanColor = uColor * (intensity + halo + particles);
    
    // 🔥 Output
    gl_FragColor = vec4(scanColor, intensity + halo + particles);
}