import { PropsWithChildren, ReactNode } from "react";
import "./Card.modules.scss";

type CardProps = PropsWithChildren & {
    /**
     * Conténu a mettre dans l'entête
     */
    title: ReactNode,
    /**
     * Fotter
     */
    footer?: ReactNode
};

export function Card ({ title, children, footer }: CardProps) {
    return <div className="card">
        <div className="card-header">
            <div className="card-title">{title}</div>
        </div>
        <div className="card-body">
            {children}
        </div>
        {footer && <div className="card-footer">
            {footer}
        </div>}
    </div>
}