import { useOutlet } from "react-router";

export function useNotFoundRoute() {
    const outlet = useOutlet();
    const props = outlet?.props.children.props;

    const notFound: boolean = props?.children === null ? true : false;
    const path: string | undefined = props?.match.pathname;

    return {
        notFound,
        path
    }
}