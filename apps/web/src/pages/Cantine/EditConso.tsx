import { useApi } from 'hooks'
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { config, abaque as abaqueConfig } from '@renderer/config'
import { Button, Input } from 'ui'
import { toast } from 'react-toastify'
import { Link } from '@renderer/components'

export function EditConso(): JSX.Element {
    async function save() {

    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="m-0">Modifier les consommation</h2>
                <Link to="/cantine/list-conso" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Liste des conso
                </Link>
            </div>

            <form action="" onSubmit={save}>

            </form>
        </>
    )
}
