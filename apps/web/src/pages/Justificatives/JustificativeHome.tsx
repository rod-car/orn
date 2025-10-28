/* eslint-disable react-hooks/exhaustive-deps */
import { BasicCard, CreateFolderModal, EditFileModal, MoveModal, RenameFolderModal, ShowFileModal, UploadFileModal } from "@base/components";
import { Col, Row } from "@base/components/Bootstrap";
import { ChangeEvent, memo, ReactNode, useEffect, useState } from "react";
import { Button, Input, PageTitle, PrimaryButton } from "ui";
import { useApi } from "hooks";
import { Pagination } from "@base/components";
import { range } from "functions";
import Skeleton from "react-loading-skeleton";
import { toast } from "@base/ui";
import icons from "@base/assets/icons";

interface Folder {
    id: number;
    name: string;
    parent_id: number | null;
    children_count: number;
    files_count: number;
    total_files_count: number;
    created_by: { id: number; name: string; email: string };
}

interface Breadcrumb {
    id: number;
    name: string;
}

export function JustificativeHome(): ReactNode {
    const { Client, datas, RequestState } = useApi<Justificative>({
        url: "/justificatives",
    });

    const { Client: FolderClient } = useApi<Justificative>({
        url: "/justificative-folders",
    });

    const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [files, setFiles] = useState<Justificative[]>([]);
    const [breadcrumb, setBreadcrumb] = useState<Breadcrumb[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [isSearch, setIsSearch] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showFileShowModal, setShowFileShowModal] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    const [selectedItem, setSelectedItem] = useState<{ type: 'file' | 'folder'; id: number } | null>(null);
    const [selectedFile, setSelectedFile] = useState<Justificative | null>(null);
    const [fileToShow, setFileToShow] = useState<Justificative | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(12);

    const getRequestParams = (page: number = currentPage) => ({
        paginate: true,
        perPage: perPage,
        page: page,
        q: query,
        folder_id: currentFolderId ?? ""
    });

    const [query, setQuery] = useState("");
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

    const filter = async (page: number = 1) => {
        await Client.get(getRequestParams(page));
    };

    useEffect(() => {
        // Réinitialiser à la page 1 quand on change de dossier
        setCurrentPage(1);
        filter(1);
    }, [currentFolderId]);

    useEffect(() => {
        if (datas) {
            setFolders(datas.folders || []);
            setFiles(datas.files?.data || datas.files || []);
            setMeta(datas.meta || null);
            setBreadcrumb(datas.breadcrumb || []);
            setIsSearch(datas.is_search || false);
        }
    }, [datas]);

    // Gestion du changement de page avec votre composant Pagination
    const changePage = (data: { page: number }) => {
        setCurrentPage(data.page);
        filter(data.page);
    };

    const handleSearch = async (event: ChangeEvent) => {
        const { value } = event.target as HTMLInputElement;
        setQuery(value);

        if (timeoutId) clearTimeout(timeoutId);

        const newTimeoutId = setTimeout(() => {
            setCurrentPage(1); // Reset à la page 1 pour les recherches
            filter(1);
        }, 500);

        setTimeoutId(newTimeoutId);
    };

    const navigateToFolder = (folderId: number | null) => {
        setCurrentFolderId(folderId);
        setQuery("");
    };

    const handleCreateFolder = () => {
        setShowCreateModal(false);
        filter(currentPage);
    };

    const handleRenameFolder = () => {
        setShowRenameModal(false);
        setSelectedFolder(null);
        filter(currentPage);
    };

    const handleMove = () => {
        setShowMoveModal(false);
        setSelectedItem(null);
        filter(currentPage);
    };

    const openRenameModal = (folder: Folder) => {
        setSelectedFolder(folder);
        setShowRenameModal(true);
    };

    const openMoveModal = (type: 'file' | 'folder', id: number) => {
        setSelectedItem({ type, id });
        setShowMoveModal(true);
    };

    const openEditModal = (justificative: Justificative) => {
        setSelectedFile(justificative);
        setShowEditModal(true);
    };

    const openShowFileModal = (justificative: Justificative) => {
        setFileToShow(justificative);
        setShowFileShowModal(true);
    };

    const handleDeleteFolder = async (folderId: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce dossier et tout son contenu ?")) {
            try {
                await FolderClient.destroy(folderId);
                filter(currentPage);
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
            }
        }
    };

    const handleDownloadFolder = async (folderId: number) => {
        try {
            const response = await FolderClient.post({}, `/${folderId}/download`, undefined, { responseType: 'blob' });

            const { file_url, file_name } = response.data;

            if (file_url) {
                const a = document.createElement('a');
                a.href = file_url;
                a.download = file_name;
                a.target = "_blank"
                a.click();

                toast('Dossier prêt au téléchargement!', { type: 'success' });
            } else {
                toast('Aucun fichier disponible.', { type: 'error' });
            }

            toast('Dossier téléchargé avec succès!', { type: 'success' });
        } catch (error: any) {
            console.error('Erreur de téléchargement du dossier:', error);
            toast('Échec du téléchargement du dossier', { type: 'error' });
        }
    };

    const handleUploadFile = () => {
        setShowUploadModal(false);
        filter(currentPage);
    };

    const handleEditFile = () => {
        setShowEditModal(false);
        filter(currentPage);
    };

    // Fonction pour effacer la recherche
    const clearSearch = () => {
        setQuery("");
        setCurrentPage(1);
        filter(1);
    };

    // Fonction pour transformer les meta en structure compatible avec react-laravel-paginex
    const transformMetaToPaginationData = (meta: any) => {
        if (!meta) return null;

        const { current_page, last_page, per_page, total } = meta;

        // Créer les liens de pagination
        const links = [];

        // Lien précédent
        links.push({
            url: current_page > 1 ? `?page=${current_page - 1}` : null,
            label: "&laquo; Previous",
            active: false,
            page: current_page > 1 ? current_page - 1 : null
        });

        // Liens des pages
        for (let i = 1; i <= last_page; i++) {
            links.push({
                url: `?page=${i}`,
                label: i.toString(),
                active: i === current_page,
                page: i
            });
        }

        // Lien suivant
        links.push({
            url: current_page < last_page ? `?page=${current_page + 1}` : null,
            label: "Next &raquo;",
            active: false,
            page: current_page < last_page ? current_page + 1 : null
        });

        return {
            current_page,
            data: [], // Peut être vide, le composant n'utilise peut-être pas cette propriété
            first_page_url: `?page=1`,
            from: ((current_page - 1) * per_page) + 1,
            last_page,
            last_page_url: `?page=${last_page}`,
            links,
            next_page_url: current_page < last_page ? `?page=${current_page + 1}` : null,
            path: window.location.pathname,
            per_page,
            prev_page_url: current_page > 1 ? `?page=${current_page - 1}` : null,
            to: Math.min(current_page * per_page, total),
            total
        };
    };

    return (
        <>
            <PageTitle title="Liste des pieces justificatifs">
                <div className="d-flex">
                    <PrimaryButton
                        permission="justificative.create"
                        onClick={() => setShowCreateModal(true)}
                        icon="folder-plus"
                        className="me-2"
                    >
                        Nouveau dossier
                    </PrimaryButton>
                    <PrimaryButton
                        disabled={breadcrumb.length === 0}
                        permission="justificative.create"
                        icon="plus-lg"
                        onClick={() => breadcrumb.length === 0 ? alert("Veuillez sélectionner un dossier") : setShowUploadModal(true)}
                    >
                        Ajouter un fichier {breadcrumb.length === 0 && "(Doit être dans un dossier)"}
                    </PrimaryButton>
                </div>
            </PageTitle>

            {/* Breadcrumb Navigation */}
            {!isSearch && (
                <div className="mb-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-light p-3 rounded">
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
                </div>
            )}

            <div className="mb-4 mt-3 d-flex">
                <Input
                    value={query}
                    name="query"
                    onChange={handleSearch}
                    placeholder="Rechercher un fichier ou dossier..."
                    className="w-100 me-1"
                />
                <PrimaryButton
                    permission="justificative.view"
                    icon="search"
                    loading={RequestState.loading}
                    size="sm"
                />
            </div>

            {isSearch && query && (
                <div className="alert alert-info mb-3">
                    <i className="bi bi-search me-2"></i>
                    Résultats de recherche pour: <strong>{query}</strong>
                    <button
                        className="btn btn-sm btn-link float-end"
                        onClick={clearSearch}
                    >
                        Effacer
                    </button>
                </div>
            )}

            {RequestState.loading && <ItemsLoading />}

            {!RequestState.loading && (folders.length > 0 || files.length > 0) && (
                <>
                    <Row className="mb-4">
                        {/* Afficher les dossiers d'abord */}
                        {folders.map((folder: Folder) => (
                            <Col key={`folder-${folder.id}`} className="mb-3" n={3}>
                                <FolderCard
                                    folder={folder}
                                    onNavigate={navigateToFolder}
                                    onRename={openRenameModal}
                                    onDelete={handleDeleteFolder}
                                    onDownload={handleDownloadFolder}
                                    onMove={openMoveModal}
                                />
                            </Col>
                        ))}

                        {/* Puis afficher les fichiers */}
                        {files.map((justificative: Justificative) => (
                            <Col key={`file-${justificative.id}`} className="mb-3" n={3}>
                                <JustificativeCard
                                    justificative={justificative}
                                    onMove={openMoveModal}
                                    onEdit={openEditModal}
                                    onShow={openShowFileModal}
                                />
                            </Col>
                        ))}
                    </Row>

                    {/* Pagination - Afficher seulement si on a plusieurs pages */}
                    {meta && meta.last_page > 1 && (
                        <Pagination
                            data={transformMetaToPaginationData(meta)}
                            changePage={changePage}
                            options={{
                                // Vous pouvez ajouter des options supplémentaires si nécessaire
                            }}
                        />
                    )}
                </>
            )}

            {!RequestState.loading && folders.length === 0 && files.length === 0 && (
                <div className="text-center py-5">
                    <i className="bi bi-inbox display-1 text-muted"></i>
                    <p className="text-muted mt-3">
                        {query ? "Aucun résultat trouvé" : "Ce dossier est vide"}
                    </p>
                </div>
            )}

            {/* Modals */}
            <CreateFolderModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateFolder}
                currentFolderId={currentFolderId}
            />

            {selectedFolder && (
                <RenameFolderModal
                    show={showRenameModal}
                    onClose={() => { setShowRenameModal(false); setSelectedFolder(null); }}
                    onSuccess={handleRenameFolder}
                    folder={selectedFolder}
                />
            )}

            {selectedItem && (
                <MoveModal
                    show={showMoveModal}
                    onClose={() => { setShowMoveModal(false); setSelectedItem(null); }}
                    onSuccess={handleMove}
                    item={selectedItem}
                    currentFolderId={currentFolderId}
                />
            )}

            <UploadFileModal
                show={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onSuccess={handleUploadFile}
                currentFolderId={currentFolderId}
            />

            {selectedFile && <EditFileModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSuccess={handleEditFile}
                justificative={selectedFile}
            />}

            {fileToShow && <ShowFileModal
                show={showFileShowModal}
                onClose={() => setShowFileShowModal(false)}
                justificative={fileToShow}
            />}
        </>
    );
}


const ItemsLoading = memo(function (): ReactNode {
    return (
        <Row className="mb-3">
            {range(12).map((index) => (
                <Col key={index} className="mb-3" n={3}>
                    <ItemCardLoading />
                </Col>
            ))}
        </Row>
    );
});

const ItemCardLoading = memo(function (): ReactNode {
    return (
        <BasicCard title={<Skeleton height={30} style={{ width: 125 }} />} actionLabel={<Skeleton height={40} style={{ width: 100 }} />}>
            <div className="text-center">
                <Skeleton height={130} style={{ width: 180 }} />
            </div>
            <p className="fst-italic text-primary text-center">
                <Skeleton height={30} />
            </p>
        </BasicCard>
    );
});

interface FolderCardProps {
    folder: Folder;
    onNavigate: (folderId: number) => void;
    onRename: (folder: Folder) => void;
    onDelete: (folderId: number) => void;
    onDownload: (folderId: number) => void;
    onMove: (type: 'folder', id: number) => void;
}

function FolderCard({ folder, onNavigate, onRename, onDelete, onDownload, onMove }: FolderCardProps): ReactNode {
    return (
        <BasicCard
            icon="folder-fill"
            title={folder.name}
            actionLabel={
                <PrimaryButton
                    permission="*"
                    onClick={() => onNavigate(folder.id)}
                    icon="arrow-right"
                >
                    <i className="bi bi-folder-open me-1"></i>
                    Ouvrir
                </PrimaryButton>
            }
        >
            <div className="text-center py-4" onClick={() => onNavigate(folder.id)}>
                <i className="bi bi-folder-fill display-1 text-warning"></i>
                <div className="mt-3">
                    <small className="text-muted d-block">
                        <i className="bi bi-folder me-1"></i>
                        {folder.children_count} dossier{folder.children_count !== 1 ? 's' : ''}
                    </small>
                    <small className="text-muted d-block">
                        <i className="bi bi-file-earmark me-1"></i>
                        {folder.total_files_count} fichier{folder.total_files_count !== 1 ? 's' : ''}
                    </small>
                </div>
            </div>
            <p className="text-center text-sm mb-2">
                Par: {folder.created_by?.name || "Inconnu"}
            </p>

            <div className="d-flex justify-content-center gap-2 flex-wrap">
                <Button
                    icon="pencil"
                    permission="*"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onRename(folder)}
                    title="Renommer"
                />
                <Button
                    icon="download"
                    permission="*"
                    className="btn btn-sm btn-outline-success"
                    onClick={() => onDownload(folder.id)}
                    title="Télécharger en ZIP"
                />
                <Button
                    icon="arrows-move"
                    permission="*"
                    className="btn btn-sm btn-outline-info"
                    onClick={() => onMove('folder', folder.id)}
                    title="Déplacer"
                />
                <Button
                    icon="trash"
                    permission="*"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(folder.id)}
                    title="Supprimer"
                />
            </div>
        </BasicCard>
    );
}

interface JustificativeCardProps {
    justificative: Justificative;
    onMove: (type: 'file', id: number) => void;
    onEdit: (justificative: Justificative) => void;
    onShow: (justificative: Justificative) => void;
}

function JustificativeCard({ justificative, onMove, onEdit, onShow }: JustificativeCardProps): ReactNode {
    let icon = icons.pdf;
    if (justificative?.file_type?.includes("image")) icon = icons.image;

    return (
        <BasicCard
            title={
                <div className="d-flex align-items-center">
                    <i className="bi bi-file-earmark-fill text-primary me-2"></i>
                    <span style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                        {justificative.name}
                    </span>
                </div>
            }
            actionLabel={
                <Button mode="primary" icon="eye" permission="*" onClick={() => onShow(justificative)}>
                    Voir plus
                </Button>
            }
        >
            <div className="text-center">
                <img className="w-75 text-left" src={icon} alt={justificative.name} />
            </div>
            <p className="text-center text-sm mb-1">
                Par: {justificative.uploaded_by?.name || "Inconnu"}
            </p>
            <p className="text-center text-sm text-muted mb-2">
                Taille: {justificative.file_size_human}
            </p>

            <div className="d-flex justify-content-center gap-2">
                <PrimaryButton
                    size="sm"
                    icon="pencil"
                    permission="*"
                    onClick={() => onEdit(justificative)}
                />
                <Button
                    icon="arrows-move"
                    className="btn btn-sm btn-outline-info"
                    onClick={() => onMove('file', justificative.id)}
                    title="Déplacer"
                    permission={"*"}
                />
            </div>
        </BasicCard>
    );
}