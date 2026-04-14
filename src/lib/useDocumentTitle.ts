import { useEffect } from "react";

const BASE_TITLE = "African Strikers FC";

export function useDocumentTitle(pageTitle?: string) {
    useEffect(() => {
        document.title = pageTitle
            ? `${pageTitle} | ${BASE_TITLE}`
            : `${BASE_TITLE} | Where Unity Comes First`;
    }, [pageTitle]);
}
