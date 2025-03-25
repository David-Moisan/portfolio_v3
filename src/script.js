import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

/**
 * Base
 */
//ANCHOR - Debug
const gui = new GUI({ width: 340 })

//ANCHOR - Canvas
const canvas = document.querySelector('canvas.webgl')

//ANCHOR - Scene
const scene = new THREE.Scene()

//ANCHOR - Textures
const textureLoader = new THREE.TextureLoader()
const mapTexture = textureLoader.load('/textures/mapper2.png')
mapTexture.wrapS = THREE.ClampToEdgeWrapping
mapTexture.wrapT = THREE.ClampToEdgeWrapping
mapTexture.minFilter = THREE.LinearFilter
mapTexture.magFilter = THREE.LinearFilter

//ANCHOR - Map
//ANCHOR - MapGeometry
const mapGeometry = new THREE.PlaneGeometry(2.5, 2.5, 256, 256)

//ANCHOR - MapMaterial
const mapMaterial = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
        uTime: { value:  0},
        uMap: { value: mapTexture },
        uElevationScale: { value: 0.2 },
    },
    transparent: true
})

gui.add(mapMaterial.uniforms.uElevationScale, 'value').min(0).max(1).step(0.01).name('Elevation Scale')

const map = new THREE.Mesh(mapGeometry, mapMaterial)
map.rotation.x = - Math.PI * 0.5
scene.add(map)

//ANCHOR - Circle
const circleGeometry = new THREE.CircleGeometry(0.1, 32)
const circleMaterial = new THREE.MeshBasicMaterial({
    color: 'rgb(26, 179, 204)',
    transparent: true,
    opacity: 0.8
})

const circlePositions = [
    { x: 0.13, y: 0.08, z: -0.34 },
    { x: -0.853, y: 0.08, z: -0.698 },
    { x: 0.501, y: 0.08, z: -0.853 },
    { x: -0.891, y: 0.08, z: 0.385 },
    { x: 0.733, y: 0.08, z: 0.965 }
]
const circles = []

circlePositions.forEach((pos) => {
    const circle = new THREE.Mesh(circleGeometry, circleMaterial)
    circle.rotation.x = - Math.PI * 0.5
    circle.position.set(pos.x, pos.y, pos.z)

    scene.add(circle)
    circles.push(circle)
})

//ANCHOR - Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    //ANCHOR - Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //ANCHOR - Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //ANCHOR - Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//ANCHOR - Raycaster
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
let hoveredCircle = null

const normalColor = new THREE.Color('rgb(26, 179, 204)')
const hoverColor = new THREE.Color('rgb(255, 100, 100)')

window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(circles)

    if (intersects.length > 0) {
        const circle = intersects[0].object

        if (circle !== hoveredCircle) {
            if (hoveredCircle) {
                hoveredCircle.material.color.set(normalColor)
                hoveredCircle.material.opacity = 0.8
            }

            circle.material.color.set(hoverColor)
            circle.material.opacity = 1

            hoveredCircle = circle
            document.body.style.cursor = "pointer"
        }
    } else {
        if (hoveredCircle) {
            hoveredCircle.material.color.set(normalColor);
            hoveredCircle.material.opacity = 0.8;
            hoveredCircle = null;
        }

        document.body.style.cursor = "default"
    }
})

//ANCHOR - Base Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

//ANCHOR - Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
gui.add(controls, 'enabled')

//ANCHOR - Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000, 1)

//ANCHOR - Animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    mapMaterial.uniforms.uTime.value = elapsedTime

    //ANCHOR - Update controls
    controls.update()

    //ANCHOR - Renderer
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
