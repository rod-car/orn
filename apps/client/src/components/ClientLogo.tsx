import Image from "next/image.js";
import Link from "next/link.js";
import { CSSProperties } from "react";

export default function ClientLogo ({src, alt = "Image", url = "#"}: {src: string, alt: string, url?: string}) {
    return <div className="client-logo" style={styles}>
        <Link target="_blank" href={url}>
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