/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { config } from "@base/config";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Block, Button, Input } from "ui";
import 'react-quill/dist/quill.snow.css';
import { format } from "functions";
import { RichTextEditor } from "@base/components/index.ts";

export function DocumentForm({ editedDocument }: { editedDocument?: FileDocument }): ReactNode {
    const defaultDocument: FileDocument = {
        id: 0,
        title: "",
        date: format(new Date().toDateString(), "y-MM-d"),
        abstract: "",
        file: undefined
    }
    const [document, setDocument] = useState<FileDocument>(defaultDocument);
    const [abstract, setAbstract] = useState("");
    const { Client, error, RequestState } = useApi<FileDocument>({
        
        url: '/documents',
        key: 'data'
    })

    useEffect(() => {
        if (editedDocument) {
            setDocument({
                id: editedDocument.id,
                date: editedDocument.date,
                title: editedDocument.title
            })
            setAbstract(editedDocument.abstract as string)
        }
    }, [])

    const fileRef = useRef<HTMLInputElement>()

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        const headers = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }

        const response = editedDocument
            ? await Client.post({...document, abstract: abstract}, `/${document.id}`, {_method: 'PATCH'}, headers)
            : await Client.post({...document, abstract: abstract}, '', {}, headers)

        if (response.ok) {
            const message = editedDocument ? 'Mis à jour' : 'Enregistré'
            toast(message, {
                closeButton: true,
                type: 'success',
                position: config.toastPosition
            })

            if (editedDocument === undefined) {
                setDocument(defaultDocument)
                setAbstract("");
                if (fileRef.current) fileRef.current.value = ''
            }
        } else {
            toast('Erreur de soumission', {
                closeButton: true,
                type: 'error',
                position: config.toastPosition
            })
            setDocument({...document, file: undefined})
            if (fileRef.current) fileRef.current.value = ''
        }
    }

    const handleChange = ({target}: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setDocument({ ...document, [target.name]: (target.name === 'file' && 'files' in target) ? target.files?.item(0) : target.value })
        if (target.value.length > 0 && error?.data?.errors && error?.data?.errors[target.name]) {
            error.data.errors[target.name] = []
        }
    };

    return <Block>
        <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
            <div className="row mb-3">
                <div className="col-xl-12">
                    <Input
                        label="Titre du document"
                        placeholder="Ex: Rapport mensuel Janvier 2024"
                        value={document.title}
                        error={error?.data?.errors?.title}
                        onChange={handleChange}
                        name="title"
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-xl-6">
                    <Input
                        label="Date"
                        value={document.date}
                        error={error?.data?.errors?.date}
                        onChange={handleChange}
                        type="date"
                        name="date"
                    />
                </div>
                <div className="col-xl-6 mb-3">
                    <Input
                        label="Fichier (PDF, WORD, EXCEL)"
                        type='file'
                        accept='application/msword, .docx, application/vnd.ms-excel, .xlsx, application/vnd.openxmlformats-officedocument.presentationml.presentation, .ppt, .pptx, application/pdf'
                        error={error?.data?.errors?.file}
                        onChange={handleChange}
                        name="file"
                        required={false}
                        ref={fileRef}
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-xl-12">
                    <RichTextEditor label="Résumé" theme="snow" value={abstract} onChange={setAbstract} />
                </div>
            </div>

            <Button loading={RequestState.creating || RequestState.updating} icon="save" type="submit" mode="primary">
                Enregistrer
            </Button>
        </form>
    </Block>
}