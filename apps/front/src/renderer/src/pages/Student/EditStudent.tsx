import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Block, Button, Input, Select, Spinner } from 'ui'
import { Link, useParams } from 'react-router-dom'
import { useApi } from 'hooks'
import { config } from '../../../config'
import { toast } from 'react-toastify'
import { gender, scholar_years } from 'functions'

export function EditStudent(): JSX.Element {
    const { id } = useParams()

    const {
        Client: StudentClient,
        data: student,
        RequestState: SRequestState
    } = useApi<Student>({
        baseUrl: config.baseUrl,
        url: '/students'
    })

    const { Client: ScClient, datas: ScDatas } = useApi<School>({
        baseUrl: config.baseUrl,
        url: '/schools',
        key: 'data'
    })

    const { Client: ClClient, datas: ClDatas } = useApi<Classes>({
        baseUrl: config.baseUrl,
        url: '/classes',
        key: 'data'
    })

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const response = await StudentClient.patch(parseInt(id as string), {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            gender: formData.get('gender'),
            birth_date: formData.get('birth_date'),
            birth_place: formData.get('birth_place'),
            father: formData.get('father'),
            mother: formData.get('mother'),
            school: formData.get('school'),
            classes: formData.get('classes'),
            scholar_year: formData.get('scholar_year')
        })

        if (response.ok) {
            toast(response.message, {
                closeButton: true,
                type: 'success',
                position: 'bottom-right'
            })
        } else {
            toast(response.message, {
                closeButton: true,
                type: 'error',
                position: 'bottom-right'
            })
        }
    }

    const getClasses = async (): Promise<void> => {
        await ClClient.get()
    }

    const getSchools = async (): Promise<void> => {
        await ScClient.get()
    }

    const getStudent = useCallback(async () => {
        await StudentClient.find(parseInt(id ?? ''), {
            student_only: 1
        })
    }, [])

    useEffect(() => {
        getClasses()
        getSchools()
        getStudent()
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2>{student?.fullname}</h2>
                <Link to="/student/list" className="btn btn-primary">
                    <i className="fa fa-list me-2"></i>Liste des étudiants
                </Link>
            </div>
            <Block>
                {student ? (
                    <form action="" onSubmit={handleSubmit} method="post" className="mb-5">
                        <div className="row mb-3">
                            <div className="col-xl-1">
                                <Input auto label="Numéro" defaultValue={student?.id} />
                            </div>
                            <div className="col-xl-5">
                                <Input label="Nom" name="firstname" defaultValue={student?.firstname} />
                            </div>
                            <div className="col-xl-6">
                                <Input
                                    label="Prénoms"
                                    name="lastname"
                                    defaultValue={student?.lastname}
                                    required={false}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-xl-3">
                                <Select
                                    label="Sexe"
                                    defaultOption={student?.gender}
                                    name="gender"
                                    options={gender}
                                />
                            </div>
                            <div className="col-xl-3">
                                <Input
                                    defaultValue={student?.birth_date}
                                    type="date"
                                    label="Date de naissance"
                                    name="birth_date"
                                />
                            </div>
                            <div className="col-xl-6">
                                <Input
                                    defaultValue={student?.birth_place}
                                    label="Lieu de naissance"
                                    name="birth_place"
                                    required={false}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-xl-12">
                                <Input
                                    defaultValue={student?.parents}
                                    required={false}
                                    label="Parents"
                                    name="father"
                                />
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-xl-6">
                                <Select
                                    label="Etablissement"
                                    options={ScDatas}
                                    config={{ optionKey: 'id', valueKey: 'name' }}
                                    name="school"
                                    defaultOption={student?.schools?.at(0)?.id}
                                />
                            </div>
                            <div className="col-xl-3">
                                <Select
                                    label="Classe"
                                    options={ClDatas}
                                    config={{ optionKey: 'id', valueKey: 'name' }}
                                    name="classes"
                                    defaultOption={student?.classes?.at(0)?.id}
                                />
                            </div>
                            <div className="col-xl-3">
                                <Select
                                    name="scholar_year"
                                    options={scholar_years()}
                                    label="Année scolaire"
                                    defaultOption={student?.classes?.at(0)?.pivot?.scholar_year}
                                />
                            </div>
                        </div>

                        <Button
                            loading={SRequestState.updating}
                            icon="save"
                            type="submit"
                            mode="primary"
                        >
                            Enregistrer
                        </Button>
                    </form>
                ) : (
                    <Spinner className="text-center" />
                )}
            </Block>
        </>
    )
}
