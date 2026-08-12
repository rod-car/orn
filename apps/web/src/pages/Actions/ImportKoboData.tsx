import { useApi } from 'hooks';
import { useEffect, useState } from 'react';
import { Block, PageTitle } from 'ui';
import { toast } from 'react-toastify';
import { config } from '@base/config';
import { Pagination } from '@base/components';

type Schedule = {
    id: number;
    task: string;
    ran_at: string;
    status: 'success' | 'failed';
    message: string | null;
    created_at: string;
};

type PaginatedResponse = {
    data: Schedule[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

const STEPS = [
    { key: 'consommation',    label: 'Consommations' },
    { key: 'stock_in',        label: 'Entrées de stock' },
    { key: 'stock_out',       label: 'Sorties de stock' },
    { key: 'activity',        label: 'Activités' },
    { key: 'student',         label: 'Ajout d\'étudiants' },
    { key: 'anthropo_measure', label: 'Anthropométrie' },
];

type StepStatus = 'idle' | 'running' | 'done' | 'error';

export function ImportKoboData() {
    const [importing, setImporting]       = useState(false);
    const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(
        Object.fromEntries(STEPS.map(s => [s.key, 'idle']))
    );
    const [errorMsg, setErrorMsg]         = useState<string | null>(null);

    const [paginatedData, setPaginatedData] = useState<PaginatedResponse | null>(null);
    const [historyLoading, setHistoryLoading] = useState(true);

    const { Client } = useApi<Schedule>({ url: '/actions/kobo' });
    const { Client: KoboExportClient, RequestState: KoboExportState } = useApi({ url: '/students' });

    const loadHistory = async (page = 1) => {
        setHistoryLoading(true);
        const result = await Client.get({ page }, '/history');
        setPaginatedData(result as unknown as PaginatedResponse);
        setHistoryLoading(false);
    };

    useEffect(() => { loadHistory(1); }, []);

    const history      = paginatedData?.data ?? [];
    const lastImport   = history[0] ?? null;

    const setStep = (key: string, status: StepStatus) =>
        setStepStatuses(prev => ({ ...prev, [key]: status }));

    const handleImport = async () => {
        setImporting(true);
        setErrorMsg(null);
        setStepStatuses(Object.fromEntries(STEPS.map(s => [s.key, 'idle'])));

        for (const key of STEPS.map(s => s.key)) {
            setStep(key, 'running');
            await new Promise(r => setTimeout(r, 300));
        }

        try {
            const response = await Client.post({}, '/import');

            if (response.ok) {
                for (const key of STEPS.map(s => s.key)) setStep(key, 'done');
                toast('Importation réussie', { type: 'success', position: config.toastPosition });
                await loadHistory(1);
            } else {
                const msg = (response.data as { message?: string })?.message ?? 'Erreur inconnue';
                setErrorMsg(msg);
                for (const key of STEPS.map(s => s.key)) setStep(key, 'error');
                toast("Échec de l'importation", { type: 'error', position: config.toastPosition });
            }
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Erreur réseau';
            setErrorMsg(msg);
            for (const key of STEPS.map(s => s.key)) setStep(key, 'error');
            toast('Erreur réseau', { type: 'error', position: config.toastPosition });
        } finally {
            setImporting(false);
        }
    };

    const handleExportKobo = async () => {
        const response = await KoboExportClient.post({}, '/export-kobo');
        if (response.ok && (response.data as { url?: string })?.url) {
            window.open((response.data as { url: string }).url, '_blank');
            toast('Fichier généré avec succès', { type: 'success', position: config.toastPosition });
        } else {
            toast("Échec de la génération du fichier", { type: 'error', position: config.toastPosition });
        }
    };

    const stepIcon = (status: StepStatus) => {
        if (status === 'running') return <span className="spinner-border spinner-border-sm text-primary" />;
        if (status === 'done')    return <i className="bi bi-check-circle-fill text-success fs-5" />;
        if (status === 'error')   return <i className="bi bi-x-circle-fill text-danger fs-5" />;
        return <i className="bi bi-circle text-secondary fs-5" />;
    };

    const stepLabel = (status: StepStatus) => {
        if (status === 'running') return 'En cours...';
        if (status === 'done')    return 'Terminé';
        if (status === 'error')   return 'Échoué';
        return 'En attente';
    };

    const handlePageChange = ({ page }: { page: number }) => {
        loadHistory(page);
    };

    return <>
        <PageTitle title="Importation KoboCollect" />

        {/* Export spécial - fichier students.csv pour Kobo */}
        <div className="card h-100 border-0 shadow-sm border-start border-4 border-primary mb-3">
            <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-flex align-items-start gap-3">
                    <div className="bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 48, height: 48 }}>
                        <i className="bi bi-file-earmark-spreadsheet text-primary fs-4" />
                    </div>
                    <div>
                        <h6 className="mb-1 fw-semibold">Export spécial</h6>
                        <p className="text-muted small mb-0">
                            Génère le fichier CSV à jour pour alimenter la liste déroulante "Code Étudiant" du formulaire Kobo "Anthropometrie avec listes".
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleExportKobo}
                    disabled={KoboExportState.creating}
                    className="btn btn-primary flex-shrink-0"
                >
                    {KoboExportState.creating
                        ? <span className="spinner-border spinner-border-sm me-2" />
                        : <i className="bi bi-cloud-download me-2" />}
                    Exporter toute la liste des étudiants pour Kobo
                </button>
            </div>
        </div>

        <div className="row g-3 mb-3">
            {/* Carte statut dernier import */}
            <div className="col-12 col-md-5">
                <div className={`card h-100 border-0 shadow-sm border-start border-4 border-${lastImport?.status === 'failed' ? 'danger' : 'success'}`}>
                    <div className="card-body d-flex flex-column justify-content-between">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="text-muted small text-uppercase fw-semibold">
                                Dernier import
                            </span>
                            {lastImport && (
                                <span className={`badge rounded-pill bg-${lastImport.status === 'success' ? 'success' : 'danger'}-subtle text-${lastImport.status === 'success' ? 'success' : 'danger'} border border-${lastImport.status === 'success' ? 'success' : 'danger'}`}>
                                    <i className={`bi bi-${lastImport.status === 'success' ? 'check-circle' : 'x-circle'} me-1`} />
                                    {lastImport.status === 'success' ? 'Succès' : 'Échec'}
                                </span>
                            )}
                        </div>
                        {lastImport ? (
                            <div>
                                <div className="fw-semibold fs-6">
                                    <i className="bi bi-calendar3 me-2 text-muted" />
                                    {new Date(lastImport.ran_at).toLocaleString('fr-FR')}
                                </div>
                                {lastImport.message && (
                                    <p className="text-muted small mt-2 mb-0 font-monospace">
                                        {lastImport.message}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-muted mb-0 small">Aucun import enregistré.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Carte lancement import */}
            <div className="col-12 col-md-7">
                <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h6 className="mb-0 fw-semibold">Lancer une importation</h6>
                                <p className="text-muted small mb-0">
                                    Synchronise les données depuis KoboToolbox vers la base locale.
                                </p>
                            </div>
                            <button
                                className="btn btn-primary px-4"
                                onClick={handleImport}
                                disabled={importing}
                            >
                                {importing
                                    ? <><span className="spinner-border spinner-border-sm me-2" />En cours...</>
                                    : <><i className="bi bi-cloud-download me-2" />Importer</>
                                }
                            </button>
                        </div>

                        {/* Étapes */}
                        <div className="row g-2">
                            {STEPS.map(step => (
                                <div key={step.key} className="col-6">
                                    <div className={`d-flex align-items-center gap-2 rounded p-2
                                        ${stepStatuses[step.key] === 'done'    ? 'bg-success-subtle' : ''}
                                        ${stepStatuses[step.key] === 'error'   ? 'bg-danger-subtle'  : ''}
                                        ${stepStatuses[step.key] === 'running' ? 'bg-primary-subtle' : ''}
                                        ${stepStatuses[step.key] === 'idle'    ? 'bg-light'          : ''}
                                    `}>
                                        {stepIcon(stepStatuses[step.key])}
                                        <div>
                                            <div className="small fw-semibold lh-1">{step.label}</div>
                                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                {stepLabel(stepStatuses[step.key])}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {errorMsg && (
                            <div className="alert alert-danger d-flex align-items-center gap-2 mt-3 mb-0 py-2 small">
                                <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
                                <span className="font-monospace">{errorMsg}</span>
                            </div>
                        )}

                        {importing && (
                            <p className="text-muted small fst-italic mt-2 mb-0">
                                <i className="bi bi-info-circle me-1" />
                                Cette opération peut prendre plusieurs minutes, veuillez patienter.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Historique paginé */}
        <Block>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-semibold">
                    <i className="bi bi-clock-history me-2 text-muted" />
                    Historique des importations
                </h6>
                {paginatedData && (
                    <span className="text-muted small">
                        {paginatedData.total} entrée{paginatedData.total > 1 ? 's' : ''} au total
                    </span>
                )}
            </div>

            <table className="table table-striped table-bordered table-hover text-sm align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th style={{ width: '3rem' }} className="text-center">#</th>
                        <th>Date d'exécution</th>
                        <th className="text-center" style={{ width: '8rem' }}>Statut</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {historyLoading ? (
                        <tr>
                            <td colSpan={4} className="text-center py-5">
                                <span className="spinner-border spinner-border-sm text-primary me-2" />
                                <span className="text-muted">Chargement...</span>
                            </td>
                        </tr>
                    ) : history.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-5">
                                <i className="bi bi-inbox fs-3 text-muted d-block mb-2" />
                                <span className="text-muted small">Aucun import enregistré.</span>
                            </td>
                        </tr>
                    ) : history.map(item => (
                        <tr key={item.id}>
                            <td className="text-center text-muted small">{item.id}</td>
                            <td>
                                <i className="bi bi-calendar3 me-2 text-muted" />
                                {new Date(item.ran_at).toLocaleString('fr-FR')}
                            </td>
                            <td className="text-center">
                                <span className={`badge rounded-pill bg-${item.status === 'success' ? 'success' : 'danger'}-subtle text-${item.status === 'success' ? 'success' : 'danger'} border border-${item.status === 'success' ? 'success' : 'danger'}`}>
                                    <i className={`bi bi-${item.status === 'success' ? 'check-circle' : 'x-circle'} me-1`} />
                                    {item.status === 'success' ? 'Succès' : 'Échec'}
                                </span>
                            </td>
                            <td className="text-muted small font-monospace">
                                {item.message ?? <span className="text-muted">—</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {paginatedData && paginatedData.last_page > 1 && (
                <Pagination
                    data={paginatedData}
                    changePage={handlePageChange}
                />
            )}
        </Block>
    </>;
}
