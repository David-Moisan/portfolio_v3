import gsap from 'gsap';
import * as THREE from 'three';

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
}