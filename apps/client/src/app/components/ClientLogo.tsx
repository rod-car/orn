import Link from "next/link.js";
import { CSSProperties } from "react";

export default function ClientLogo ({src, alt = "Image"}: {src: string, alt: string}) {
    return <div className="client-logo" style={styles}>
        <Link target="_blank" href="#">
            <img style={{height: 'auto', width: 150}} src={src} alt={alt} />
        </Link>
    </div>
}

const styles: CSSProperties = {
    height: 150,
    margin: 20,
    display:
    'flex',
    alignItems: 'center'
}