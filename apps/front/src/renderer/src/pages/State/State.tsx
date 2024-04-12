import { SchoolByScholarYear } from './SchoolByScholarYear'
import { SchoolBySchoolYearClass } from './SchoolBySchoolYearClass'
import { StudentBySchoolZ } from './StudentBySchoolZ'

export function State(): JSX.Element {
    return (
        <>
            <div className="mb-5">
                <StudentBySchoolZ />
            </div>
            <div className="mb-5">
                <SchoolBySchoolYearClass />
            </div>
            <div className="mb-5">
                <SchoolByScholarYear />
            </div>
        </>
    )
}
