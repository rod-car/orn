import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import "./custom.css";
import Script from "next/script";
import React from "react";

import {Header} from '@/app/components/Header'

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

                <Header />

                {children}
                <footer className="footer pt-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-6">
                                <div className="footer-widget mb-60 wow fadeInLeft" data-wow-delay=".2s">
                                    <a href="index.html" className="logo mb-30">
                                        <img style={{width: 50, height: "auto"}} src="/img/logo/logo.png" alt="logo" />
                                        <span className="font-weight-bold ml-3 font-size-xl">ORN Atsinanana</span>
                                    </a>
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
                                    <p className="wow fadeInUp" data-wow-delay=".3s">ORN Atsinanana</p>
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
