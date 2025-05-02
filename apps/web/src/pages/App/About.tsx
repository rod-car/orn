import { ReactNode } from "react";
import { Contributors } from ".";

export function About(): ReactNode {
    return <>
        <div className="mb-5">
            <h2>A propos du logiciel</h2>
            <p>Version: 1</p>
        </div>
        <Contributors />
    </>
}