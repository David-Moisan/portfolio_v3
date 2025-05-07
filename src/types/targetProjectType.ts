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

export const projects: TargetModalData[] = [
    {
        title: "JobStats",
        description: "JobStats is a project that uses the France Travail API. This website allows you to have advanced statistics on the job market as a developer in France.",
        date: "2024",
        link: "https://www.jobstats.fr/",
        imageUrl: ""
    },
    {
        title: "AlignType",
        description: "Align Type: Rust utility to synchronize types between GraphQL and TypeScript, simplifying your development workflow.",
        date: "2024",
        link: "https://github.com/David-Moisan/alignType/releases/tag/v0.0.1",
    },
    {
        title: "Ancient Temple",
        description: "Explore the ancient temple in the barren desert and find treasure.",
        date: "2022",
        link: "https://ancient-temple-by-phi-and-code.vercel.app/",
        imageUrl: ""
    },
    {
        title: "Verona Project Blockchain",
        description: "Rust Blockchain, an obscure project that hasn't been released online.",
        date: "2023",
    },
    {
        title: "Portfolio v2",
        description: "Old portfolio",
        date: "2022",
        link: "https://github.com/David-Moisan/portfolio-front-v2.6",
        imageUrl: "https://www.cjoint.com/doc/25_03/OCCoBOPac5S_Portfolio.gif"
    },
    {
        title: "Trackers",
        description: "Trackers is a revolutionary financial analysis (ongoing project...)",
        date: "2025",
    }
]