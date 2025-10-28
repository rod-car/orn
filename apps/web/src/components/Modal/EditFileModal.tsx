import { ReactNode, useState, useRef, ChangeEvent, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Input } from "ui";
import { useApi } from "hooks";

interface EditFileModalProps {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
    justificative: Justificative;
}

export function EditFileModal({ show, onClose, onSuccess, justificative }: EditFileModalProps): ReactNode {
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { Client, RequestState } = useApi({
        url: `/justificatives/${justificative.id}`,
    });

    useEffect(() => {
        if (justificative) {
            setFileName(justificative.name);
        }
    }, [justificative]);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fileName.trim()) {
            alert("Veuillez entrer un nom pour le fichier");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", fileName);
            if (selectedFile) {
                formData.append("file", selectedFile);
            }
            formData.append("folder_id", justificative.folder_id?.toString() || "");
            formData.append("_method", "PATCH")

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }

            const response = await Client.post(formData, undefined, undefined, config);

            if (response?.ok) {
                // Réinitialiser
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }

                onSuccess();
            } else {
                throw new Error(response.data as string);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            alert("Erreur lors de la mise à jour du fichier");
        }
    };

    const handleClose = () => {
        setFileName(justificative.name);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onClose();
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
        return (bytes / 1073741824).toFixed(2) + ' GB';
    };

    const getFileIcon = (type?: string): string => {
        if (!type) return '';
        if (type.includes('image')) return 'bi-file-earmark-image';
        if (type.includes('pdf')) return 'bi-file-earmark-pdf';
        if (type.includes('word')) return 'bi-file-earmark-word';
        if (type.includes('excel') || type.includes('spreadsheet')) return 'bi-file-earmark-excel';
        if (type.includes('zip') || type.includes('compressed')) return 'bi-file-earmark-zip';
        return 'bi-file-earmark';
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-pencil-square me-2"></i>
                    Éditer le fichier
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    {/* Fichier actuel */}
                    <div className="alert alert-light border mb-3">
                        <div className="d-flex align-items-center">
                            <i className={`${getFileIcon(justificative.file_type)} fs-2 text-primary me-3`}></i>
                            <div className="flex-grow-1">
                                <h6 className="mb-1">Fichier actuel</h6>
                                <small className="text-muted d-block">
                                    Type: {justificative.file_type}
                                </small>
                                <small className="text-muted d-block">
                                    Taille: {justificative.file_size_human}
                                </small>
                                <small className="text-muted d-block">
                                    Uploadé par: {justificative.uploaded_by?.name}
                                </small>
                            </div>
                            <a
                                href={justificative.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary"
                            >
                                <i className="bi bi-download me-1"></i>
                                Télécharger
                            </a>
                        </div>
                    </div>

                    {/* Nom du fichier */}
                    <div className="mb-3">
                        <label className="form-label">
                            Nom du fichier <span className="text-danger">*</span>
                        </label>
                        <Input
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            placeholder="Ex: Facture Janvier 2024"
                            required
                        />
                    </div>

                    {/* Zone de remplacement du fichier (optionnel) */}
                    <div className="mb-3">
                        <label className="form-label">
                            Remplacer le fichier <span className="text-muted">(optionnel)</span>
                        </label>
                        <div
                            className={`border-2 border-dashed rounded p-3 text-center ${
                                isDragging ? 'border-primary bg-light' : 'border-secondary'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {selectedFile ? (
                                <div>
                                    <i className={`${getFileIcon(selectedFile.type)} fs-1 text-success`}></i>
                                    <h6 className="mt-2 mb-1">Nouveau fichier sélectionné</h6>
                                    <p className="text-muted mb-0">
                                        {selectedFile.name} ({formatFileSize(selectedFile.size)})
                                    </p>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary mt-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                    >
                                        <i className="bi bi-x-circle me-1"></i>
                                        Annuler le remplacement
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <i className="bi bi-arrow-repeat fs-1 text-muted"></i>
                                    <p className="mb-1 mt-2">Glissez-déposez un nouveau fichier ici</p>
                                    <small className="text-muted">ou cliquez pour sélectionner</small>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.zip"
                            />
                        </div>
                        <small className="text-muted">
                            <i className="bi bi-info-circle me-1"></i>
                            Si vous ne sélectionnez pas de nouveau fichier, seul le nom sera modifié
                        </small>
                    </div>

                    {/* Avertissement si fichier sélectionné */}
                    {selectedFile && (
                        <div className="alert alert-warning mb-0">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            <strong>Attention :</strong> Le fichier actuel sera remplacé par le nouveau fichier.
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={RequestState.creating}>
                        Annuler
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={RequestState.creating || !fileName.trim()}
                    >
                        {RequestState.creating ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Mise à jour...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg me-1"></i>
                                Mettre à jour
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}