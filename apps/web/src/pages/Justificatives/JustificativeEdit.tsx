/* eslint-disable react-hooks/exhaustive-deps */
import { Link, PrimaryLink } from "@base/components";
import { ReactNode, useEffect } from "react";
import { Block, PageTitle } from "ui";
import { JustificativeForm } from "@base/pages/Justificatives";
import { useApi } from "hooks";
import { useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import { Col, Row } from "@base/components/Bootstrap";

export function JustificativeEdit(): ReactNode {
    const { Client, data: justificative, RequestState } = useApi<Justificative>({
        url: "/justificatives",
        key: "data",
    });

    const { id } = useParams();

    useEffect(() => {
        if (id) Client.find(parseInt(id));
    }, [id]);

    return (
        <>
            <PageTitle title="Éditer une piece justificative">
                <PrimaryLink icon="list" to="/justificatives" permission="justificative.view">
                    Liste des pieces justificatives
                </PrimaryLink>
            </PageTitle>
            {RequestState.loading ? (
                <JustificativeFormLoading />
            ) : (
                justificative && <JustificativeForm editedJustificative={justificative} />
            )}
        </>
    );
}

function JustificativeFormLoading(): ReactNode {
    return (
        <Block>
            <div className="row mb-3">
                <Skeleton height={30} />
            </div>
            <Row className="mb-3">
                <Col n={6}>
                    <Skeleton height={30} />
                </Col>
            </Row>
            <Skeleton height={30} width={150} />
        </Block>
    );
}