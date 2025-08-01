import { FormEvent, ReactNode, useCallback, useState } from "react";
import { Block, Input, PageTitle, PrimaryButton } from "ui";
import { Col, Row } from "@base/components/Bootstrap";

const defaultFormData = {
    PS: 14,
    MS: 26,
    GS: 47,
    GD: 0,
    total: 88
}

export function ValueRepartition(): ReactNode {
    const [result, setResult] = useState<Record<string, number>>()
    const [formData, setFormData] = useState(defaultFormData)

    const handleChange = useCallback(({ target }: InputChange) => {
        const { name, value } = target
        setFormData({ ...formData, [name]: value })
    }, [formData])

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault()

        const res = repartirPrescolaire(formData.total, {
            PS: formData.PS,
            MS: formData.MS,
            GS: formData.GS,
            GD: formData.GD
        })

        setResult(res)
    }, [formData])

    function repartirPrescolaire(total: number, proportions: Record<string, number>): Record<string, number> {
        let result: Record<string, number> = {};

        let filteredProportions = Object.entries(proportions).filter(([_, value]) => value > 0);
        let sumProportions = filteredProportions.reduce((sum, [_, value]) => sum + value, 0);

        let restant = total;
        const temp = total - sumProportions;

        if (temp > 0) restant = sumProportions;

        let adjustedEntries: [string, number][] = [];

        for (let [key, value] of filteredProportions) {
            let allocated = Math.round((value / sumProportions) * total);
            result[key] = Math.min(allocated, value);
            restant -= result[key];
            adjustedEntries.push([key, value]);
        }

        // Si un écart subsiste, ajuster les valeurs pour atteindre total
        if (restant !== 0) {
            for (let [key, _] of adjustedEntries.sort((a, b) => b[1] - a[1])) {
                if (restant === 0) break;
                result[key] += Math.sign(restant);
                restant -= Math.sign(restant);
            }
        }

        for (let key in proportions) result[key] = proportions[key] === 0 ? 0 : result[key] ?? 0;

        if (temp > 0) result["Reste"] = temp;

        return result;
    }

    return <>
        <PageTitle title="Repartition de nombre" />
        <Block title="Information de la classe">
            <form method="post" onSubmit={handleSubmit}>
                <Row>
                    <Col n={3}>
                        <Input
                            label="PS"
                            placeholder="PS"
                            name="PS"
                            value={formData.PS}
                            onChange={handleChange}
                            type="number"
                        />
                    </Col>
                    <Col n={3}>
                        <Input
                            label="MS"
                            placeholder="MS"
                            name="MS"
                            value={formData.MS}
                            onChange={handleChange}
                            type="number"
                        />
                    </Col>
                    <Col n={3}>
                        <Input
                            label="GS"
                            placeholder="GS"
                            name="GS"
                            value={formData.GS}
                            onChange={handleChange}
                            type="number"
                        />
                    </Col>
                    <Col n={3}>
                        <Input
                            label="GD"
                            placeholder="GD"
                            name="GD"
                            value={formData.GD}
                            onChange={handleChange}
                            type="number"
                        />
                    </Col>
                    <Col n={12}>
                        <Input
                            label="TOTAL"
                            placeholder="Total"
                            name="total"
                            value={formData.total}
                            onChange={handleChange}
                            type="number"
                        />
                    </Col>
                </Row>

                <div className="mb-3">
                    <ul>
                        {result && Object.keys(result).map((key, index) => <li key={index}>{key}: <span className="fw-bold">{result[key]}</span></li>)}
                    </ul>
                </div>

                <PrimaryButton permission="tools.value-repartition" type="submit" icon="save">Voir la repartition</PrimaryButton>
            </form>
        </Block>
    </>
}