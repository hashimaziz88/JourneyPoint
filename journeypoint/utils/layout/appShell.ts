import type { IWorkspaceNavigationItem } from "@/constants/global/navigation";

/**
 * Resolves the active navigation key for the current route.
 */
export const getSelectedMenuKey = (
    pathname: string,
    navigationItems: IWorkspaceNavigationItem[],
): string => {
    const sortedItems = [...navigationItems].sort(
        (left, right) => right.href.length - left.href.length,
    );
    const selectedItem = sortedItems.find(
        (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    );

    return selectedItem?.key ?? navigationItems[0]?.key ?? "workspace";
};
