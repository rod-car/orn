import { FormEvent, useState } from 'react'
import { Button, Input, Textarea } from 'ui'
import { useApi } from 'hooks'
import { config, getToken } from '../../config'
import { toast } from 'react-toastify'

type ActivityFormProps = {
    editedActivity?: Activity
}

const defaultActivity: Activity = {
    id: 0,
    title: '',
    date: '',
    place: '',
    details: '',
    files: null
}

export function ActivityForm({ editedActivity }: ActivityFormProps): JSX.Element {
    const [activity, setActivity] = useState(defaultActivity)
    const {
        Client,
        error,
        RequestState
    } = useApi<Activity>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/activities',
        key: 'data'
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        const response = editedActivity
            ? await Client.patch(editedActivity.id, activity)
            : await Client.post(activity, '', {}, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

        if (response.ok) {
            const message = editedActivity ? 'Mis à jour' : 'Enregistré'
            toast(message, {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
            editedActivity === undefined && setActivity(defaultActivity)
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    if (editedActivity !== undefined && activity.id === 0)
        setActivity({
            ...editedActivity,
        })

    const handleChange = (target: EventTarget & (HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement)): void => {
        setActivity({ ...activity, [target.name]: target.name === 'files' ? Array.from(target.files) : target.value })
        if (target.value.length > 0 && error?.data.errors[target.name]) {
            error.data.errors[target.name] = null
        }
    }

    const removeFile = (index: number): void => {
        activity.files?.splice(index, 1)
        const a = { ...activity }
        setActivity(a)
    }

    return (
        <form action="#" onSubmit={handleSubmit} method="post" encType="multipart/form-data">
            <div className="row mb-3">
                <div className="col-xl-6">
                    <Input
                        label="Titre de l'activité"
                        value={activity.title}
                        error={error?.data?.errors?.title}
                        onChange={({ target }): void => handleChange(target)}
                        name="title"
                    />
                </div>
                <div className="col-xl-6">
                    <Input
                        label="Lieu"
                        value={activity.place}
                        error={error?.data?.errors?.place}
                        onChange={({ target }): void => handleChange(target)}
                        name="place"
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-xl-6">
                    <Input
                        label="Date"
                        value={activity.date}
                        error={error?.data?.errors?.date}
                        onChange={({ target }): void => handleChange(target)}
                        type="date"
                        name="date"
                    />
                </div>
                <div className="col-xl-6 mb-3">
                    <Input
                        label="Pièces jointes"
                        type='file'
                        multiple
                        accept='image/*, video/*'
                        error={error?.data?.errors?.files}
                        onChange={({ target }): void => handleChange(target)}
                        name="files"
                        required={false}
                    />
                </div>
                {activity.files && activity.files.length > 0 && <div className="row">{activity.files.map((file, index) => {
                    const url = URL.createObjectURL(file)
                    return <div key={index} className="col-3 mb-3" style={{ position: 'relative' }}>
                        <Button onClick={() => removeFile(index)} style={{ position: 'absolute', top: 10, right: 20 }} icon="close" size="sm" mode="danger" />
                        <img className="w-100" src={url} />
                    </div>
                })}</div>}
            </div>

            <div className="row mb-4">
                <div className="col-xl-12">
                    <Textarea
                        label="Compte rendu"
                        value={activity.details}
                        error={error?.data?.errors?.details}
                        onChange={({ target }): void => handleChange(target)}
                        name="details"
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
