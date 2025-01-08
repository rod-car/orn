import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import "./custom.css";
import { NextScript } from "next/document.js";
import Script from "next/script.js";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "ORN Atsinanana",
    description: "Site officiel de l'ORN Atsinanana",
};

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        <html lang="en">
            <title>ORN Atsinanana</title>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-800`}>
                <div className="preloader">
                    <div className="loader">
                        <div className="ytp-spinner">
                            <div className="ytp-spinner-container">
                                <div className="ytp-spinner-rotator">
                                    <div className="ytp-spinner-left">
                                        <div className="ytp-spinner-circle"></div>
                                    </div>
                                    <div className="ytp-spinner-right">
                                        <div className="ytp-spinner-circle"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <header className="header navbar-area bg-white">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-12">
                                <nav className="navbar navbar-expand-lg">
                                    <a className="navbar-brand" href="index.html">
                                        <img src="/img/logo/logo.svg" alt="Logo" />
                                    </a>
                                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                        aria-expanded="false" aria-label="Toggle navigation">
                                        <span className="toggler-icon"></span>
                                        <span className="toggler-icon"></span>
                                        <span className="toggler-icon"></span>
                                    </button>

                                    <div className="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                                        <ul id="nav" className="navbar-nav ml-auto">
                                            <li className="nav-item">
                                                <a className="page-scroll active" href="#home">Home</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="page-scroll" href="#about">About</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="page-scroll" href="#services">Services</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="page-scroll" href="#portfolio">Portfolio</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="page-scroll" href="#team">Team</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="page-scroll" href="#contact">Contact</a>
                                            </li>
                                        </ul>
                                        <div className="header-btn">
                                            <a href="javascript:void(0)" className="theme-btn">Get Started</a>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </header>

                {children}
                <footer className="footer pt-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-6">
                                <div className="footer-widget mb-60 wow fadeInLeft" data-wow-delay=".2s">
                                    <a href="index.html" className="logo mb-30"><img src="/img/logo/logo.svg" alt="logo" /></a>
                                    <p className="mb-30 footer-desc">We Crafted an awesome desig library that is robust and intuitive to use. No matter you're building a business presentation websit.</p>
                                </div>
                            </div>
                            <div className="col-xl-2 offset-xl-1 col-lg-2 col-md-6">
                                <div className="footer-widget mb-60 wow fadeInUp" data-wow-delay=".4s">
                                    <h4>Quick Link</h4>
                                    <ul className="footer-links">
                                        <li>
                                            <a href="javascript:void(0)">Home</a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)">About Us</a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)">Service</a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)">Contact</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-6">
                                <div className="footer-widget mb-60 wow fadeInUp" data-wow-delay=".6s">
                                    <h4>Service</h4>
                                    <ul className="footer-links">
                                        <li>
                                            <a href="javascript:void(0)">Marketing</a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)">Branding</a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)">Web Design</a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)">Graphics Design</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-6">
                                <div className="footer-widget mb-60 wow fadeInRight" data-wow-delay=".8s">
                                    <h4>Contact</h4>
                                    <ul className="footer-contact">
                                        <li>
                                            <p>+00983467367234</p>
                                        </li>
                                        <li>
                                            <p>yourmail@gmail.com</p>
                                        </li>
                                        <li>
                                            <p>Jackson Heights, NY<br />USA</p>
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
                                            <li><a href="javascript:void(0)"><i className="lni lni-facebook-original"></i></a></li>
                                            <li><a href="javascript:void(0)"><i className="lni lni-twitter-original"></i></a></li>
                                            <li><a href="javascript:void(0)"><i className="lni lni-linkedin-original"></i></a></li>
                                            <li><a href="javascript:void(0)"><i className="lni lni-instagram-original"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <p className="wow fadeInUp" data-wow-delay=".3s">Template by <a href="https://uideck.com" rel="nofollow">UIdeck</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

                <a href="#" className="scroll-top">
                    <i className="lni lni-arrow-up"></i>
                </a>
                <Script src="js/bootstrap.bundle-5.0.0.alpha-min.js"/>
                <Script src="js/count-up.min.js"/>
                <Script src="js/wow.min.js"/>
                <Script src="js/imagesloaded.min.js"/>
                <Script src="js/main.js"/>
            </body>
        </html>
    </>
}
