import Link from "next/link";
import { PropsWithChildren } from "react";

type ServiceBlockProps = {
    title: string;
    icon: string;
    link?: string;
}

export default function ServiceBlock({title, icon, children, link = "#"}: ServiceBlockProps & PropsWithChildren) {
    return <Link href={link} className="col-lg-4 col-md-6 mb-4">
        <div className="service-box h-100 box-style">
            <div className="service-icon box-icon-style">
                <i className={`lni lni-${icon}`}></i>
            </div>
            <div className="box-content-style service-content">
                <h4>{title}</h4>
                <p className="text-justify">{children}</p>
            </div>
        </div>
    </Link>
}