import { RichTextEditor } from "@base/components";
import { config } from "@base/config";
import { useApi } from "hooks";
import { FormEvent, ReactNode, useState } from "react";
import { toast } from "react-toastify";
import { Block, PageTitle, PrimaryButton } from "ui";

export function JardinScolaire(): ReactNode {
    const [details, setDetails] = useState("<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores consequuntur quae corporis, nobis doloremque eos? Fugiat quae cumque saepe blanditiis possimus mollitia est nobis. Non nemo praesentium repellendus error velit!</p>")

    const { Client, RequestState } = useApi<{id: number, jardin_details: string}>({
        url: '/settings',
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

    return <>
        <PageTitle title="Configuration du jardin scolaire" />

        <Block>
            <h5 className="text-primary mb-4">Étapes commune a tous les jardins</h5>
            <form method="post" onSubmit={handleSubmit}>
                <RichTextEditor label="Details commune" theme="snow" value={details} onChange={setDetails} />
                <PrimaryButton type="submit" className="mt-4" icon="save" loading={RequestState.creating}>Enregistrer</PrimaryButton>
            </form>
        </Block>
    </>
}