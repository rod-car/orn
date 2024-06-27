import { Link } from '@renderer/components'
import { Block } from 'ui'

export function AddConso(): JSX.Element {
    async function save() {

    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="m-0">Ajouter une consommation</h2>
                <Link to="/cantine/list-conso" className="btn primary-link">
                    <i className="fa fa-list me-2"></i>Consommations
                </Link>
            </div>

            <Block>
                <form action="POST" onSubmit={save}>
                    
                </form>
            </Block>
        </>
    )
}
