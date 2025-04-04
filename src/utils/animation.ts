import { TargetData } from '@/types/targetProjectType';
import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons';

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

    static flyTo(
        object: THREE.PerspectiveCamera,
        controls: OrbitControls, 
        zoomPosition: THREE.Vector3,
        target: TargetData,
        duration: number = 2
    ) {
        gsap.to(object.position, {
            x: zoomPosition.x,
            y: zoomPosition.y,
            z: zoomPosition.z,
            duration,
            ease: "power2.inOut",
            onUpdate: () => {
                const lookAtTarget = new THREE.Vector3().copy(target.position)
                object.lookAt(lookAtTarget)
            }
        })

        gsap.to(controls.target, {
            x: target.position.x,
            y: target.position.y,
            z: target.position.z,
            duration,
            ease: "power2.inOut",
            onUpdate: () => {
                controls.update()
            }
        })
    }
}