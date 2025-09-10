/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "@base/components";
import { ReactNode, useEffect } from "react";
import { Block, PageTitle } from "ui";
import { DocumentForm } from "@base/pages/Documents";
import { useApi } from "hooks";
import { useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import { Col, Row } from "@base/components/Bootstrap";

export function DocumentEdit(): ReactNode {
    const { Client, data: document, RequestState } = useApi<FileDocument>({
        url: '/documents',
        key: 'data'
    })

    const { id } = useParams()

    useEffect(() => {
        Client.find(parseInt(id as string))
    }, [])

    return <>
        <PageTitle title="Editer un document">
            <Link className="btn btn-primary" to="/documents">
                <i className="bi bi-list me-2"></i>
                Les derniers documents
            </Link>
        </PageTitle>
        {RequestState.loading ? <DocumentFormLoading /> : (document && <DocumentForm editedDocument={document} />)}
    </>
}

function DocumentFormLoading(): ReactNode {
    return <Block>
        <div className="row mb-3">
            <Skeleton height={30} />
        </div>

        <Row className="mb-3">
            <Col n={6}><Skeleton height={30} /></Col>
            <Col n={6}><Skeleton height={30} /></Col>
        </Row>

        <Row className="mb-4">
            <Col n={12}><Skeleton height={200} /></Col>
        </Row>

        <Skeleton height={30} width={150} />
    </Block>
}