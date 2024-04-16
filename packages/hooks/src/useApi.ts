import { AxiosError } from "axios";
import axios from "./axios";
import { useState } from "react"

type APIProps = {
    url: string;
    key?: string;
    baseUrl?: string;
    token?: string;
};

type APIError = {
    message: string;
    status: number;
};

type RequestState = {
    loading?: boolean;
    creating?: boolean;
    updating?: boolean;
    deleting?: boolean;
}

/**
 * Description placeholder
 *
 * @export
 * @template T Type de l'entite a obtenir
 * @param {string} param.baseUrl Url de base de l'API
 * @param {string} param.url Url de la ressources en enlevant la base
 * @param {string} param.key Cle contenant le data retourne par le serveur
 */
export function useApi<T>({ baseUrl = '', url, key = undefined, token = '' }: APIProps) {
    axios.defaults.baseURL = baseUrl

    const [data, setData] = useState<T | null>(null);
    const [datas, setDatas] = useState<T[]>([]);
    const [error, setError] = useState<APIError | null>(null);
    const [success, setSuccess] = useState(false);
    const [RequestState, setRequestState] = useState<RequestState>({
        loading: false,
        creating: false,
        deleting: false,
        updating: false
    })

    type PostResponse = { ok: boolean, data: T | null, message: string, status?: number }

    const resetError = () => {
        setError(null)
    }

    const resetSuccess = () => {
        setError(null)
    }

    const resetRequestState = () => {
        setRequestState({
            loading: false,
            creating: false,
            deleting: false,
            updating: false
        });
    }

    const reset = (datas?: boolean) => {
        resetRequestState();
        resetError();
        resetSuccess();
        if (datas) setDatas([]);
    }


    /**
     * 
     * @param params 
     * @returns 
     */
    const buildQuery = (params: Record<string, string | number | boolean> | undefined): string | undefined => {

        if (!params || JSON.stringify(params) === '{}') return undefined;

        const queryParams: string[] = [];
        Object.keys(params).map(param => {
            queryParams.push(`${param}=${params[param]}`);
        });

        return "?" + queryParams.join("&").toString();
    }


    /**
     * Recuperer une liste des donnees
     * 
     * @param {Record<string, any>} params
     */
    const get = async (params?: Record<string, string | number | boolean>, addUrl?: string) => {
        reset(true);
        setRequestState({ loading: true });

        let requestUri: string = url
        let datas: T[] = []
        const query = buildQuery(params);

        try {
            if (addUrl) requestUri += addUrl
            if (query) requestUri += query;
            let response: { data: T[], status: number, statusText: string }

            const headers = {
                "Authorization": `Bearer ${token}`
            }

            if (params?.prefix === false && addUrl !== undefined) response = await axios.get(addUrl, {
                baseURL: baseUrl.replace(params.replace, ''),
                headers: headers
            });
            else response = await axios.get(requestUri, {
                headers: headers
            })

            if (response.status === 200) datas = key ? response.data[key] : response.data;
            else setError({
                message: response.statusText,
                status: response.status
            });
        }
        catch (e) {
            setError(e as APIError)
        }

        setDatas(datas);
        setRequestState({ loading: false });
        return datas
    }


    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */
    const find = async (id: string | number, params?: Record<string, string | number>): Promise<T | null> => {
        reset();
        setRequestState({ loading: true });
        let data: T | null = null

        const query = buildQuery(params);

        try {
            let newUrl = url + '/' + id
            if (query) newUrl += query;

            const response = await axios.get(newUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 200) data = response.data as T
            else {
                setError({
                    message: response.statusText,
                    status: response.status
                });
            }
        }
        catch (e) {
            setError(e as APIError)
        }

        setData(data)
        setRequestState({ loading: false });
        return data
    }

    const findOld = async (id: string | number, params?: Record<string, string | number>) => {
        reset();
        setRequestState({ loading: true });

        const query = buildQuery(params);

        try {
            let newUrl = url + '/' + id
            if (query) newUrl += query;

            const response = await axios.get(newUrl);

            if (response.status === 200) {
                const d = response.data as T
                setData(d);
            }
            else setError({
                message: response.statusText,
                status: response.status
            });
        }
        catch (e) {
            setError(e as APIError)
        }

        setRequestState({ loading: false });
    }

    /**
     * Enregistrer un nouveau enregistrement dans la base de données
     * @param {string} data
     * @async
     */
    const post = async (
        data: Partial<T>,
        addUrl: string | undefined = undefined,
        params?: Record<string, string | number>
    ): Promise<PostResponse> => {
        reset(false);
        setRequestState({ creating: true });

        let res: PostResponse = { ok: false, data: null, message: '', status: undefined }

        try {
            if (addUrl) url = url + addUrl

            const response = await axios.post(url, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/ld+json"
                },
                params: params
            });

            if (response.status >= 200 || response.status < 300) {
                setSuccess(true);
                res = { ok: true, status: response.status, message: response.statusText, data: response.data }
                setData(response.data);
            } else {
                setError({
                    message: response.statusText,
                    status: response.status
                });
                res = { ok: false, status: response.status, message: response.statusText, data: response.data }
            }
        }
        catch (e) {
            const error = e as AxiosError
            setError(error.response as unknown as APIError);
            res = error
            // res = { ok: false, status: error?.response?.status, message: error.message, data: null }
        }

        setRequestState({ creating: false });
        return res
    }


    /**
     * Faire une mise a jour complete d'un enregistrement dans la base de donnees
     * 
     * @param {string | number} id Identifiant de l'enregistrement a modifier
     * @param {Omit<T, "id">} data Les nouvelles valeurs
     */
    const put = async (id: string | number, data: Omit<T, "id">): Promise<PostResponse> => {
        reset();
        setRequestState({ updating: true });

        try {
            const response = await axios.put(getUri(id), data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/ld+json"
                }
            });

            if (response.status === 200) {
                setSuccess(true);
                setData(response.data);
            } else {
                setError({
                    message: response.statusText,
                    status: response.status
                });
            }
        }
        catch (e) {
            const error = e as AxiosError
            setError(error.response as unknown as APIError);
            res = error
        }

        setRequestState({ updating: false });
        return res
    }


    /**
     * Permet de faire un remplacement partiel d'un enregistrement
     * 
     * @param {string | number} id Identifiant de l'enregistrement a modifier
     * @param {Partial<Omit<T, "id">>} data Les nouvelles valeurs
     */
    const patch = async (id: string | number, data: Partial<Omit<T, "id">>, params?: Record<string, string | number>): Promise<PostResponse> => {
        reset();
        setRequestState({ updating: true });

        let res: PostResponse = { ok: false, data: null, message: '', status: undefined }

        try {
            const response = await axios.patch(getUri(id), data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/merge-patch+json"
                },
                params: params
            });

            if (response.status === 200) {
                setSuccess(true);
                setData(response.data);
                res = { ok: response.status === 200, status: response.status, message: response.statusText, data: response.data }
            } else {
                setError({
                    message: response.statusText,
                    status: response.status
                });
                res = { ok: false, status: response.status, message: response.statusText, data: response.data }
            }
        }
        catch (e) {
            /* const error = e as APIError
            setError(error);
            res = { ok: false, status: error.status, message: error.message, data: null } */
            const error = e as AxiosError
            setError(error.response as unknown as APIError);
            res = error
        }

        setRequestState({ updating: false });
        return res
    }

    /**
     * Envoyer une requête de type delete
     * @param id 
     * @returns 
     */
    const destroy = async (id: string | number, params?: Record<string, string | number>): Promise<{ ok: boolean }> => {
        reset();
        setRequestState({ deleting: true });
        let res: { ok: boolean } = { ok: false }

        try {
            const response = await axios.delete(getUri(id), {
                params: params,
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.status === 204) {
                setSuccess(true);
                setData(null);
                res = { ok: true }
            } else {
                setError({
                    message: response.statusText,
                    status: response.status
                });
                res = { ok: false }
            }
        }
        catch (e) {
            setError(e as APIError);
            res = { ok: false }
        }

        setRequestState({ deleting: false });
        return res
    }

    /**
     * Recuperer l'URI
     * 
     * @param {string | number} id
     * @returns
     */
    const getUri = (id: string | number): string => url + '/' + id;

    return {
        resetError,
        datas, data,
        RequestState,
        error, success,
        Client: {
            get, post, put, find, findOld, patch, destroy
        }
    }

}