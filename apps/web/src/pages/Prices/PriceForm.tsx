/* eslint-disable react-hooks/exhaustive-deps */
import { FormEvent, useEffect, useState } from 'react'
import { Button, Input, Select } from 'ui'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { toast } from 'react-toastify'
import { years, months } from 'functions'

type AddInfo = {
    month: number
    year: number
    site_id: number
    acn: string
}

const defaultAddInfo: AddInfo = { month: 0, year: 0, site_id: 0, acn: '' }

export function PriceForm(): React.ReactNode {
    const [articlePrice, setArticlePrice] = useState<ArticlePrice[]>([])
    const [addInfo, setAddInfo] = useState(defaultAddInfo)
    const { Client, error, RequestState } = useApi<ArticlePrice[]>({
        url: '/prices',
        key: 'data'
    })

    const { Client: SiteClient, datas: sites } = useApi<Site>({
        url: '/prices/sites',
        key: 'data'
    })

    const { Client: ArticleClient, datas: articles } = useApi<Article>({
        url: '/prices/articles',
        key: 'data'
    })

    const { Client: UnitClient, datas: units } = useApi<Unit>({
        url: '/prices/units',
        key: 'data'
    })

    useEffect(() => {
        ArticleClient.get()
        SiteClient.get()
        UnitClient.get()
    }, [])

    // Initialisation des articles dès leur chargement
    useEffect(() => {
        if (articles.length > 0) {
            const initialPrices = articles.map(article => ({
                id: 0,
                site_id: addInfo.site_id,
                article_id: article.id,
                unit_id: article.unit?.id ?? null,
                year: addInfo.year,
                month: addInfo.month,
                acn: addInfo.acn,
                price: 0
            }))
            setArticlePrice(initialPrices)
        }
    }, [articles])

    const updateData = async () => {
        if (addInfo.month !== 0 && addInfo.site_id !== 0 && addInfo.year !== 0) {
            const data = await Client.get({
                month: addInfo.month,
                site_id: addInfo.site_id,
                year: addInfo.year
            }) as unknown as ArticlePrice[]

            if (data.length > 0) {
                setAddInfo(prev => ({ ...prev, acn: data[0].acn }))

                const updatedPrices = articles.map(article => {
                    const existing = data.find(d => d.article_id === article.id)
                    return {
                        id: existing?.id ?? 0,
                        site_id: addInfo.site_id,
                        article_id: article.id,
                        unit_id: existing?.unit_id ?? article.unit?.id ?? 0,
                        year: addInfo.year,
                        month: addInfo.month,
                        acn: existing?.acn ?? addInfo.acn,
                        price: existing?.price ?? 0
                    }
                })
                setArticlePrice(updatedPrices)
            }
        }
    }

    useEffect(() => {
        updateData()
    }, [addInfo.month, addInfo.site_id, addInfo.year])

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        const temp = articlePrice.map(ap => ({
            ...ap,
            month: addInfo.month,
            year: addInfo.year,
            acn: addInfo.acn,
            site_id: addInfo.site_id
        })).filter(ap => (ap.unit_id !== null && parseFloat(ap.price as unknown as string) > 0))

        const response = await Client.post(temp)

        if (response.ok) {
            toast('Enregistré', {
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

    const handleChange = (target: EventTarget & (HTMLSelectElement | HTMLInputElement)): void => {
        const value = (target.name === "year" || target.name === "month" || target.name === "site_id")
            ? parseInt(target.value) : target.value

        setAddInfo(prev => ({ ...prev, [target.name]: value }))
    }

    const handleFieldChange = (value: string | number, index: number, key: keyof ArticlePrice) => {
        const updated = [...articlePrice]
        updated[index] = { ...updated[index], [key]: value }
        setArticlePrice(updated)
    }

    return (
        <form onSubmit={handleSubmit} method="post">
            <div className="row mb-3">
                <div className="col-xl-6">
                    <Select
                        label="Site"
                        options={sites}
                        config={{ optionKey: 'id', valueKey: 'full_name' }}
                        value={addInfo.site_id}
                        error={error?.data?.errors?.site_id}
                        onChange={({ target }) => handleChange(target)}
                        name="site_id"
                        controlled
                    />
                </div>
                <div className="col-xl-6">
                    <Input
                        label="ACN"
                        value={addInfo.acn}
                        error={error?.data?.errors?.acn}
                        onChange={({ target }) => handleChange(target)}
                        name="acn"
                        required={false}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-xl-6">
                    <Select
                        label="Mois"
                        options={months}
                        config={{ optionKey: 'id', valueKey: 'label' }}
                        value={addInfo.month}
                        error={error?.data?.errors?.month}
                        onChange={({ target }) => handleChange(target)}
                        name="month"
                        controlled
                    />
                </div>
                <div className="col-xl-6">
                    <Select
                        label="Année"
                        options={years}
                        value={addInfo.year}
                        error={error?.data?.errors?.year}
                        onChange={({ target }) => handleChange(target)}
                        name="year"
                        controlled
                    />
                </div>
            </div>

            <hr className="mt-4" />

            <table className="table table-striped table-bordered mb-4 table-hover text-sm align-middle">
                <thead className='table-primary'>
                    <tr>
                        <th>Article</th>
                        <th>Unité</th>
                        <th>Prix Unitaire (Ar)</th>
                    </tr>
                </thead>
                <tbody>
                    {RequestState.loading && (
                        <tr><td colSpan={3}>Chargement…</td></tr>
                    )}
                    {!RequestState.loading && articlePrice.map((element, index) => {
                        const article = articles.find(a => a.id === element.article_id)
                        return (
                            <tr key={element.article_id}>
                                <td>{article?.designation ?? '—'}</td>
                                <td>
                                    <Select
                                        onChange={({ target }) =>
                                            handleFieldChange(parseInt(target.value), index, 'unit_id')
                                        }
                                        value={element.unit_id as number}
                                        options={units}
                                        config={{ optionKey: 'id', valueKey: 'name' }}
                                        error={error?.data?.errors?.[`articlePrice.${index}.unit_id`]}
                                        controlled
                                        name={`unit_id-${index}`}
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={({ target }) =>
                                            handleFieldChange(parseFloat(target.value), index, 'price')
                                        }
                                        value={element.price}
                                        type="number"
                                        error={error?.data?.errors?.[`articlePrice.${index}.price`]}
                                    />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <Button
                permission="price.create"
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
