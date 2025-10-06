/* eslint-disable react-hooks/exhaustive-deps */
import { BasicCard, EditLink, PrimaryLink } from "@base/components";
import { Col, Row } from "@base/components/Bootstrap";
import { ChangeEvent, memo, ReactNode, useEffect, useState } from "react";
import { Input, PageTitle, PrimaryButton } from "ui";
import icons from "@base/assets/icons";
import { useApi } from "hooks";
import { Pagination } from "@base/components";
import { range } from "functions";
import Skeleton from "react-loading-skeleton";

interface Justificative {
    uploaded_by: string;
    id: number;
    name: string;
    file_path: string;
    file_type: string;
}

export function JustificativeHome(): ReactNode {
    const { Client, datas: justificatives, RequestState } = useApi<Justificative>({
        url: "/justificatives",
    });

    const requestParams = { paginate: true, perPage: 12, page: 1, q: "" };

    useEffect(() => {
        filter();
    }, []);

    const changePage = (data: { page: number }) => {
        Client.get({ ...requestParams, page: data.page });
    };

    const [query, setQuery] = useState(requestParams.q);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

    const filter = async () => {
        await Client.get(requestParams);
    };

    const handleSearch = async (event: ChangeEvent) => {
        const { value } = event.target as HTMLInputElement;
        setQuery(value);
        requestParams.q = value;

        if (timeoutId) clearTimeout(timeoutId);

        const newTimeoutId = setTimeout(() => {
            filter();
        }, 500);

        setTimeoutId(newTimeoutId);
    };

    return (
        <>
            <PageTitle title="Liste des justificatifs">
                <PrimaryLink permission="justificative.create" to="/justificatives/add" icon="plus-lg">
                    Ajouter un justificatif
                </PrimaryLink>
            </PageTitle>

            <div className="mb-5 mt-3 d-flex">
                <Input
                    value={query}
                    name="query"
                    onChange={handleSearch}
                    placeholder="Rechercher un (des) justificatif(s)..."
                    className="w-100 me-1"
                />
                <PrimaryButton
                    permission="justificative.view"
                    icon="search"
                    loading={RequestState.loading}
                    size="sm"
                />
            </div>

            {RequestState.loading && <JustificativesLoading />}

            {justificatives?.data?.length > 0 && (
                <Row className="mb-4">
                    {justificatives.data.map((justificative: Justificative) => (
                        <Col key={justificative.id} className="mb-3" n={3}>
                            <JustificativeCard justificative={justificative} />
                        </Col>
                    ))}
                </Row>
            )}

            {justificatives?.meta?.total > 0 && justificatives?.meta?.last_page > 1 && (
                <Pagination changePage={changePage} data={justificatives} />
            )}
        </>
    );
}

const JustificativesLoading = memo(function (): ReactNode {
    return (
        <Row className="mb-3">
            {range(12).map((index) => (
                <Col key={index} className="mb-3" n={3}>
                    <JustificativeCardLoading />
                </Col>
            ))}
        </Row>
    );
});

const JustificativeCardLoading = memo(function (): ReactNode {
    return (
        <BasicCard title={<Skeleton height={30} style={{ width: 125 }} />} actionLabel={<Skeleton height={40} style={{ width: 100 }} />}>
            <div className="text-center">
                <Skeleton height={130} style={{ width: 180 }} />
            </div>
            <p className="fst-italic text-primary text-center">
                <Skeleton height={30} />
            </p>
        </BasicCard>
    );
});

function JustificativeCard({ justificative }: { justificative: Justificative }): ReactNode {
    let icon = icons.pdf;
    if (justificative.file_type.includes("image")) icon = icons.image;

    return (
        <BasicCard
            title={justificative.name}
            actionLabel="Voir détails"
            actionLink={`/justificatives/show/${justificative.id}`}
        >
            <div className="text-center">
                <img className="w-75 text-left" src={icon} alt={justificative.name} />
            </div>
            <p className="text-center text-sm">Par: {justificative.uploaded_by || "Inconnu"}</p>
            <EditLink
                permission="justificative.edit"
                className="text-center d-block"
                to={`/justificatives/edit/${justificative.id}`}
            >
                Éditer la piece justificative
            </EditLink>
        </BasicCard>
    );
}