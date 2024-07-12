import { FormEvent, useEffect, useState } from 'react'
import { Button, Input, Select } from 'ui'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { toast } from 'react-toastify'
import { years, months } from 'functions'

type AddInfo = {
    month: number
    year: number
    site_id: number,
    acn: string
}

const defaultAddInfo: AddInfo = { month: 0, year: 0, site_id: 0, acn: '' }

const d: ArticlePrice = {
    id: 0,
    site_id: 0,
    article_id: 0,
    unit_id: 0,
    year: 0,
    month: 0,
    acn: '',
    price: 0
}

const defaultArticlePrice: ArticlePrice[] = [d]

export function PriceForm(): JSX.Element {
    const [articlePrice, setArticlePrice] = useState(defaultArticlePrice)
    const [addInfo, setAddInfo] = useState(defaultAddInfo)
    const {
        Client,
        error,
        RequestState
    } = useApi<ArticlePrice[]>({
        baseUrl: config.baseUrl,
        
        url: '/prices',
        key: 'data'
    })

    const {
        Client: SiteClient, datas: sites
    } = useApi<Site>({
        baseUrl: config.baseUrl,
        
        url: '/prices/sites',
        key: 'data'
    })

    const {
        Client: ArticleClient, datas: articles
    } = useApi<Article>({
        baseUrl: config.baseUrl,
        
        url: '/prices/articles',
        key: 'data'
    })

    const {
        Client: UnitClient, datas: units
    } = useApi<Unit>({
        baseUrl: config.baseUrl,
        
        url: '/prices/units',
        key: 'data'
    })

    useEffect(() => {
        ArticleClient.get()
        SiteClient.get()
        UnitClient.get()
    }, [])

    const updateData = async () => {
        if (addInfo.month !== 0 && addInfo.site_id !== 0 && addInfo.year !== 0) {
            const data = await Client.get({
                month: addInfo.month,
                site_id: addInfo.site_id,
                year: addInfo.year
            }) as unknown as ArticlePrice[]
            if (data.length > 0) {
                setAddInfo({ ...addInfo, acn: data.at(0)?.acn as string })
                setArticlePrice([...data])
            } else {
                setArticlePrice([...articlePrice.map(article => {
                    return { ...article, price: 0 }
                })])
            }
        }
    }

    useEffect(() => {
        updateData()
    }, [addInfo.month, addInfo.site_id, addInfo.year])

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const temp = articlePrice.map(ap => {
            return { ...ap, month: addInfo.month, year: addInfo.year, acn: addInfo.acn, site_id: addInfo.site_id }
        })

        const response = await Client.post(temp)

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

    const handleChange = (target: EventTarget & (HTMLSelectElement | HTMLInputElement)): void => {
        const value = (target.name === "year" || target.name === "month") ? parseInt(target.value) : target.value
        const temp = articlePrice.map(a => {
            return { ...a, [target.name]: value }
        })
        setAddInfo({ ...addInfo, [target.name]: value })
        setArticlePrice([...temp])
    }

    const addElement = () => {
        setArticlePrice([...articlePrice, d])
    }

    const removeElement = (index: number) => {
        setArticlePrice([...articlePrice.filter((_value, key) => key !== index)])
    }

    const handleFieldChange = (value: string | number, index: number, key: keyof ArticlePrice) => {
        articlePrice[index] = { ...articlePrice[index], [key]: value }
        setArticlePrice([...articlePrice])
    }

    return (
        <form action="#" onSubmit={handleSubmit} method="post">
            <div className="row mb-3">
                <div className="col-xl-6">
                    <Select
                        label="Site"
                        options={sites}
                        config={{ optionKey: 'id', valueKey: 'name' }}
                        value={addInfo.site_id}
                        error={error?.data?.errors?.site_id}
                        onChange={({ target }): void => handleChange(target)}
                        name="site_id"
                        controlled
                    />
                </div>
                <div className="col-xl-6">
                    <Input
                        label="ACN"
                        value={addInfo.acn}
                        error={error?.data?.errors?.acn}
                        onChange={({ target }): void => handleChange(target)}
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
                        onChange={({ target }): void => handleChange(target)}
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
                        onChange={({ target }): void => handleChange(target)}
                        name="year"
                        controlled
                    />
                </div>
            </div>

            <hr className="mt-4" />

            <table className="table table-striped mb-4">
                <thead>
                    <tr>
                        <th>Article</th>
                        <th>Unité</th>
                        <th>Prix Unitaire (Ar)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {RequestState.loading && <tr>
                        <td colSpan={4}>Chargement</td>
                    </tr>}
                    {articlePrice && articlePrice.map((element: ArticlePrice, index) => <tr key={index}>
                        <td><Select onChange={({ target }) => handleFieldChange(target.value, index, 'article_id')} value={element.article_id} options={articles} config={{ optionKey: 'id', valueKey: 'designation' }} controlled /></td>
                        <td><Select onChange={({ target }) => handleFieldChange(target.value, index, 'unit_id')} value={element.unit_id} options={units} config={{ optionKey: 'id', valueKey: 'name' }} controlled /></td>
                        <td><Input onChange={({ target }) => handleFieldChange(target.value, index, 'price')} value={element.price} type="number" /></td>
                        <td>
                            {index === 0 && <Button onClick={addElement} type="button" mode="primary" icon="plus" />}
                            {index > 0 && <Button onClick={() => removeElement(index)} type="button" mode="danger" icon="minus" />}
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>

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
