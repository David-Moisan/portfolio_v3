import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons';
import SFXManager from './sfxManager';

export default class Animation {
    static pulse(
        object: THREE.Group | THREE.Mesh,
        scaleMax: number = 1.2,
        duration: number = 1
    ) {
        gsap.to(object.scale, {
            x: scaleMax, y: scaleMax, z: scaleMax,
            duration,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        })
    }

    static blink(
        object: THREE.Object3D,
        opacityMin: number = 0.4,
        duration: number = 1
    ) {
        if (object instanceof THREE.Mesh) {
            gsap.to(object.material, {
                opacity: opacityMin,
                duration,
                yoyo: true,
                repeat: -1,
                ease: "power1.inOut"
            })
        } else if (object instanceof THREE.Group) {
            object.children.forEach(child => {
                if (child instanceof THREE.Mesh) {
                    gsap.to(child.material, {
                        opacity: opacityMin,
                        duration,
                        yoyo: true,
                        repeat: -1,
                        ease: "power1.inOut"
                    })
                }
            })
        }
    }

    static rotate(
        object: THREE.Group | THREE.Mesh,
        speed: number = 0.5 
    ) {
        gsap.to(object.rotation, {
            z: "+=6.28319", // 2 * Math.PI = 360° en radians
            duration: speed,
            repeat: -1,
            ease: "none"
        })
    }

    static fadeIn(object: THREE.Object3D, duration: number = 0.3) {
        if (object instanceof THREE.Mesh) {
            gsap.to(object.material, {
                opacity: 1,
                duration,
                ease: "power2.out",
                onStart: () => {
                    object.material.transparent = true
                    object.material.needsUpdate = true
                }
            })
        } else if (object instanceof THREE.Group) {
            object.children.forEach(child => {
                if (child instanceof THREE.Mesh) {
                    gsap.to(object, {
                        opacity: 1,
                        duration,
                        ease: "power2.out",
                        onStart: () => {
                            child.material.transparent = true
                            child.material.needsUpdate = true
                        }
                    })
                }
            })
        }
    }

    static fadeOut(object: THREE.Object3D, duration: number = 0.1) {
        gsap.to(object, {
            opacity: 0,
            duration,
            ease: "power2.in",
            onComplete: () => {
                if (object.parent) object.parent.remove(object)
            }
        })
    }

    static cinematic(
        camera: THREE.PerspectiveCamera,
        controls: OrbitControls,
        onComplete?: () => void
    ) {
        controls.enabled = false
        SFXManager.playZoomCameraSound()
    
        const center = new THREE.Vector3(0, 0, 0)
        const startPos = new THREE.Vector3(0, 8, 0)
        const midPos = new THREE.Vector3(0, 3, 0)
        const endPos = new THREE.Vector3(1.5, 1, 6)
        const endLookAt = new THREE.Vector3(-1.5, 0, 0)
    
        // --- SETUP initial sans animation ---
        camera.position.copy(startPos)
        controls.target.copy(center)
        camera.lookAt(center)
        camera.updateMatrixWorld()
    
        // --- Setup dummy rotation
        const dummy = new THREE.Object3D()
        dummy.position.copy(startPos)
        dummy.lookAt(center)
        const startQuat = dummy.quaternion.clone()
    
        dummy.position.copy(endPos)
        dummy.lookAt(endLookAt)
        const endQuat = dummy.quaternion.clone()
    
        // --- Timeline
        const timeline = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            onComplete: () => {
                controls.enabled = true
    
                // 🔒 Ne surtout pas forcer target ou lookAt ici
                // -> ça override le quaternion final
                // camera.lookAt(endLookAt) ← Supprimé
                // controls.target.copy(endLookAt) ← Supprimé
                onComplete?.()
            }
        })
    
        // Phase 1 – Pause satellite
        timeline.to({}, { duration: 0.6 })
    
        // Phase 2 – Zoom vertical (sans toucher au quaternion !)
        const yRef = { value: startPos.y }
        timeline.to(yRef, {
            value: midPos.y,
            duration: 1.2,
            onUpdate: () => {
                camera.position.set(0, yRef.value, 0)
                camera.updateMatrixWorld()
            }
        })
    
        // Phase 3 – Interpolation position + rotation
        const t = { value: 0 }
        timeline.to(t, {
            value: 1,
            duration: 2.2,
            ease: "power2.inOut",
            onUpdate: () => {
                // Position fluide
                camera.position.lerpVectors(midPos, endPos, t.value)
    
                // Rotation fluide
                const interpolated = new THREE.Quaternion().copy(startQuat).slerp(endQuat, t.value)
                camera.quaternion.copy(interpolated)
    
                camera.updateMatrixWorld()
            }
        })
    }
}