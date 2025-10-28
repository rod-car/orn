import { config } from "@base/config";
import { toast as reactToast, type ToastOptions, type ToastContent, type Id } from "react-toastify";

export function toast<T>(content: ToastContent<T>, options: ToastOptions<T>): Id {
    return reactToast(content, {position: config.toastPosition, ...options});
}