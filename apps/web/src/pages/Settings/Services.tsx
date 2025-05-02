import { DetailLink, EditLink, RichTextEditor } from "@base/components";
import { config } from "@base/config";
import { useApi, useAuthStore } from "hooks";
import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { Block, DangerButton, PageTitle, PrimaryButton } from "ui";

export function Services(): ReactNode {
    const [details, setDetails] = useState("")

    const { Client, datas, RequestState } = useApi<{id: number, title: string, details: string, description: string}>({
        url: '/services',
        key: 'data'
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        toast(`Enregistrement des donnees`, { position: config.toastPosition, type: 'info' })

        const response = await Client.post({ jardin_details: details }, "/jardin")

        if (response.ok) {
            const message = 'Enregistré'
            toast(message, {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    const handleDelete = useCallback(async (id: number) => {
        confirmAlert({
            title: 'Question',
            message: 'Voulez-vous supprimer ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        const response = await Client.destroy(id)
                        if (response.ok) {
                            toast('Supprime', {
                                closeButton: true,
                                type: 'success',
                                position: config.toastPosition
                            })
                            Client.get()
                        } else {
                            toast('Erreur de soumission', {
                                closeButton: true,
                                type: 'error',
                                position: config.toastPosition
                            })
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () =>
                        toast('Annulé', {
                            closeButton: true,
                            type: 'warning',
                            position: config.toastPosition
                        })
                }
            ]
        })
    }, [])

    const handleEdit = useCallback(async (id: number) => {

    }, [])

    useEffect(() => {
        Client.get()
    }, [])

    const { isAdmin } = useAuthStore()

    return <>
        <PageTitle title="Gestion des services" />

        <Block>
            <table className="table table-striped m-0 table-bordered text-sm">
                <thead>
                    <th className="p-2">#</th>
                    <th className="p-2">Titre</th>
                    <th className="p-2">Details</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Actions</th>
                </thead>
                <tbody>
                    {RequestState.loading && <tr><td colSpan={5} className="text-center">Chargement en cours</td></tr>}
                    {!RequestState.loading && datas.length === 0 && <tr><td colSpan={5} className="text-center">Aucune donnees</td></tr>}
                    {datas && datas.map((service, index) => <tr key={index}>
                        <td>{service.id}</td>
                        <td>{service.title}</td>
                        <td>{service.details}</td>
                        <td>{service.description}</td>
                        <td className="text-nowrap">
                            <DetailLink className="me-2" to={"#"} />
                            <PrimaryButton onClick={() => handleEdit(service.id)} size="sm" icon="pencil-square" can={isAdmin} className="me-2" />
                            <DangerButton can={isAdmin} icon="trash" size="sm"
                                onClick={() => {
                                    handleDelete(service.id)
                                }}
                            />
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </Block>
    </>
}