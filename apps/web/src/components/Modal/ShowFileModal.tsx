import { useApi } from "hooks";
import { config } from "@base/config";
import { toast } from "@base/ui";
import { ReactNode, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";

interface ShowFileModalProps {
    show: boolean;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    justificative: Justificative | null;
    canEdit?: boolean;
    canDelete?: boolean;
}

export function ShowFileModal({ 
    show, 
    onClose, 
    onEdit, 
    onDelete, 
    justificative, 
    canEdit = false, 
    canDelete = false 
}: ShowFileModalProps): ReactNode {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { Client, RequestState } = useApi({
        url: justificative ? `/justificatives/${justificative.id}` : '',
    });

    const handleDelete = () => {
        if (!justificative) return;

        confirmAlert({
            title: "Confirmation de suppression",
            message: `Êtes-vous sûr de vouloir supprimer le fichier "${justificative.name}" ? Cette action est irréversible.`,
            closeOnClickOutside: false,
            buttons: [
                {
                    label: "Oui, supprimer",
                    className: "btn btn-danger",
                    onClick: async () => {
                        try {
                            await Client.destroy(justificative.id);
                            toast("Justificatif supprimé", { 
                                type: "success"
                            });
                            onDelete?.();
                            onClose();
                        } catch (error) {
                            toast("Erreur lors de la suppression", { 
                                type: "error"
                            });
                        }
                    },
                },
                {
                    label: "Annuler",
                    className: "btn btn-secondary",
                },
            ],
        });
    };

    const getFileIcon = (type?: string): string => {
        if (!type) return 'bi-file-earmark';
        if (type.includes('image')) return 'bi-file-earmark-image text-primary';
        if (type.includes('pdf')) return 'bi-file-earmark-pdf text-danger';
        if (type.includes('word')) return 'bi-file-earmark-word text-primary';
        if (type.includes('excel') || type.includes('spreadsheet')) return 'bi-file-earmark-excel text-success';
        if (type.includes('zip') || type.includes('compressed')) return 'bi-file-earmark-zip text-warning';
        return 'bi-file-earmark text-secondary';
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    if (!justificative) return null;

    return (
        <Modal 
            show={show} 
            onHide={onClose} 
            centered 
            size="xl"
            fullscreen={isFullscreen ? true : undefined}
        >
            <Modal.Header closeButton className="border-bottom-0 pb-0">
                <div className="d-flex align-items-center w-100">
                    <div className="flex-grow-1">
                        <Modal.Title className="mb-0">
                            <div className="d-flex align-items-center">
                                <i className={`${getFileIcon(justificative.file_type)} me-3 fs-4`}></i>
                                <div>
                                    <h5 className="mb-0">{justificative.name}</h5>
                                    <small className="text-muted">
                                        {justificative.file_type?.toUpperCase()} • {justificative.file_size_human}
                                    </small>
                                </div>
                            </div>
                        </Modal.Title>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={toggleFullscreen}
                            title={isFullscreen ? "Quitter le mode plein écran" : "Mode plein écran"}
                        >
                            <i className={`bi ${isFullscreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'}`}></i>
                        </Button>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className="pt-0">
                {/* Informations du fichier */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="card border-0 bg-light">
                            <div className="card-body">
                                <h6 className="card-title mb-3">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Informations du fichier
                                </h6>
                                <div className="row small">
                                    <div className="col-5 text-muted">Type :</div>
                                    <div className="col-7 fw-medium">{justificative.file_type}</div>
                                    
                                    <div className="col-5 text-muted">Taille :</div>
                                    <div className="col-7 fw-medium">{justificative.file_size_human}</div>
                                    
                                    <div className="col-5 text-muted">Uploadé par :</div>
                                    <div className="col-7 fw-medium">{justificative.uploaded_by.name}</div>
                                    
                                    <div className="col-5 text-muted">Email :</div>
                                    <div className="col-7 fw-medium">{justificative.uploaded_by.email}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-6">
                        <div className="card border-0 bg-light">
                            <div className="card-body">
                                <h6 className="card-title mb-3">
                                    <i className="bi bi-calendar me-2"></i>
                                    Dates
                                </h6>
                                <div className="row small">
                                    <div className="col-5 text-muted">Créé le :</div>
                                    <div className="col-7 fw-medium">{formatDate(justificative.created_at)}</div>
                                    
                                    <div className="col-5 text-muted">Modifié le :</div>
                                    <div className="col-7 fw-medium">{formatDate(justificative.updated_at)}</div>
                                    
                                    {justificative.folder && (
                                        <>
                                            <div className="col-5 text-muted">Dossier :</div>
                                            <div className="col-7 fw-medium">{justificative.folder.name}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prévisualisation du fichier */}
                <div className="border rounded">
                    <div className="border-bottom bg-light px-3 py-2 d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Aperçu</h6>
                        <a
                            href={justificative.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                            download
                        >
                            <i className="bi bi-download me-1"></i>
                            Télécharger
                        </a>
                    </div>
                    
                    <div className="p-3" style={{ 
                        minHeight: '400px', 
                        maxHeight: '70vh', 
                        overflow: 'auto',
                        backgroundColor: '#f8f9fa'
                    }}>
                        {justificative.file_type?.includes("pdf") && (
                            <embed 
                                src={justificative.url} 
                                type="application/pdf" 
                                width="100%" 
                                height="600"
                                style={{ border: 'none' }}
                            />
                        )}

                        {justificative.file_type?.includes("image") && (
                            <div className="text-center">
                                <img 
                                    src={justificative.url} 
                                    alt={justificative.name}
                                    style={{ 
                                        maxWidth: '100%', 
                                        maxHeight: '60vh',
                                        objectFit: 'contain'
                                    }}
                                    className="img-fluid rounded"
                                />
                            </div>
                        )}

                        {!justificative.file_type?.includes("pdf") && 
                         !justificative.file_type?.includes("image") && (
                            <div className="text-center py-5">
                                <i className={`${getFileIcon(justificative.file_type)} fs-1 text-muted mb-3 d-block`}></i>
                                <h5 className="text-muted">Aperçu non disponible</h5>
                                <p className="text-muted">
                                    Ce type de fichier ne peut pas être prévisualisé dans le navigateur.
                                </p>
                                <Button
                                    variant="primary"
                                    href={justificative.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="bi bi-download me-2"></i>
                                    Télécharger le fichier
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer className="border-top-0">
                <div className="d-flex justify-content-between w-100">
                    <div>
                        {canDelete && (
                            <Button
                                variant="outline-danger"
                                onClick={handleDelete}
                                disabled={RequestState.deleting}
                            >
                                {RequestState.deleting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Suppression...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash me-2"></i>
                                        Supprimer
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    <div className="d-flex gap-2">
                        <Button variant="secondary" onClick={onClose}>
                            <i className="bi bi-x-lg me-2"></i>
                            Fermer
                        </Button>

                        {canEdit && onEdit && (
                            <Button variant="primary" onClick={onEdit}>
                                <i className="bi bi-pencil me-2"></i>
                                Modifier
                            </Button>
                        )}
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
}