import { PropsWithChildren, ReactNode, useId } from 'react';
import './Button.modules.scss';

type ButtonProps = PropsWithChildren & React.ComponentProps<"button"> & {
    /**
     * Mode du bouton
     */
    mode?: ElementMode;

    /**
     * Taille du bouton
     */
    size?: ElementSize;

    /**
     * Icon a utiliser pour le bouton
     */
    icon?: string;

    /**
     * Permet de deactiver le bouton
     */
    disabled?: boolean;

    /**
     * Si l'état du bouton est loading
     */
    loading?: boolean;

    /**
     * Lorsque le bouton est cliqué
     */
    onClick?: (event?: React.MouseEventHandler<HTMLButtonElement>) => void;
}

/**
 * Composant bouton
 */
export const Button = ({
    mode = "default", size = 'md', type = "button", ...props
}: ButtonProps): ReactNode => {
    let id = useId();
    if (props.id) id = props.id;
    return (
        <button
            id={id}
            disabled={props.disabled || props.loading}
            onClick={props.onClick}
            type={type}
            style={{...props.style, fontSize: 'small'}}
            className={`btn btn-${mode} btn-${size} shadow ${props.className}`}
        >
            {props.loading
                ? <Spinner className={`d-inline ${props.children ? 'me-2' : ''}`} />
                : props.icon && <div className={`d-inline ${props.children ? 'me-2' : ''}`}><i className={`bi bi-${props.icon}`}></i></div>
            }

            {props.children}
        </button>
    );
};

export const PrimaryButton = (props: ButtonProps): ReactNode => {
    return <Button {...props} mode='primary'></Button>
}

export const DangerButton = (props: ButtonProps): ReactNode => {
    return <Button {...props} mode='danger'></Button>
}

export const SecondaryButton = (props: ButtonProps): ReactNode => {
    return <Button {...props} mode='secondary'></Button>
}

/**
 * Chargement pour les boutons
 * @param param0 
 * @returns 
 */
function Spinner({ className }: { className?: string }) {
    return <div className={className}>
        <div className="spinner-border" style={{
            width: '1em',
            height: '1em',
            borderWidth: 2
        }} role="status">
            <span className="visually-hidden">Chargement...</span>
        </div>
    </div>
}