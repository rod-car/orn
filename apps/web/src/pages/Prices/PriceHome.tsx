import { useApi } from "hooks";
import { ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { Block, Button } from "ui";
import { config, getToken } from '../../config'
import { ActivityLoading } from "@renderer/components";

export function PriceHome(): ReactNode {
    const {
        Client,
        datas: activities,
        RequestState
    } = useApi<Activity>({
        baseUrl: config.baseUrl,
        token: getToken(),
        url: '/activities',
        key: 'data'
    })

    const getActivities = async () => {
        await Client.get({
            imagesCount: 4,
            take: 5
        })
    }

    useEffect(() => {
        getActivities()
    }, [])

    return <>
        <div className="mb-5 d-flex justify-content-between align-items-center">
            <h2>Statistique des prix</h2>
            <Link to="/prices/list" className="btn primary-link">
                <i className="fa fa-list me-2"></i>Tous les prix d'articles
            </Link>
        </div>

        <Block className="mb-5">
            Prix pour chaque site
        </Block>

        <Block>
            Prix par an
        </Block>
    </>
}