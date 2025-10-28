/* eslint-disable react-hooks/exhaustive-deps */
import { useApi } from "hooks";
import { config } from "@base/config";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "@base/ui";
import { Block, Button, Input } from "ui";

interface Justificative {
    id?: number;
    name: string;
    file?: File;
}

export function JustificativeForm({ editedJustificative }: { editedJustificative?: Justificative }): ReactNode {
    const defaultJustificative: Justificative = {
        name: "",
    };
    const [justificative, setJustificative] = useState<Justificative>(defaultJustificative);
    const { Client, error, RequestState } = useApi<Justificative>({
        url: "/justificatives",
        key: "data",
    });

    useEffect(() => {
        if (editedJustificative) {
            setJustificative({
                id: editedJustificative.id,
                name: editedJustificative.name,
            });
        }
    }, [editedJustificative]);

    const fileRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        const headers = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        const response = editedJustificative
            ? await Client.post(
                  { ...justificative },
                  `/${justificative.id}`,
                  { _method: "PATCH" },
                  headers
              )
            : await Client.post({ ...justificative }, "", {}, headers);

        if (response.ok) {
            const message = editedJustificative ? "Mis à jour" : "Enregistré";
            toast(message, {
                closeButton: true,
                type: "success",
            });

            if (!editedJustificative) {
                setJustificative(defaultJustificative);
                if (fileRef.current) fileRef.current.value = "";
            }
        } else {
            toast("Erreur de soumission", {
                closeButton: true,
                type: "error",
            });
            setJustificative({ ...justificative, file: undefined });
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setJustificative({
            ...justificative,
            [target.name]: target.name === "file" && "files" in target ? target.files?.item(0) : target.value,
        });
        if (target.value.length > 0 && error?.data?.errors && error?.data?.errors[target.name]) {
            error.data.errors[target.name] = [];
        }
    };

    return (
        <Block>
            <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                <div className="row mb-3">
                    <div className="col-xl-12">
                        <Input
                            label="Nom du justificatif"
                            placeholder="Ex: Facture Juin 2024"
                            value={justificative.name}
                            error={error?.data?.errors?.name}
                            onChange={handleChange}
                            name="name"
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-xl-12">
                        <Input
                            label="Fichier (PDF, Image)"
                            type="file"
                            accept="application/pdf,image/jpeg,image/jpg,image/png"
                            error={error?.data?.errors?.file}
                            onChange={handleChange}
                            name="file"
                            required={!editedJustificative}
                            ref={fileRef}
                        />
                    </div>
                </div>

                <Button
                    permission="justificative.create"
                    loading={RequestState.creating || RequestState.updating}
                    icon="save"
                    type="submit"
                    mode="primary"
                >
                    Enregistrer
                </Button>
            </form>
        </Block>
    );
}