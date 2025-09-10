import {ReactNode, useEffect} from "react";
import {Block, PageTitle, Spinner} from "ui";
import {PrimaryLink, Z} from "@base/components";
import {useApi} from "hooks"

export function ZCalculatorHistory(): ReactNode {
    const { Client, datas: persons, RequestState } = useApi<Person>({
        url: '/tools'
    })

    useEffect(() => {
        Client.get({}, "/z-history")
    }, [])


    return <>
        <PageTitle title="Historique">
            <PrimaryLink permission="tools.z-calculator" to="/tools/z-calculator" icon="plus">Calculateur de Z</PrimaryLink>
        </PageTitle>

        <Block>
            {RequestState.loading ? <Spinner isBorder className="text-center" /> : <table className="table table-striped table-bordered table-hover text-sm">
                <thead>
                <tr>
                    <th>Code</th>
                    <th>Nom complet</th>
                    <th>Taille</th>
                    <th>Poids</th>
                    <th>Resultats</th>
                </tr>
                </thead>
                <tbody>
                {persons && persons.map(person => <tr key={person.id}>
                    <td>{person.id}</td>
                    <td>{person.lastname} {person.firstname}</td>
                    <td>{person.height}</td>
                    <td>{person.weight}</td>
                    <td>
                        <ul>
                            <li>Taille pour l'age: <Z value={person.z_ha} normal={[25, 75]}/></li>
                            <li>Poids pour l'age: <Z value={person.z_wa} normal={[25, 75]}/></li>
                            <li>Taille pour poids: <Z value={person.z_hw} normal={[-1.5, 0]}/></li>
                            <li>IMC pour age: <Z value={person.z_ia} normal={[-1, 2]}/></li>
                        </ul>
                    </td>
                </tr>)}
                </tbody>
            </table>}
        </Block>
    </>
}

