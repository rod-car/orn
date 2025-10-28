import { ReactNode, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Input } from "ui";
import { useApi } from "hooks";

interface Folder {
    id: number;
    name: string;
}

interface RenameFolderModalProps {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
    folder: Folder;
}

export function RenameFolderModal({ show, onClose, onSuccess, folder }: RenameFolderModalProps): ReactNode {
    const [folderName, setFolderName] = useState("");
    const { Client, RequestState } = useApi({
        url: `/justificative-folders`,
    });

    useEffect(() => {
        if (folder) {
            setFolderName(folder.name);
        }
    }, [folder]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!folderName.trim()) {
            alert("Veuillez entrer un nom de dossier");
            return;
        }

        try {
            await Client.put(folder.id, {
                name: folderName
            });

            onSuccess();
        } catch (error) {
            console.error("Erreur lors du renommage:", error);
            alert("Erreur lors du renommage du dossier");
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-pencil me-2"></i>
                    Renommer le dossier
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Nouveau nom</label>
                        <Input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Nouveau nom du dossier"
                            autoFocus
                            required
                        />
                        <p className="mt-2">
                            <small className="text-muted">
                                Nom actuel: <strong>{folder.name}</strong>
                            </small>
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={RequestState.updating}>
                        Annuler
                    </Button>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={RequestState.updating || !folderName.trim()}
                    >
                        {RequestState.updating ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Renommage...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg me-1"></i>
                                Renommer
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}