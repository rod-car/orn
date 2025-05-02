import Link from "next/link.js";

export default function NotFound() {
    return <section id="home" className="carousel-section-wrapper" style={{minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="error-page d-flex align-items-center justify-content-center">
            <div className="error-container text-center p-4">
                <h1 className="error-code mb-0">404</h1>
                <h2 className="display-6 error-message mb-3">Page Introuvable</h2>
                <p className="lead error-message mb-5">La page que vous voulez acceder est introuvable.</p>
                <div className="d-flex justify-content-center gap-3">
                    <Link href="/" className="btn btn-primary px-4 py-2">Retourner a la page d'accueil</Link>
                </div>
            </div>
        </div>
    </section>
}