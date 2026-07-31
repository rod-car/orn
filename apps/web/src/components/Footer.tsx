import { ReactNode } from "react";

export function Footer(): ReactNode {
    return <footer className="bg-light p-4">
        <div className="d-flex justify-content-between">
            <p className="m-0">
                &copy; Copyleft GSN-CS 2023
            </p>
            <p className="m-0">
                Développé par: <a target="_blank" href="http://rod-car.lovestoblog.com">Gislain Carino Rodrigue BOUDI</a>
            </p>
        </div>
    </footer>
}   