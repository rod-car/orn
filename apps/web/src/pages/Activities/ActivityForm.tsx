import { ChangeEvent, FormEvent, ReactNode, useState } from 'react'
import { DangerButton, Input, PrimaryButton } from 'ui'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { toast } from 'react-toastify'
import { RichTextEditor } from '@base/components'

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

export function ActivityForm({ editedActivity }: ActivityFormProps): ReactNode {
    const [activity, setActivity] = useState(defaultActivity)
    const [details, setDetails] = useState("")
    const { Client, error, RequestState } = useApi<Activity>({
        
        url: '/activities',
        key: 'data'
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const headers = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }

        const response = editedActivity
            ? await Client.post({...activity, details: details}, `/${activity.id}`, {_method: 'PATCH'}, headers)
            : await Client.post({...activity, details: details}, '', {}, headers)

        if (response.ok) {
            const message = editedActivity ? 'Mis à jour' : 'Enregistré'
            toast(message, {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })
            if (editedActivity === undefined) {
                setActivity(defaultActivity)
                setDetails("")
            }
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
        }
    }

    if (editedActivity !== undefined && activity.id === 0) {
        setActivity({...editedActivity})
        setDetails(editedActivity.details)
    }

    const handleChange = ({target}: ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
        setActivity({ ...activity, [target.name]: (target.name === 'files' && "files" in target) ? Array.from(target.files as FileList) : target.value })
        if (target.value.length > 0 && error?.data.errors[target.name]) {
            error.data.errors[target.name] = []
        }
    }

    const removeFile = (index: number) => {
        activity.files?.splice(index, 1)
        const a = { ...activity }
        setActivity(a)
    }

    const removeImage = (id: number) => {
        const imgs = activity.images?.filter(image => image.id !== id)
        setActivity({...activity, images: imgs})
    }

    return (
        <form onSubmit={handleSubmit} method="post">
            <div className="row mb-3">
                <div className="col-xl-6">
                    <Input
                        label="Titre de l'activité"
                        placeholder="Ex: Mesure anthropo"
                        value={activity.title}
                        error={error?.data?.errors?.title}
                        onChange={handleChange}
                        name="title"
                    />
                </div>
                <div className="col-xl-6">
                    <Input
                        label="Lieu"
                        placeholder="Ex: EPP Romialo"
                        value={activity.place}
                        error={error?.data?.errors?.place}
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
                        name="files"
                        required={false}
                    />
                </div>
                <div className="row">
                    {activity.images && activity.images.length > 0 && activity.images.map(image => {
                        return <div key={image.id} className="col-3 mt-3" style={{ position: 'relative' }}>
                            <DangerButton onClick={() => removeImage(image.id)} style={{ position: 'absolute', top: 10, right: 20 }} icon="x" size="sm" />
                            <img className="w-100" src={image.path} />
                        </div>
                    })}

                    {activity.files && activity.files.length > 0 && activity.files.map((file, index) => {
                        const url = URL.createObjectURL(file)
                        return <div key={index} className="col-3 mt-3" style={{ position: 'relative' }}>
                            <DangerButton onClick={() => removeFile(index)} style={{ position: 'absolute', top: 10, right: 20 }} icon="x" size="sm" />
                            <img className="w-100" src={url} />
                        </div>
                    })}
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-xl-12">
                    <RichTextEditor label="Compte rendu" theme="snow" value={details} onChange={setDetails} />
                </div>
            </div>

            <PrimaryButton
                loading={RequestState.creating || RequestState.updating}
                icon="save"
                type="submit"
            >Enregistrer</PrimaryButton>
        </form>
    )
}
