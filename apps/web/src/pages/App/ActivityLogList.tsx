/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { ReactNode, useEffect, useState } from "react";
import { Block, PageTitle, Select, Input } from "ui";
import { Pagination } from '@base/components'
import { useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

type ActivityLog = {
    id: number;
    action: string;
    subject_type: string | null;
    subject_id: number | null;
    subject_label: string | null;
    description: string;
    properties: { changed_fields?: string[] } | null;
    ip_address: string | null;
    created_at: string;
    user: { id: number; name: string; username: string } | null;
}

type PaginatedLogs = {
    data: ActivityLog[];
    total: number;
    per_page: number;
    current_page: number;
}

const actionLabels: Record<string, { label: string; color: string }> = {
    created: { label: "Création", color: "success" },
    updated: { label: "Modification", color: "primary" },
    deleted: { label: "Suppression", color: "danger" },
    login: { label: "Connexion", color: "info" },
    login_failed: { label: "Connexion refusée", color: "warning" },
    logout: { label: "Déconnexion", color: "secondary" },
    validated: { label: "Validation", color: "success" },
    invalidated: { label: "Refus", color: "danger" },
}

export function ActivityLogList(): ReactNode {
    const [searchParams, setSearchParams] = useSearchParams()

    const { Client, datas: logs, RequestState } = useApi<PaginatedLogs>({
        url: '/activity-logs',
        key: 'items'
    })

    const { Client: ActionsClient, datas: availableActions } = useApi<string[]>({
        url: '/activity-logs/actions',
        key: 'items'
    })

    const [queryParams, setQueryParams] = useState({
        per_page: 30, action: '', from: '', to: '', search: ''
    })

    const getLogs = async (params: Record<string, string | number> | undefined = undefined) => {
        await Client.get(params === undefined ? queryParams : params)
    }

    const changePage = (data: { page: number }): void => {
        Client.get({ ...queryParams, page: data.page })
    }

    const updateQueryParam = (value: string, key: string) => {
        const temp = { ...queryParams, [key]: value }
        setSearchParams({ ...temp })
        setQueryParams(temp)
        getLogs(temp)
    }

    useEffect(() => {
        ActionsClient.get()
        getLogs()
    }, [])

    return <>
        <PageTitle title="Journal d'activité" />

        <Block className="mb-4">
            <div className="row gy-3">
                <div className="col-12 col-md-3">
                    <Select
                        label="Type d'action"
                        defaultOption="Toutes les actions"
                        options={(availableActions ?? []).map((a) => ({ id: a, label: actionLabels[a]?.label ?? a }))}
                        onChange={(e) => updateQueryParam(e.target.value, 'action')}
                    />
                </div>
                <div className="col-12 col-md-3">
                    <Input
                        type="date"
                        label="Du"
                        onChange={(e) => updateQueryParam(e.target.value, 'from')}
                    />
                </div>
                <div className="col-12 col-md-3">
                    <Input
                        type="date"
                        label="Au"
                        onChange={(e) => updateQueryParam(e.target.value, 'to')}
                    />
                </div>
                <div className="col-12 col-md-3">
                    <Input
                        type="text"
                        label="Recherche"
                        placeholder="Rechercher dans la description..."
                        onChange={(e) => updateQueryParam(e.target.value, 'search')}
                    />
                </div>
            </div>
        </Block>

        <Block>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Utilisateur</th>
                            <th>Action</th>
                            <th>Concerne</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RequestState.loading && (
                            <tr>
                                <td colSpan={5}><Skeleton height={30} count={5} /></td>
                            </tr>
                        )}
                        {logs && logs.data?.length > 0 && logs.data.map((log) => (
                            <tr key={log.id}>
                                <td className="text-nowrap">{log.created_at}</td>
                                <td>{log.user ? `${log.user.name} (${log.user.username})` : 'Système/invité'}</td>
                                <td>
                                    <span className={`badge bg-${actionLabels[log.action]?.color ?? 'dark'}`}>
                                        {actionLabels[log.action]?.label ?? log.action}
                                    </span>
                                </td>
                                <td>{log.subject_type ? `${log.subject_label ?? ''} (${log.subject_type} #${log.subject_id})` : '—'}</td>
                                <td>{log.description}</td>
                            </tr>
                        ))}
                        {logs && logs.data?.length === 0 && !RequestState.loading && (
                            <tr>
                                <td colSpan={5} className="text-center text-muted py-4">
                                    Aucune activité trouvée pour ces filtres.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {logs && logs.total > logs.per_page && <Pagination changePage={changePage} data={logs} />}
        </Block>
    </>
}
