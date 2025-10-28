import { ReactNode, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Input } from "ui";
import { useApi } from "hooks";

interface CreateFolderModalProps {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
    currentFolderId: number | null;
}

export function CreateFolderModal({ show, onClose, onSuccess, currentFolderId }: CreateFolderModalProps): ReactNode {
    const [folderName, setFolderName] = useState("");
    const { Client, RequestState } = useApi({
        url: "/justificative-folders",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!folderName.trim()) {
            alert("Veuillez entrer un nom de dossier");
            return;
        }

        try {
            await Client.post({
                name: folderName,
                parent_id: currentFolderId
            });

            setFolderName("");
            onSuccess();
        } catch (error) {
            console.error("Erreur lors de la création du dossier:", error);
            alert("Erreur lors de la création du dossier");
        }
    };

    const handleClose = () => {
        setFolderName("");
        onClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-folder-plus me-2"></i>
                    Créer un nouveau dossier
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <div className="mb-3">
                        <Input
                            label="Nom du dossier"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Ex: Documents 2024"
                            autoFocus
                            required
                        />
                        {currentFolderId && (
                            <p className="mt-2">
                                <small className="text-muted">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Ce dossier sera créé dans le dossier actuel
                                </small>
                            </p>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={RequestState.creating}
                    >
                        <i className="bi bi-x me-1"></i>
                        Annuler
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={RequestState.creating || !folderName.trim()}
                    >
                        {RequestState.creating ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Création...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg me-1"></i>
                                Créer
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}