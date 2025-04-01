import gsap from "gsap";

gsap.config({
    autoSleep: 60,
    force3D: true,
    nullTargetWarn: false
})

declare module 'gsap' {
    interface TweenVars {
        opacity?: number;
    }
}