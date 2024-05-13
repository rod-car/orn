import { Button } from 'ui'
import { SchoolByScholarYear } from './SchoolByScholarYear'
import { SchoolBySchoolYearClass } from './SchoolBySchoolYearClass'
import { StudentBySchoolZ } from './StudentBySchoolZ'
import { useCallback } from 'react'
import { getPdf } from '@renderer/utils'

export function State(): JSX.Element {
    const exportPdf = useCallback(async (className = 'custom') => {
        const fileName = 'États-étudiants'

        getPdf({ fileName: `${fileName}.pdf`, className: className, title: 'États des étudiants' })
    }, [])

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
                <SchoolByScholarYear />
            </div>

            <div className="mb-5">
                <StudentBySchoolZ />
            </div>
        </>
    )
}
