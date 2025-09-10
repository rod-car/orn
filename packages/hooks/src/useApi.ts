import { AxiosError, AxiosRequestConfig } from "axios";
import axios from "./axios";
import { useCallback, useEffect, useRef, useState } from "react"
import { useAuthStore } from "../src/store/useAuthStore.ts";
import { useConfigStore } from "../src/store/useConfigStore.ts";

export type RequestParams = Record<string, string | number | boolean>

type APIProps = {
    url: string;
    key?: string;
    baseUrl?: string;
    token?: string | null;
};

type APIError = {
    message: string;
    status: number;
    data: {
        errors: Record<string, string[]>
    }
};

type RequestState = {
    loading?: boolean;
    creating?: boolean;
    updating?: boolean;
    deleting?: boolean;
}

const defaultRequestState = {
    loading: true,
    creating: false,
    deleting: false,
    updating: false
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
export function useApi<T>({ baseUrl, url, key = undefined }: APIProps) {
    const { token } = useAuthStore();
    const { baseUrl: endpointBase } = useConfigStore()
    axios.defaults.baseURL = baseUrl === undefined ? endpointBase : baseUrl

    const [data, setData] = useState<T | null>(null);
    const [datas, setDatas] = useState<T[]>([]);
    const [error, setError] = useState<APIError | null>(null);
    const [success, setSuccess] = useState(false);
    const [RequestState, setRequestState] = useState<RequestState>(defaultRequestState)

    type PostResponse = { ok: boolean, data: T | null, message: string, status?: number }

    const resetError = useCallback((key?: string) => {
        if (key === undefined) setError(null)
    }, [])

    const resetSuccess = useCallback(() => {
        setError(null)
    }, [])

    const resetRequestState = useCallback(() => {
        setRequestState(defaultRequestState);
    }, [])

    const reset = useCallback((datas?: boolean) => {
        resetRequestState();
        resetError();
        resetSuccess();
        if (datas === true) setDatas([]);
    }, [])

    /**
     * 
     * @param params 
     * @returns 
     */
    const buildQuery = useCallback((params: RequestParams | undefined): string | undefined => {

        if (!params || JSON.stringify(params) === '{}') return undefined;

        const queryParams: string[] = [];
        Object.keys(params).map(param => {
            queryParams.push(`${param}=${params[param]}`);
        });

        return "?" + queryParams.join("&").toString();
    }, [])


    // Stocker l'AbortController pour annuler les requêtes en cours
    const abortControllerRef = useRef<AbortController | null>(null);

    // Fonction pour annuler toutes les requêtes en cours
    const cancelPendingRequests = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
    };

    useEffect(() => {
        return () => cancelPendingRequests();
    }, []);

    /**
     * Recuperer une liste des donnees
     * 
     * @param {Record<string, any>} params
     */
    const get = useCallback(async (params?: RequestParams, addUrl?: string) => {
        reset(true);
        setRequestState({ loading: true });

        let requestUri: string = url
        let datas: T[] = []
        const query = buildQuery(params);

        try {
            if (addUrl) requestUri += addUrl
            if (query) requestUri += query;
            let response: { data: T[], status: number, statusText: string, ok: boolean }

            const headers = {"Authorization": `Bearer ${token}`}

            if (params?.prefix === false && addUrl !== undefined) response = await axios.get(addUrl, {
                baseURL: (baseUrl as string).replace(params.replace as string, ''),
                headers: headers,
                signal: abortControllerRef.current?.signal
            });
            else response = await axios.get(requestUri, {
                headers: headers,
                signal: abortControllerRef.current?.signal
            })

            response.ok = response.status === 200
            if (response.status === 200) datas = key && key in response.data ? response.data[key] : response.data;
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
    }, [])


    /**
     * 
     * @param id 
     * @param params 
     * @returns 
     */
    const find = useCallback(async (id: string | number, params?: RequestParams): Promise<T | null> => {
        reset(false);
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
    }, []);

    /**
     * Enregistrer un nouveau enregistrement dans la base de données
     * @param {string} data
     * @async
     */
    const post = useCallback(async (data: Partial<T>, addUrl: string | undefined = undefined, params?: RequestParams, config?: AxiosRequestConfig): Promise<PostResponse> => {
        reset(false);
        setRequestState({ creating: true });

        let res: PostResponse = { ok: false, data: null, message: '', status: undefined }
        let exactUrl = url

        try {
            if (addUrl) exactUrl = exactUrl + addUrl

            const response = await axios.post(exactUrl, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/ld+json",
                    ...config?.headers
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
    }, [])


    /**
     * Faire une mise a jour complete d'un enregistrement dans la base de donnees
     * 
     * @param {string | number} id Identifiant de l'enregistrement a modifier
     * @param {Omit<T, "id">} data Les nouvelles valeurs
     */
    const put = useCallback(async (id: string | number, data: Omit<T, "id">, config?: AxiosRequestConfig): Promise<PostResponse> => {
        reset();
        let res: PostResponse = { ok: false, data: null, message: '', status: undefined }
        setRequestState({ updating: true });

        try {
            const response = await axios.put(getUri(id), data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/ld+json",
                    ...config?.headers
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
    }, [])


    /**
     * Permet de faire un remplacement partiel d'un enregistrement
     * 
     * @param {string | number} id Identifiant de l'enregistrement a modifier
     * @param {Partial<Omit<T, "id">>} data Les nouvelles valeurs
     */
    const patch = useCallback(async (id: string | number, data: Partial<Omit<T, "id">>, params?: Record<string, string | number | boolean>, config?: AxiosRequestConfig): Promise<PostResponse> => {
        reset();
        setRequestState({ updating: true });

        let res: PostResponse = { ok: false, data: null, message: '', status: undefined }

        try {
            const response = await axios.patch(getUri(id), data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/merge-patch+json",
                    ...config?.headers
                },
                params: params
            });

            if (response.status >= 200 && response.status < 300) {
                setSuccess(true);
                setData(response.data);
                res = { ok: (response.status >= 200 && response.status < 300), status: response.status, message: response.statusText, data: response.data }
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
    }, [])

    /**
     * Envoyer une requête de type delete
     * @param id 
     * @returns 
     */
    const destroy = useCallback(async (id: string | number, params?: Record<string, string | number | boolean>): Promise<{ ok: boolean }> => {
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
    }, [])

    /**
     * Recuperer l'URI
     * 
     * @param {string | number} id
     * @returns
     */
    const getUri = useCallback((id: string | number): string => url + '/' + id, []);

    return {
        resetError,
        datas, setDatas, data,
        RequestState,
        error, success,
        Client: { get, post, put, find, patch, destroy }
    }
}