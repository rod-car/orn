/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApi } from 'hooks';
import { toast } from '@base/ui';
import { config } from '@base/config';
import { Input, PrimaryButton } from 'ui';
import { PrimaryLink } from '@base/components';
import { useState, useEffect, FormEvent } from 'react';

type Permission = {
    id: number;
    name: string;
    description: string;
    group?: string;
};

type Role = {
    id?: number;
    name: string;
    permissions: number[] | { id: number; name: string; }[];
};

type Props = {
    editRole?: Role | null;
};

export function RoleForm({ editRole = null }: Props) {
    const { Client, RequestState } = useApi({
        url: "/roles"
    });

    const { Client: PermissionClient, RequestState: PermissionRequestState, datas: permissions } = useApi<Permission>({
        url: '/permissions',
        key: 'items'
    });

    const defaultRole: Role = {
        name: '',
        permissions: []
    };

    const [role, setRole] = useState<Role>(defaultRole);

    const defaultErrors = {
        name: [''],
        permissions: ['']
    };

    const [errors, setErrors] = useState<typeof defaultErrors>(defaultErrors);

    useEffect(() => {
        if (editRole) {
            setRole({
                ...editRole,
                permissions: editRole.permissions.map(permission => typeof permission !== "number" ? permission.id : 0)
            });
        }
    }, []);

    useEffect(() => {
        const loadPermissions = async () => {
            await PermissionClient.get();
        };
        loadPermissions();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRole({ ...role, [e.target.name]: e.target.value });
        if (e.target.value.length > 0 && errors) {
            setErrors({ ...errors, [e.target.name]: [] });
        }
    };

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        const updatedPermissions = (checked
            ? [...role.permissions, permissionId]
            : role.permissions.filter(id => id !== permissionId)) as number[];

        setRole({ ...role, permissions: updatedPermissions });

        if (updatedPermissions.length > 0 && errors) {
            setErrors({ ...errors, permissions: [] });
        }
    };

    const getFormatedPermissions = (): Record<string, Permission[]> => {
        return permissions && permissions.reduce((acc, perm) => {
            const [category] = perm.name.split('.');
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(perm);
            return acc;
        }, {});
    };

    const canSubmit = role.name.trim().length > 0;

    /**
     * Create or update role
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = editRole ? await Client.patch(editRole.id, role) : await Client.post(role);
        const message = editRole ? "Modifié avec succès" : "Enregistré avec succès";

        if (response === undefined) {
            toast("Impossible de contacter le serveur. Vérifiez votre connexion internet.", {
                type: 'error'
            });
            return;
        }

        if (response.ok) {
            toast(message, {
                type: 'success'
            });
            if (!editRole) setRole(defaultRole);
        } else {
            toast(response.message, {
                type: 'error'
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-xl-12 mb-3">
                    <Input
                        name="name"
                        value={role.name}
                        onChange={handleChange}
                        required
                        label="Nom"
                        placeholder="Nom du rôle"
                        error={errors?.name}
                    />
                </div>

                {PermissionRequestState.loading ? (
                    <div className="col-xl-12 my-3 text-center">
                        Chargement des permissions en cours...
                    </div>
                ) : (
                    <div className="col-xl-12 my-3">
                        <h2 className="mb-2 text-center text-primary">Autorisations</h2>
                        <hr className="border-bottom" />

                        {Object.entries(getFormatedPermissions()).map(([category, permissions]) => (
                            <div key={category} className="mb-4">
                                <h5 className="mb-3 text-capitalize text-primary">{category}</h5>
                                <div className="row">
                                    {permissions.map((permissionItem) => (
                                        <div className="col-4 mb-3" key={permissionItem.id}>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`permission-${permissionItem.id}`}
                                                    checked={role.permissions.includes(permissionItem.id)}
                                                    onChange={(e) =>
                                                        handlePermissionChange(permissionItem.id, e.target.checked)
                                                    }
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`permission-${permissionItem.id}`}
                                                >
                                                    {permissionItem.description}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                )}

                <div className="d-flex justify-content-end">
                    <PrimaryButton
                        permission="role.create"
                        disabled={!canSubmit}
                        loading={RequestState.creating || RequestState.updating}
                        type="submit"
                        icon="save"
                    >
                        Enregistrer
                    </PrimaryButton>
                </div>
            </div>
        </form>
    );
}