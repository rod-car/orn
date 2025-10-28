import { ReactNode, useState, useRef, ChangeEvent } from "react";
import { Modal, Button } from "react-bootstrap";
import { Input } from "ui";
import { useApi } from "hooks";

interface UploadFileModalProps {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
    currentFolderId: number | null;
}

export function UploadFileModal({ show, onClose, onSuccess, currentFolderId }: UploadFileModalProps): ReactNode {
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { Client, RequestState } = useApi({
        url: "/justificatives",
    });

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (!fileName) {
                // Enlever l'extension pour le nom par défaut
                const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
                setFileName(nameWithoutExt);
            }
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
            if (!fileName) {
                const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
                setFileName(nameWithoutExt);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("Veuillez sélectionner un fichier");
            return;
        }

        if (!fileName.trim()) {
            alert("Veuillez entrer un nom pour le fichier");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", fileName);
            formData.append("file", selectedFile);
            if (currentFolderId) {
                formData.append("folder_id", currentFolderId.toString());
            }

            await Client.post(formData);

            // Réinitialiser le formulaire
            setFileName("");
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            onSuccess();
        } catch (error) {
            console.error("Erreur lors de l'upload:", error);
            alert("Erreur lors de l'upload du fichier");
        }
    };

    const handleClose = () => {
        setFileName("");
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

    const getFileIcon = (file: File): string => {
        if (file.type.includes('image')) return 'bi-file-earmark-image';
        if (file.type.includes('pdf')) return 'bi-file-earmark-pdf';
        if (file.type.includes('word')) return 'bi-file-earmark-word';
        if (file.type.includes('excel') || file.type.includes('spreadsheet')) return 'bi-file-earmark-excel';
        if (file.type.includes('zip') || file.type.includes('compressed')) return 'bi-file-earmark-zip';
        return 'bi-file-earmark';
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-cloud-upload me-2"></i>
                    Ajouter un fichier
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    {/* Zone de drag & drop */}
                    <div
                        className={`border-2 border-dashed rounded p-4 mb-3 text-center ${
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
                                <i className={`${getFileIcon(selectedFile)} display-4 text-primary`}></i>
                                <h5 className="mt-2 mb-1">{selectedFile.name}</h5>
                                <p className="text-muted mb-0">
                                    {formatFileSize(selectedFile.size)}
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
                                    Changer de fichier
                                </button>
                            </div>
                        ) : (
                            <div>
                                <i className="bi bi-cloud-upload display-1 text-muted"></i>
                                <h5 className="mt-2 mb-1">Glissez-déposez un fichier ici</h5>
                                <p className="text-muted mb-2">ou cliquez pour sélectionner</p>
                                <small className="text-muted">
                                    Formats acceptés : PDF, Images, Documents Word/Excel
                                </small>
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
                        <p className="mt-2">
                            <small className="text-muted">
                                <i className="bi bi-info-circle me-1"></i>
                                Ce nom sera utilisé pour identifier le fichier dans l'application
                            </small>
                        </p>
                    </div>

                    {/* Info dossier actuel */}
                    {currentFolderId ? (
                        <div className="alert alert-info mb-0">
                            <i className="bi bi-folder me-2"></i>
                            Le fichier sera ajouté dans le dossier actuel
                        </div>
                    ) : (
                        <div className="alert alert-info mb-0">
                            <i className="bi bi-house-door me-2"></i>
                            Le fichier sera ajouté à la racine
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={RequestState.loading}>
                        Annuler
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={RequestState.creating || !selectedFile || !fileName.trim()}
                    >
                        {RequestState.creating ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Upload en cours...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-upload me-1"></i>
                                Uploader
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}