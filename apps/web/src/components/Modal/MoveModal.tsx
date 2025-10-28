import { ReactNode, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useApi } from "hooks";

interface Folder {
    id: number;
    name: string;
    parent_id: number | null;
    children_count: number;
}

interface MoveModalProps {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
    item: { type: 'file' | 'folder'; id: number };
    currentFolderId: number | null;
}

export function MoveModal({ show, onClose, onSuccess, item, currentFolderId }: MoveModalProps): ReactNode {
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [breadcrumb, setBreadcrumb] = useState<{ id: number; name: string }[]>([]);
    const [currentViewFolderId, setCurrentViewFolderId] = useState<number | null>(null);

    const { Client: FoldersClient, RequestState: FoldersRequestState } = useApi({
        url: "/justificatives",
    });

    const { Client: MoveClient, RequestState: MoveRequestState } = useApi({
        url: "/justificatives/move",
    });

    useEffect(() => {
        if (show) {
            loadFolders(currentFolderId);
        }
    }, [show]);

    const loadFolders = async (folderId: number | null) => {
        try {
            const response = await FoldersClient.get({ 
                paginate: false,
                folder_id: folderId ?? ""
            });

            if (response) {
                setFolders(response.folders || []);
                setBreadcrumb(response.breadcrumb || []);
                setCurrentViewFolderId(folderId);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des dossiers:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await MoveClient.post({
                type: item.type,
                id: item.id,
                target_folder_id: selectedFolderId
            });
            
            onSuccess();
        } catch (error) {
            console.error("Erreur lors du déplacement:", error);
            alert("Erreur lors du déplacement");
        }
    };

    const navigateToFolder = (folderId: number | null) => {
        loadFolders(folderId);
        setSelectedFolderId(null);
    };

    const selectFolder = (folderId: number | null) => {
        setSelectedFolderId(folderId);
    };

    // Filtrer le dossier actuel pour éviter de déplacer dans lui-même
    const filteredFolders = item.type === 'folder' 
        ? folders.filter(f => f.id !== item.id)
        : folders;

    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-arrows-move me-2"></i>
                    Déplacer {item.type === 'file' ? 'le fichier' : 'le dossier'}
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Sélectionnez la destination</label>
                        
                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb" className="mb-3">
                            <ol className="breadcrumb bg-light p-2 rounded">
                                <li className="breadcrumb-item">
                                    <a 
                                        href="#" 
                                        onClick={(e) => { e.preventDefault(); navigateToFolder(null); }}
                                        className="text-decoration-none"
                                    >
                                        <i className="bi bi-house-door me-1"></i>
                                        Racine
                                    </a>
                                </li>
                                {breadcrumb.map((item, index) => (
                                    <li 
                                        key={item.id} 
                                        className={`breadcrumb-item ${index === breadcrumb.length - 1 ? 'active' : ''}`}
                                    >
                                        {index === breadcrumb.length - 1 ? (
                                            <span>{item.name}</span>
                                        ) : (
                                            <a 
                                                href="#" 
                                                onClick={(e) => { e.preventDefault(); navigateToFolder(item.id); }}
                                                className="text-decoration-none"
                                            >
                                                {item.name}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </nav>

                        {/* Option pour dossier actuel */}
                        <div 
                            className={`p-3 mb-2 border rounded cursor-pointer ${selectedFolderId === currentViewFolderId ? 'bg-primary text-white' : 'bg-light'}`}
                            onClick={() => selectFolder(currentViewFolderId)}
                            style={{ cursor: 'pointer' }}
                        >
                            <i className="bi bi-folder me-2"></i>
                            <strong>Déplacer ici</strong>
                            {currentViewFolderId === null && ' (Racine)'}
                        </div>

                        {/* Liste des sous-dossiers */}
                        {FoldersRequestState.loading ? (
                            <div className="text-center py-3">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Chargement...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="list-group">
                                {filteredFolders.length === 0 ? (
                                    <div className="text-muted text-center py-3">
                                        <i className="bi bi-inbox"></i>
                                        <p className="mb-0">Aucun sous-dossier</p>
                                    </div>
                                ) : (
                                    filteredFolders.map((folder) => (
                                        <div 
                                            key={folder.id}
                                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div 
                                                className="flex-grow-1"
                                                onClick={() => navigateToFolder(folder.id)}
                                            >
                                                <i className="bi bi-folder-fill text-warning me-2"></i>
                                                {folder.name}
                                                <small className="text-muted ms-2">
                                                    ({folder.children_count} sous-dossier{folder.children_count !== 1 ? 's' : ''})
                                                </small>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant={selectedFolderId === folder.id ? "primary" : "outline-primary"}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    selectFolder(folder.id);
                                                }}
                                            >
                                                {selectedFolderId === folder.id ? (
                                                    <>
                                                        <i className="bi bi-check-lg me-1"></i>
                                                        Sélectionné
                                                    </>
                                                ) : (
                                                    'Sélectionner'
                                                )}
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {selectedFolderId !== null && (
                            <div className="alert alert-info mt-3 mb-0">
                                <i className="bi bi-info-circle me-2"></i>
                                Destination sélectionnée
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={MoveRequestState.creating}>
                        Annuler
                    </Button>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={MoveRequestState.creating || selectedFolderId === currentFolderId}
                    >
                        {MoveRequestState.creating ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Déplacement...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg me-1"></i>
                                Déplacer
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}