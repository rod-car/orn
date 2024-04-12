import { it, describe, expect } from 'vitest'
import { ageFull, ageMonth, ageYear } from './'

describe("Test date functions", () => {
    it("Should give the age in year", () => {
        const age = ageYear('22/06/1998')

        expect(age).toBe(25)
    })

    it("Should give the age in months", () => {
        const age = ageMonth('22/06/1998')

        expect(age).toBe(308)
    })

    it("Should give the age full age", () => {
        const age = ageFull('22/06/1998')

        expect(age).toBe("25 ans 8 mois")
    })
})