import { ReactNode } from "react";
import { CardState, AppCard, BasicCard, Row, Col } from "@base/components";

export function Index(): ReactNode {
    return <>
        <h1 className="app-page-title">Overview</h1>
        <AppCard title="Test card" content="Lorem IPSUM" icon="save" actionLabel="Enregistrer" actionUrl="#" />

        <div className="row g-4 mb-4">
            <div className="col-6 col-lg-3">
                <CardState />
            </div>
            <div className="col-6 col-lg-3">
                <CardState />
            </div>
            <div className="col-6 col-lg-3">
                <CardState />
            </div>
            <div className="col-6 col-lg-3">
                <CardState />
            </div>
        </div>

        <Row className="g-4 mb-4">
            <Col n={4} lg={4}><BasicCard body="Lorem ipsum" icon="file" title="Example card" /></Col>
            <Col n={4} lg={4}><BasicCard body="Lorem ipsum" icon="list" title="Example card" /></Col>
            <Col n={4} lg={4}><BasicCard body="Lorem ipsum" icon="print" title="Example card" /></Col>
        </Row>
    </>
}