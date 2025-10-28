/* eslint-disable react-hooks/exhaustive-deps */
import { FormEvent, ReactNode, useEffect, useState } from 'react'
import { Button, Input, Select, Textarea } from 'ui'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { toast } from '@base/ui';

type ArticleFormProps = {
    editedArticle?: Article
}

const defaultArticle: Article = {
    id: 0,
    designation: '',
    description: '',
    code: '',
    unit_id: 0,
}

export function ArticleForm({ editedArticle }: ArticleFormProps): ReactNode {
    const [article, setArticle] = useState(defaultArticle)
    const { Client, error, RequestState } = useApi<Article>({
        url: '/prices/articles',
        key: 'data'
    })

    const { Client: UnitClient, datas: units } = useApi<Unit>({
        url: '/prices/units',
        key: 'data'
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        const response = editedArticle
            ? await Client.patch(editedArticle.id, article)
            : await Client.post(article, '', {}, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

        if (response.ok) {
            const message = editedArticle ? 'Mis à jour' : 'Enregistré'
            toast(message, {
                closeButton: true,
                type: 'success'
            })
            editedArticle === undefined && setArticle(defaultArticle)
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error'
            })
        }
    }

    if (editedArticle !== undefined && article.id === 0) {
        setArticle({
            ...editedArticle,
        })
    }

    const handleChange = (target: EventTarget & (HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement)): void => {
        setArticle({ ...article, [target.name]: target.value })
        if (target.value.length > 0 && error?.data.errors[target.name]) {
            error.data.errors[target.name] = []
        }
    }

    useEffect(() => {
        UnitClient.get()
    }, [])

    return (
        <form action="#" onSubmit={handleSubmit} method="post" encType="multipart/form-data">
            <div className="row mb-3">
                <div className="col-xl-6">
                    <Input
                        label="Code"
                        value={article.code}
                        error={error?.data?.errors?.code}
                        onChange={({ target }): void => handleChange(target)}
                        name="code"
                        required={false}
                    />
                </div>
                <div className="col-xl-6">
                    <Input
                        label="Désignation / Nom"
                        value={article.designation}
                        error={error?.data?.errors?.designation}
                        onChange={({ target }): void => handleChange(target)}
                        name="designation"
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-xl-6">
                    <Select
                        name='unit_id'
                        label="Unite de l'article"
                        onChange={({ target }) => handleChange(target)}
                        value={article.unit_id}
                        options={units}
                        config={{ optionKey: 'id', valueKey: 'name' }}
                        controlled
                    />
                </div>
                <div className="col-xl-6">
                    <Textarea
                        label="Description"
                        value={article.description}
                        error={error?.data?.errors?.description}
                        onChange={({ target }): void => handleChange(target)}
                        name="description"
                        required={false}
                    />
                </div>
            </div>

            <Button
                permission="article.create"
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
