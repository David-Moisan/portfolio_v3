import { Vector3 } from "three";

export interface TargetData {
    title: string;
    position: Vector3;
}
export interface TargetModalData {
    title: string;
    description: string;
    date: string;
    link?: string;
    imageUrl?: string;
}
