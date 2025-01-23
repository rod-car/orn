import Link from "next/link.js";

export function Footer() {
    return <footer className="footer bg-white pt-100">
        <div className="container">
            <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-6 pr-5">
                    <div className="footer-widget mb-60 wow fadeInLeft" data-wow-delay=".2s">
                        <Link href="/" className="logo mb-30">
                            <img style={{ width: 50, height: "auto" }} src="/img/logo/logo.png" alt="logo" />
                            <span className="font-weight-bold ml-3 font-size-xl">ORN Atsinanana</span>
                        </Link>
                        <p className="mb-30 footer-desc text-justify">La nutrition, garant du développement social et économique pour Madagascar.</p>
                    </div>
                </div>

                <div className="col-xl-3 col-lg-3 col-md-3">
                    <div className="footer-widget mb-60 wow fadeInUp" data-wow-delay=".4s">
                        <h4>Liens rapides</h4>
                        <ul className="footer-links">
                            <li>
                                <Link href="#accueil">Accueil</Link>
                            </li>
                            <li>
                                <Link href="#a-propos">À propos</Link>
                            </li>
                            <li>
                                <Link href="#services">Services</Link>
                            </li>
                            <li>
                                <Link href="#activites">Activites</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="col-xl-3 col-lg-3 col-md-3">
                    <div className="footer-widget mb-60 wow fadeInRight" data-wow-delay=".8s">
                        <h4>Contact</h4>
                        <ul className="footer-contact">
                            <li>
                                <p>+261 32 11 158 37</p>
                            </li>
                            <li>
                                <p>orn-atsinanana@gmail.com</p>
                            </li>
                            <li>
                                <p>Villa Eglé, angle Boulevard Augagneur
                                501 Toamasina, Madagascar</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="copyright-area">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div className="footer-social-links">
                            <ul className="d-flex">
                                <li><Link href="https://www.facebook.com/profile.php?id=100064364605571"><i className="lni lni-facebook-original"></i></Link></li>
                                {/*<li><Link href="javascript:void(0)"><i className="lni lni-twitter-original"></i></Link></li>
                                <li><Link href="javascript:void(0)"><i className="lni lni-linkedin-original"></i></Link></li>
                                <li><Link href="javascript:void(0)"><i className="lni lni-instagram-original"></i></Link></li>*/}
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <p className="wow fadeInUp" data-wow-delay=".3s">ORN Atsinanana</p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
}