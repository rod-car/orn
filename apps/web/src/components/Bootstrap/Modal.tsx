import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import ReactModal from "react-modal";

type ModalProps = PropsWithChildren & {
    isOpen: boolean;
    title: string;
    onClose: () => void;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps): ReactNode {
    const customStyles: Record<string, CSSProperties> = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-25%',
            transform: 'translate(-50%, -50%)',
            padding: 0,
            boxShadow: '2px 2px 2px grey'
        }
    };
    return <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Exemple de modal"
        style={customStyles}
    >
        <div className="p-3 app-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title text-primary">{title}</h5>
                    <button onClick={onClose} type="button" className="btn-close btn-primary" aria-label="Close"></button>
                </div>
                <hr />
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    </ReactModal>
}