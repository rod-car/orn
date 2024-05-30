import { Button } from 'ui'
import { SchoolBySchoolYearClass } from './SchoolBySchoolYearClass'
import { StudentBySchoolZ } from './StudentBySchoolZ'
import { useCallback, useState } from 'react'
import { getPdf } from '@renderer/utils'
import { scholar_years } from 'functions'
import { StudentBySchoolZValue } from './StudentBySchoolZValue'

export function State(): JSX.Element {
    const exportPdf = useCallback(async (className = 'custom') => {
        const fileName = 'États-étudiants'

        getPdf({ fileName: `${fileName}.pdf`, className: className, title: 'États des étudiants' })
    }, [])

    const [scholarYear, _setScholarYear] = useState<string>(scholar_years().at(1) ?? '')

    return (
        <>
            <div className="d-flex align-items-center justify-content-between mb-5">
                <h2>Statistiques</h2>
                <Button
                    onClick={(): Promise<void> => exportPdf('global-state')}
                    icon="file"
                    className="btn primary-link"
                >
                    Exporter tous vers PDF
                </Button>
            </div>

            <div className="mb-5">
                <SchoolBySchoolYearClass />
            </div>

            <div className="mb-5">
                <StudentBySchoolZValue scholarYear={scholarYear} />
            </div>

            {<div className="mb-5">
                <StudentBySchoolZ scholarYear={scholarYear} />
            </div>}
        </>
    )
}
