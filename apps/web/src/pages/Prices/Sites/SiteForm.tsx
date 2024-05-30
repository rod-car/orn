import { FormEvent, ReactNode, useEffect, useState } from 'react'
import { Button, Input, Select } from 'ui'
import { useApi } from 'hooks'
import { config, getToken } from '@renderer/config'
import { toast } from 'react-toastify'

type SiteFormProps = {
    editedSite?: Site
}

const defaultSite: Site = {
    id: 0,
    name: '',
    commune_id: 0
}

export function SiteForm({ editedSite }: SiteFormProps): ReactNode {
    const [site, setSite] = useState(defaultSite)
    const {
        Client,
        error,
        RequestState
    } = useApi<Site>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/prices/sites',
        key: 'data'
    })

    const {
        Client: CommuneClient,
        datas: communes
    } = useApi<Commune>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/communes'
    })

    useEffect(() => {
        CommuneClient.get()
    }, [])

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        const response = editedSite
            ? await Client.patch(editedSite.id, site)
            : await Client.post(site)

        if (response.ok) {
            const message = editedSite ? 'Mis à jour' : 'Enregistré'
            toast(message, {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
            editedSite === undefined && setSite(defaultSite)
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    if (editedSite !== undefined && site.id === 0)
        setSite({
            ...editedSite,
        })

    const handleChange = (target: EventTarget & (HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement)): void => {
        setSite({ ...site, [target.name]: target.value })
        if (target.value.length > 0 && error?.data.errors[target.name]) {
            error.data.errors[target.name] = null
        }
    }

    return (
        <form action="#" onSubmit={handleSubmit} method="post">
            <div className="row mb-4">
                <div className="col-xl-12 mb-3">
                    <Input
                        label="Nom du site"
                        value={site.name}
                        error={error?.data?.errors?.name}
                        onChange={({ target }): void => handleChange(target)}
                        name="name"
                        placeholder="Miakara"
                    />
                </div>
                <div className="col-xl-12">
                    <Select
                        label="Commune"
                        options={communes}
                        config={{ optionKey: 'id', valueKey: 'name' }}
                        value={site.commune_id}
                        error={error?.data?.errors?.commune_id}
                        onChange={({ target }): void => handleChange(target)}
                        name="commune_id"
                        controlled
                    />
                </div>
            </div>

            <Button
                loading={RequestState.creating || RequestState.updating}
                icon="save"
                type="submit"
                mode="primary"
            >
                Enregistrer
            </Button>
        </form>
    )
}
