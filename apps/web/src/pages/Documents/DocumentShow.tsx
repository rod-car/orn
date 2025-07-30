/* eslint-disable react-hooks/exhaustive-deps */
import { InfoLink, Link } from "@base/components";
import { config } from "@base/config";
import { format } from "functions";
import { useApi, useAuthStore } from "hooks";
import { FormEvent, ReactNode, useCallback, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { DocumentViewer } from "react-documents";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { Block, Button, PageTitle, Spinner } from "ui";

function download(path: string) {
    return window.open(path, 'blank')
}

export function DocumentShow(): ReactNode {
    const { Client, data: document, RequestState } = useApi<FileDocument>({
        url: '/documents',
        key: 'data'
    })

    const { id } = useParams()
    const navigate = useNavigate()

    const requestParams = {}
    const getDatas = () => {
        if (id) Client.find(parseInt(id), requestParams)
    }

    const deleteDocument = useCallback((event: FormEvent) => {
        event.preventDefault()

        if (!id) {
            toast("Une erreur s'est produite", { type: 'error', position: config.toastPosition })
            navigate("/", { replace: true })
            return
        }

        confirmAlert({
            title: "Question",
            message: "Voulez-vous supprimer ce document ?",
            closeOnClickOutside: false,
            buttons: [
                {
                    label: "Oui",
                    className: "btn btn-danger",
                    onClick: async () => {
                        const response = await Client.destroy(parseInt(id))
                        if (response.ok) {
                            toast("Document supprimé", { type: 'success', position: config.toastPosition })
                            navigate("/documents", { replace: true })
                        } else {
                            toast("Erreur de suppression", { type: 'error', position: config.toastPosition })
                        }
                    }
                },
                {
                    label: "Non",
                    className: "btn btn-primary",
                    onClick: () => toast("Annulé", { type: 'warning', position: config.toastPosition })
                }
            ]
        })
    }, [id])

    const { isAllowed } = useAuthStore();

    useEffect(() => {
        getDatas()
    }, [])

    return <>
        <PageTitle title={document ? document.title : "Détails du document"}>
            <Link className="btn btn-primary" to="/documents"><i className="bi bi-list me-2"></i>Les derniers documents</Link>
        </PageTitle>

        {RequestState.loading && <Spinner isBorder className="text-center" />}
        {document && <>
            <Block className="mb-3">
                <div className="d-flex justify-content-between">
                    <h5 className="m-0">Par: {document.creator?.name} <span className="badge text-sm bg-primary p-1 ms-3">{document.type?.toUpperCase()}</span></h5>
                    <div className="d-flex">
                        <InfoLink permission="document.download" className="me-2" target="_blank" rel="noreferrer noopener" icon="download" to={document.path as string}>Télécharger</InfoLink>
                        {isAllowed("document.delete") && <form onSubmit={deleteDocument} method="post">
                            <Button loading={RequestState.deleting} icon="trash" type="submit" mode="danger">Supprimer</Button>
                        </form>}
                    </div>
                </div>
                <span className="text-primary fst-italic">Le {format(document.date, 'd/MM/y')}</span>
                <hr />
                <div className="mt-3">
                    <h6>Resumé</h6>
                    <p className="text-justify" dangerouslySetInnerHTML={{ __html: document.abstract as string }}></p>
                </div>
            </Block>

            <Block>
                {document.type === 'pdf' && <embed
                    src={document.path}
                    type="application/pdf"
                    height={800}
                    width="100%"
                />}

                {(document.type === 'word' || document.type === 'excel' || document.type === 'powerpoint') && <DocumentViewer
                    style={{ height: 800, width: '100%' }}
                    url={document.path} viewer="office"
                />}
            </Block>
        </>}
    </>
}