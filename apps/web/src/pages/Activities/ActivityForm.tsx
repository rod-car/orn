import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react'
import { useApi } from 'hooks'
import { config } from '@base/config'
import { toast } from 'react-toastify'
import { RichTextEditor } from '@base/components'
import imageCompression from 'browser-image-compression';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { DangerButton, Input, PrimaryButton, Select } from 'ui'
import placeholder from '@base/assets/images/placeholder.webp';
import { LazyLoadImage } from 'react-lazy-load-image-component';

type ActivityFormProps = {
    editedActivity?: Activity
}

const defaultActivity: Activity = {
    id: 0,
    title: '',
    date: '',
    place: '',
    details: '',
    service_id: 0,
    files: null
}

export function ActivityForm({ editedActivity }: ActivityFormProps): ReactNode {
    const [activity, setActivity] = useState(defaultActivity)
    const [details, setDetails] = useState("")
    const [optimizing, setOptimizing] = useState(false)

    const { Client, error, RequestState } = useApi<Activity>({
        url: '/activities',
        key: 'data'
    })

    const { Client: ServiceClient, datas: services, RequestState: ServiceRequestState } = useApi<{id: string, title: string, description: string}>({
        url: '/services',
        key: 'data'
    })

    const compressFiles = async (files: File[]): Promise<File[]> => {
        const resizedImages = [];

        for (let i = 0; i < files.length; i++) {
            const resizedImage = await browserResizer(files[i]);
            resizedImages.push(resizedImage);
            // toast(`Image ${i + 1} optimisée`, { position: config.toastPosition, type: 'success' })
        }

        return resizedImages as File[]
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const headers = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }

        let optimizedImages = activity.files

        if (activity.files) {
            toast("Optimisation des images en cours", {
                type: "info",
                position: config.toastPosition
            })

            setOptimizing(true)
            optimizedImages = await compressFiles(activity.files)
            setOptimizing(false)
        }

        toast(`Enregistrement des donnees`, { position: config.toastPosition, type: 'info' })

        const response = editedActivity
            ? await Client.post({ ...activity, files: optimizedImages, details: details }, `/${activity.id}`, { _method: 'PATCH' }, headers)
            : await Client.post({ ...activity, files: optimizedImages, details: details }, '', {}, headers)

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
        setActivity({ ...editedActivity })
        setDetails(editedActivity.details)
    }

    const handleChange = async ({ target }: ChangeEvent<HTMLSelectElement | HTMLInputElement>): Promise<void> => {
        setActivity({ ...activity, [target.name]: (target.name === 'files' && "files" in target) ? Array.from(target.files as FileList) : target.value })
        if (target.value.length > 0 && error?.data.errors[target.name]) {
            error.data.errors[target.name] = []
        }
    }

    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    }

    const browserResizer = async (file: File) => {
        try {
            const compressedFile = await imageCompression(file, options);

            return compressedFile
        } catch (error) {
            console.error(error);
        }
    };

    const removeFile = (index: number) => {
        activity.files?.splice(index, 1)
        const a = { ...activity }
        setActivity(a)
    }

    const removeImage = (id: number) => {
        const imgs = activity.images?.filter(image => image.id !== id)
        setActivity({ ...activity, images: imgs })
    }

    useEffect(() => {
        ServiceClient.get()
    }, [ServiceClient])

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

                <div className="col-xl-3">
                    <Input
                        label="Lieu"
                        placeholder="Ex: EPP Romialo"
                        value={activity.place}
                        error={error?.data?.errors?.place}
                        onChange={handleChange}
                        name="place"
                    />
                </div>

                <div className="col-xl-3">
                    <Select
                        options={services}
                        config={{optionKey: 'id', valueKey: 'title'}}
                        value={activity.service_id}
                        onChange={handleChange}
                        label="Catégorie"
                        name="service_id"
                        placeholder="Aucune"
                        loading={ServiceRequestState.loading}
                        required={false}
                        controlled
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
                            <DangerButton permission="activity.create" onClick={() => removeImage(image.id)} style={{ position: 'absolute', top: 10, right: 20, zIndex: 50 }} icon="x" size="sm" />
                            <LazyLoadImage
                                alt={`Image ${image.id}`}
                                src={image.path}
                                effect="blur"
                                placeholderSrc={placeholder}
                                width="100%" />
                        </div>
                    })}

                    {activity.files && activity.files.length > 0 && activity.files.map((file, index) => {
                        const url = URL.createObjectURL(file)
                        return <div key={index} className="col-3 mt-3" style={{ position: 'relative' }}>
                            <DangerButton permission="activity.create" onClick={() => removeFile(index)} style={{ position: 'absolute', top: 10, right: 20, zIndex: 10 }} icon="x" size="sm" />
                            <LazyLoadImage
                                alt={`Image ${index + 1}`}
                                src={url}
                                effect="blur"
                                placeholderSrc={placeholder}
                                width="100%" />
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
                loading={RequestState.creating || RequestState.updating || optimizing}
                icon="save"
                type="submit"
                permission="activity.create"
            >
                Enregistrer
            </PrimaryButton>
        </form>
    )
}
