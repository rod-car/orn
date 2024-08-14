import { Link } from '@base/components'
import { Block } from 'ui'

export function AddConso(): ReactNode {
    async function save() {

    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="m-0">Ajouter une consommation</h2>
                <Link to="/cantine/list-conso" className="btn primary-link">
                    <i className="bi bi-list me-2"></i>Consommations
                </Link>
            </div>

            <Block>
                <form action="POST" onSubmit={save}>
                    
                </form>
            </Block>
        </>
    )
}
