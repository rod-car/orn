/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApi } from 'hooks';
import { toast } from '@base/ui';
import { config } from '@base/config';
import { Input, PrimaryButton, Textarea } from 'ui';
import { useState, useEffect, FormEvent } from 'react';

type Permission = {
    id?: number;
    name: string;
    description: string;
};

type Props = {
    editPermission?: Permission | null;
};

export function PermissionForm({ editPermission = null }: Props) {
    const { Client: PermissionClient, RequestState: PermissionRequestState } = useApi<Permission>({
        url: '/permissions'
    });

    const defaultPermission: Permission = {
        name: '',
        description: ''
    };

    const [permission, setPermission] = useState<Permission>(defaultPermission);

    const defaultErrors = {
        name: [''],
        description: ['']
    };

    const [errors, setErrors] = useState<typeof defaultErrors>(defaultErrors);

    useEffect(() => {
        if (editPermission) {
            setPermission({ ...editPermission });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setPermission({ ...permission, [e.target.name]: e.target.value });
        if (e.target.value.length > 0 && errors) {
            setErrors({ ...errors, [e.target.name]: [] });
        }
    };

    const canSubmit = permission.name.trim().length > 0 && permission.description.trim().length > 0;

    /**
     * Create or update permission
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = editPermission ? await PermissionClient.patch(editPermission.id as number, permission) : await PermissionClient.post(permission);
        const message = editPermission ? "Modifié avec succès" : "Enregistré avec succès";

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
            if (!editPermission) setPermission(defaultPermission);
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
                        value={permission.name}
                        onChange={handleChange}
                        required
                        label="Nom"
                        placeholder="Nom du permission"
                        error={errors?.name}
                    />
                </div>

                <div className="col-xl-12 mb-3">
                    <Textarea
                        name="description"
                        value={permission.description}
                        onChange={handleChange}
                        required
                        label="Description"
                        error={errors?.description}
                    />
                </div>

                <div className="d-flex justify-content-end">
                    <PrimaryButton
                        permission="permission.create"
                        disabled={!canSubmit}
                        loading={PermissionRequestState.creating || PermissionRequestState.updating}
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