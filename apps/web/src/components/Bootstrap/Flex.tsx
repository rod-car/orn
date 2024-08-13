import { PropsWithChildren, ReactNode } from "react";

type FlexProps = PropsWithChildren & {
    justifyContent: "start" | "center" | "end" | "between";
    alignItems: "start" | "center" | "end" | "between";
    className?: string;
}

export function Flex({justifyContent, alignItems, children, ...props}: FlexProps): ReactNode {
    return <div className={`d-flex justify-content-${justifyContent} align-items-${alignItems} ${props.className}`}>
        {children}
    </div>
}