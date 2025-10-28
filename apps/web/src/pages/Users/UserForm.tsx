/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, FormEvent } from 'react';
import ReactSelect from 'react-select';
import { useApi } from 'hooks';
import { toast } from '@base/ui';
import { Input, PrimaryButton, Select } from 'ui';
import { config } from '@base/config';

type Props = {
    editUser?: User | null;
};

export function UserForm({ editUser = null }: Props) {
    const { Client, RequestState } = useApi({
        url: "/users"
    });

    const { Client: SchoolClient, RequestState: SchoolRequestState, datas: schools } = useApi<School>({
        url: '/schools',
        key: 'data'
    })

    const { Client: RoleClient, datas: roles } = useApi<any>({
        url: '/roles',
        key: 'items'
    })

    const { Client: PermissionClient, datas: permissions } = useApi<any>({
        url: '/permissions',
        key: 'items'
    })

    const defaultUser = {
        name: '',
        email: '',
        roles_id: [],
        specific_permissions_id: [],
        occupation: '',
        username: '',
        school_id: 0,
        password: '',
        password_confirmation: ''
    }

    const [user, setUser] = useState<Partial<User>>(defaultUser);
    const [showPassword] = useState(false)
    const defaultErrors = {
        username: [''],
        password: [''],
        name: [''],
        occupation: [''],
        email: [''],
        password_confirmation: [''],
        role: [''],
        school_id: ['']
    }

    const [errors, setErrors] = useState<typeof defaultErrors>(defaultErrors)

    useEffect(() => {
        if (editUser) {
            setUser({
                ...editUser,
                password: '',
                password_confirmation: ''
            });
        }
    }, []);

    useEffect(() => {
        SchoolClient.get();
        RoleClient.get()
        PermissionClient.get()
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        if (e.target.value.length > 0 && errors) setErrors({ ...errors, [e.target.name]: [] })
    };

    const handleSelectChange = (field: 'roles_id' | 'specific_permissions_id', values: any) => {
        setUser({ ...user, [field]: values.map((v: any) => v.value) });
    };


    /**
     * Create or update user
     * @returns 
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (user.school_id === 0) setUser({...user, school_id: undefined})

        const response = editUser ? await Client.patch(editUser.id, user) : await Client.post(user)
        const message = editUser ? "Modifie avec success" : "Enregistré avec success"

        if (response === undefined) {
            toast("Impossible de contacter le serveur. Verifier votre connexion internet.", {
                type: 'error'
            })
            return
        }

        if (response.ok) {
            toast(message, {
                type: 'success'
            })
            if (!editUser) setUser(defaultUser)
        } else {
            setErrors(response.data.errors)
            toast(response.message, {
                type: 'error'
            })
        }
    };

    const mapToOptions = (items: {id: number, name: string, description?: string}[], labelKey: string = "name") => {
        return items.map((item) => ({ label: item[labelKey], value: item.id }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className={`email mb-3 col-6`}>
                    <Input
                        name='name'
                        value={user.name}
                        onChange={handleChange}
                        required={false}
                        label="Nom"
                        placeholder="Nom complet ou nom d'entreprise"
                        className="signup-name"
                        error={errors?.name}
                    />
                </div>

                <div className={`email mb-3 col-6`}>
                    <Input
                        name='occupation'
                        value={user.occupation}
                        onChange={handleChange}
                        required={false}
                        label="Occupation"
                        placeholder="Ex: Responsable nutrition"
                        className="signup-name"
                        error={errors?.occupation}
                    />
                </div>

                <div className="email mb-3 col-12">
                    <Select
                        name='school_id'
                        value={user.school_id}
                        onChange={handleChange}
                        error={errors?.school_id}
                        label="Etablissement de rattachement"
                        placeholder="Selectionner"
                        defaultOption={undefined}
                        loading={SchoolRequestState.loading}
                        options={schools}
                        config={{ optionKey: "id", valueKey: "name" }}
                        required={false}
                        controlled
                    />
                </div>
            </div>

            <div className="row">
                <div className={`email mb-3 col-6`}>
                    <Input
                        name='username'
                        value={user.username}
                        onChange={handleChange}
                        required={false}
                        label="Nom d'utilisateur"
                        placeholder="Nom d'utilisateur"
                        error={errors?.username}
                    />
                </div>

                <div className={`email mb-3 col-6`}>
                    <Input
                        name='email'
                        value={user.email}
                        onChange={handleChange}
                        required={false}
                        label="Adresse email"
                        placeholder="Adresse email"
                        error={errors?.email}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-6 mb-3">
                    <label className='form-label'>Rôles</label>
                    <ReactSelect
                        isMulti
                        options={mapToOptions(roles)}
                        value={mapToOptions(roles).filter((r) => user.roles_id && user.roles_id.includes(r.value))}
                        onChange={(v) => handleSelectChange('roles_id', v)}
                        classNamePrefix="select"
                    />
                </div>

                <div className="col-6 mb-3">
                    <label className='form-label'>Permissions specifiques</label>
                    <ReactSelect
                        isMulti
                        options={mapToOptions(permissions, "description")}
                        value={mapToOptions(permissions, "description").filter((p) => user.specific_permissions_id && user.specific_permissions_id.includes(p.value))}
                        onChange={(v) => handleSelectChange('specific_permissions_id', v)}
                        classNamePrefix="select"
                    />
                </div>
            </div>

            <div className="row">
                <div className="password mb-3 col-6">
                    <Input
                        value={user.password}
                        onChange={({ target }): void => {
                            setUser({ ...user, password: target.value })
                            if (target.value !== user.password_confirmation && target.value !== "" && errors) setErrors({ ...errors, password_confirmation: ["Mot de passe ne correspond pas"] })
                            else if (target.value.length > 0 && errors) setErrors({ ...errors, password: [], password_confirmation: [] })
                        }}
                        required={false}
                        type={`${showPassword ? 'text' : 'password'}`}
                        label="Créer un mot de passe (Laisser vide pour ne pas changer)"
                        placeholder="Créer un mot de passe"
                        error={errors?.password}
                        className="signup-password"
                    />
                </div>

                <div className="password mb-3 col-6">
                    <Input
                        value={user.password_confirmation}
                        onChange={({ target }) => {
                            setUser({ ...user, password_confirmation: target.value })
                            if (target.value !== user.password && target.value !== "" && errors) setErrors({ ...errors, password_confirmation: ["Mot de passe ne correspond pas"] })
                            else if (target.value.length > 0 && errors) setErrors({ ...errors, password_confirmation: [] })
                        }}
                        required={false}
                        type={`${showPassword ? 'text' : 'password'}`}
                        label="Confirmer le mot de passe"
                        placeholder="Confirmer le mot de passe"
                        error={errors?.password_confirmation}
                        className="signup-password"
                    />
                </div>
            </div>

            <div className="d-flex justify-content-end align-items-center">
                <PrimaryButton permission="user.create" icon='save' loading={RequestState.creating || RequestState.updating} type="submit">Enregstrer</PrimaryButton>
            </div>
        </form>
    );
}
