import { CSSProperties, ReactNode } from "react";

export function NotFound({path} : {path?: string}): ReactNode {
    return <div className="d-flex flex-column justify-content-center align-items-center">
        <h2 style={styles.status}>Page Introuvable</h2>
        <h1 style={styles.code}>404</h1>
        <p style={styles.message}>La page que vous voulez acceder est introuvable</p>
        {path && <p style={styles.message}>Le chemin est: {path}</p>}
    </div>
}

type CSS = CSSProperties

const styles: {code: CSS, status: CSS, message: CSS} = {
    code: {
        fontSize: 200
    },
    status: {
        fontSize: 40
    },
    message: {
        fontSize: 20
    }
}