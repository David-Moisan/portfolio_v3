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
const mapTexture = textureLoader.load('/textures/mapper2.png', () => {
    console.log("texture chargée !", mapTexture)
    placeCircle()
})
mapTexture.wrapS = THREE.ClampToEdgeWrapping
mapTexture.wrapT = THREE.ClampToEdgeWrapping
mapTexture.minFilter = THREE.LinearFilter
mapTexture.magFilter = THREE.LinearFilter

//ANCHOR - Map
//ANCHOR - MapGeometry
const mapGeometry = new THREE.PlaneGeometry(2.5, 2.5, 128, 128)

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

//ANCHOR - Circle
const getElevation = (x, y) => {

    if (!mapTexture.image) {
        console.warn("La texture n'est pas encore chargée !")
        return 0
    }
    
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = mapTexture.image
    
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    const u = (x + 1) / 2
    const v = (y + 1) / 2

    const pixel = ctx.getImageData(u * img.width, v * img.height, 1, 1).data

    return (pixel[0] / 255) * mapMaterial.uniforms.uElevationScale.value
}

const circleGeometry = new THREE.CircleGeometry(0.1, 32)
const circleMaterial = new THREE.MeshBasicMaterial({
    color: 'rgb(26, 179, 204)',
    transparent: true,
    opacity: 0.8
})

const numCircles = 5;
const margin = 0.3;
const circles = [];

const placeCircle = () => {
    for (let i = 0; i < numCircles; i++) {
        const x = (Math.random() * 2 - 1) * (1 - margin)
        const y = (Math.random() * 2 - 1) * (1 - margin)
    
        const elevation = getElevation(x, y)
    
        const circle = new THREE.Mesh(circleGeometry, circleMaterial)
        circle.rotation.x = - Math.PI * 0.5
        circle.position.set(x, y, elevation);
    
        scene.add(circle)
        circles.push(circle)
    }
}

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
let hovered = false

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = (event.clientY / sizes.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(circles)

    if (intersects.length > 0) {
        document.body.style.cursor = "pointer"
        hovered = true
    } else {
        document.body.style.cursor = "default"
        hovered = false
    }
})

window.addEventListener("click", () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(circles);

    if (intersects.length > 0) {
        alert("Point cliqué !");
    }
})

//ANCHOR - MapMesh
const map = new THREE.Mesh(mapGeometry, mapMaterial)
map.rotation.x = - Math.PI * 0.5
scene.add(map)

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
