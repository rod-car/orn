/* eslint-disable react-hooks/exhaustive-deps */
import { BasicCard, EditLink, Link, PrimaryLink } from "@base/components";
import { Col, Row } from "@base/components/Bootstrap";
import { ChangeEvent, memo, ReactNode, useEffect, useState } from "react";
import { Input, PageTitle, PrimaryButton } from "ui";
import icons from "@base/assets/icons";
import { useApi, useAuthStore } from "hooks";
import { Pagination } from '@base/components';
import { range } from "functions";
import Skeleton from "react-loading-skeleton";

/**
 * Lister tous les documents par date de création
 *
 * @export
 * @returns {ReactNode}
 */
export function DocumentHome(): ReactNode {
    const { Client, datas: documents, RequestState } = useApi<FileDocument>({
        url: '/documents'
    })

    const requestParams = { paginate: true, perPage: 12, page: 1, q: '' }

    useEffect(() => {
        filter()
    }, [])

    const changePage = (data: { page: number }) => {
        Client.get({...requestParams, page: data.page})
    }

    const [query, setQuery] = useState(requestParams.q)
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

    const filter = async () => {
        await Client.get(requestParams)
    }

    const handleSearch = async (event: ChangeEvent) => {
        const { value } = event.target as HTMLInputElement

        setQuery(value)
        requestParams['q'] = value

        if (timeoutId) clearTimeout(timeoutId)

        const newTimeoutId = setTimeout(() => {
            filter()
        }, 500)

        setTimeoutId(newTimeoutId)
    }

    return <>
        <PageTitle title="Les derniers documents">
            <PrimaryLink permission="document.create" to="/documents/add" icon="plus-lg">
                Ajouter un document
            </PrimaryLink>
        </PageTitle>

        <div className="mb-5 mt-3 d-flex">
            <Input
                value={query}
                name="query"
                onChange={handleSearch}
                placeholder="Rechercher un (des) document(s)..."
                className="w-100 me-1"
            />
            <PrimaryButton
                icon="search"
                loading={RequestState.loading}
                size="sm"
            />
        </div>

        {RequestState.loading && <DocumentsLoading />}

        {documents && documents.data && documents.data.length > 0 && <Row className="mb-4">
            {documents.data.map((document: FileDocument) => <Col key={document.id} className="mb-3" n={3}>
                <DocumentCard document={document} />
            </Col>)}
        </Row>}

        {documents?.meta?.total > 0 && documents?.meta?.last_page > 1 && <Pagination changePage={changePage} data={documents} />}
    </>
}

/**
 * Placeholder pour le chargement
 *
 * @returns {ReactNode}
 */
const DocumentsLoading = memo(function(): ReactNode {
    return <Row className="mb-3">
        {range(12).map(index => <Col key={index} className="mb-3" n={3}>
            <DocumentCardLoading />
        </Col>)}
    </Row>
})

/**
 * Placeholder pour le chargement de la Card
 *
 * @returns {ReactNode}
 */
const DocumentCardLoading = memo(function(): ReactNode {
    return <>
        <BasicCard title={<Skeleton height={30} style={{ width: 125 }} />} actionLabel={<Skeleton height={40} style={{ width: 100 }} />}>
            <div className="text-center">
                <Skeleton height={130} style={{ width: 180 }} />
            </div>
            <p className="fst-italic text-primary text-center">
                <Skeleton height={30} />
            </p>
        </BasicCard>
    </>
})

/**
 * Card pour representer le document
 *
 * @param {{document: FileDocument}} param0
 * @param {FileDocument} param0.document
 * @returns {ReactNode}
 */
function DocumentCard({document}: {document: FileDocument}): ReactNode {
    let icon = icons.pdf;
    if (document.type === "excel") icon = icons.excel;
    if (document.type === "word") icon = icons.word;
    if (document.type === "powerpoint") icon = icons.pptx;

    return <>
        <BasicCard title={document.title} actionLabel="Voir détails" actionLink={`/documents/show/${document.id}`}>
            <div className="text-center">
                <img className="w-75 text-left" src={icon} alt={document.title} />
            </div>
            <p className="fst-italic text-primary text-center text-sm">{document.date}</p>
            <p className="text-center text-sm">Par: {document.creator && document.creator.name}</p>
            <EditLink permission="document.edit" className="text-center d-block" to={`/documents/edit/${document.id}`}>Editer le document</EditLink>
        </BasicCard>
    </>
}