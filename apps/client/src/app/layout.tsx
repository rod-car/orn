//react/no-unescaped-entities
import NextTopLoader from 'nextjs-toploader';

import "./custom.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import React from "react";

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

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
    description: "Site officiel de l'Office Regional de Nutrition Atsinanana",
    abstract: "Site officiel de l'Office Regional de Nutrition Atsinanana",
    keywords: "Nutrition, Malnutrition, Atsinanana"
};

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-800`}>
                <NextTopLoader
                    color="#071E78"
                    initialPosition={0.1}
                    crawlSpeed={300}
                    height={2}
                />
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

                <Footer />

                <a href="#" className="scroll-top">
                    <i className="lni lni-arrow-up"></i>
                </a>
                <Script src="/js/bootstrap.bundle-5.0.0.alpha-min.js" />
                <Script src="/js/count-up.min.js" />
                <Script src="/js/imagesloaded.min.js" />
                <Script src="/js/main.js" />
            </body>
        </html>
    </>
}
