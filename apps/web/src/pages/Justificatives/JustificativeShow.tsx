/* eslint-disable react-hooks/exhaustive-deps */
import { InfoLink, Link, PrimaryLink } from "@base/components";
import { config } from "@base/config";
import { useApi, useAuthStore } from "hooks";
import { FormEvent, ReactNode, useCallback, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { Block, Button, PageTitle, Spinner } from "ui";

interface Justificative {
    url: string | undefined;
    id: number;
    name: string;
    file_path: string;
    file_type: string;
    uploaded_by: string;
}

export function JustificativeShow(): ReactNode {
    const { Client, data: justificative, RequestState } = useApi<Justificative>({
        url: "/justificatives",
        key: "data",
    });

    const { id } = useParams();
    const navigate = useNavigate();

    const getDatas = () => {
        if (id) Client.find(parseInt(id));
    };

    const deleteJustificative = useCallback(
        (event: FormEvent) => {
            event.preventDefault();

            if (!id) {
                toast("Une erreur s'est produite", { type: "error", position: config.toastPosition });
                navigate("/", { replace: true });
                return;
            }

            confirmAlert({
                title: "Question",
                message: "Voulez-vous supprimer ce justificatif ?",
                closeOnClickOutside: false,
                buttons: [
                    {
                        label: "Oui",
                        className: "btn btn-danger",
                        onClick: async () => {
                            const response = await Client.destroy(parseInt(id));
                            if (response.ok) {
                                toast("Justificatif supprimé", { type: "success", position: config.toastPosition });
                                navigate("/justificatives", { replace: true });
                            } else {
                                toast("Erreur de suppression", { type: "error", position: config.toastPosition });
                            }
                        },
                    },
                    {
                        label: "Non",
                        className: "btn btn-primary",
                        onClick: () => toast("Annulé", { type: "warning", position: config.toastPosition }),
                    },
                ],
            });
        },
        [id]
    );

    const { isAllowed } = useAuthStore();

    useEffect(() => {
        getDatas();
    }, []);

    return (
        <>
            <PageTitle title={justificative ? justificative.name : "Détails du justificatif"}>
                <PrimaryLink icon="list" to="/justificatives" permission="justificative.view">
                    Liste des pieces justificatives
                </PrimaryLink>
            </PageTitle>

            {RequestState.loading && <Spinner isBorder className="text-center" />}
            {justificative && (
                <>
                    <Block className="mb-3">
                        <div className="d-flex justify-content-between">
                            <h5 className="m-0">
                                Par: {justificative.uploaded_by}{" "}
                                <span className="badge text-sm bg-primary p-1 ms-3">
                                    {justificative.file_type?.toUpperCase()}
                                </span>
                            </h5>
                            <div className="d-flex">
                                <InfoLink
                                    permission="justificative.download"
                                    className="me-2"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    icon="download"
                                    to={justificative.file_path}
                                >
                                    Télécharger
                                </InfoLink>
                                {isAllowed("justificative.delete") && (
                                    <form onSubmit={deleteJustificative} method="post">
                                        <Button
                                            permission="justificative.delete"
                                            loading={RequestState.deleting}
                                            icon="trash"
                                            type="submit"
                                            mode="danger"
                                        >
                                            Supprimer
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </Block>

                    <Block>
                        {justificative.file_type?.includes("pdf") && (
                            <embed src={justificative.url} type="application/pdf" height={800} width="100%" />
                        )}

                        {justificative.file_type?.includes("image") && (
                            <img src={justificative.url} />
                        )}
                    </Block>
                </>
            )}
        </>
    );
}