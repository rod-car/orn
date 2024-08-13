/* eslint-disable react-hooks/exhaustive-deps */
import { BasicCard, Link } from "@base/components";
import { Col, Row } from "@base/components/Bootstrap";
import { ReactNode, useEffect } from "react";
import { PageTitle } from "ui";
import pdf from "@base/assets/icons/pdf.png";
import excel from "@base/assets/icons/excel.png";
import word from "@base/assets/icons/word.png";
import ppt from "@base/assets/icons/pptx.png";
import { useApi, useAuthStore } from "hooks";
import { config } from "@base/config";
import { Pagination } from 'react-laravel-paginex';
import { range } from "functions";
import Skeleton from "react-loading-skeleton";

export function DocumentHome(): ReactNode {
    const { Client, datas: documents, RequestState } = useApi<FileDocument>({
        baseUrl: config.baseUrl,
        url: '/documents'
    })

    const requestParams = { paginate: true, perPage: 12, page: 1 }
    const getDatas = () => {
        Client.get(requestParams)
    }

    useEffect(() => {
        getDatas()
    }, [])

    const changePage = (data: { page: number }) => {
        Client.get({...requestParams, page: data.page})
    }

    return <>
        <PageTitle title="Les derniers documents">
            <Link className="btn btn-primary" to="/documents/add"><i className="fa fa-plus me-2"></i>Ajouter</Link>
        </PageTitle>

        {RequestState.loading && <DocumentsLoading />}

        {documents && documents.data && documents.data.length > 0 && <Row className="mb-4">
            {documents.data.map((document: FileDocument) => <Col key={document.id} className="mb-3" xl={3}>
                <DocumentCard document={document} />
            </Col>)}
        </Row>}

        {documents?.meta?.total > 0 && documents?.meta?.last_page > 1 && <Pagination changePage={changePage} data={documents} options={config.pagination} />}
    </>
}

function DocumentsLoading(): ReactNode {
    return <Row className="mb-3">
        {range(12).map(index => <Col key={index} className="mb-3" xl={3}>
            <DocumentCardLoading />
        </Col>)}
    </Row>
}

function DocumentCardLoading(): ReactNode {
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
}

function DocumentCard({document}: {document: FileDocument}): ReactNode {
    let icon = pdf;
    if (document.type === "excel") icon = excel;
    if (document.type === "word") icon = word;
    if (document.type === "powerpoint") icon = ppt;

    const { isAdmin } = useAuthStore()

    return <>
        <BasicCard title={document.title} actionLabel="Voir détails" actionLink={`/documents/show/${document.id}`}>
            <div className="text-center">
                <img className="w-75 text-left" src={icon} alt={document.title} />
            </div>
            <p className="fst-italic text-primary text-center text-sm">{document.date}</p>
            <p className="text-center text-sm">Par: {document.creator && document.creator.name}</p>
            {isAdmin && <Link className="text-center d-block" to={`/documents/edit/${document.id}`}>Editer le document</Link>}
        </BasicCard>
    </>
}