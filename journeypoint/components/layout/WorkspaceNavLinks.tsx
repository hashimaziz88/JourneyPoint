"use client";

import React from "react";
import { useWorkspaceShellStyles } from "@/layouts/style/workspaceShell";
import type { IWorkspaceNavLinksProps } from "@/types/layout/navigation";

/**
 * Renders the horizontal navigation link row for the workspace top-nav shell.
 */
const WorkspaceNavLinks: React.FC<IWorkspaceNavLinksProps> = ({
  navigationItems,
  onNavigate,
  selectedMenuKey,
}) => {
  const { styles } = useWorkspaceShellStyles();

  return (
    <>
      {navigationItems.map((item) => {
        const isActive = selectedMenuKey === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.href)}
            className={`${styles.navLink}${isActive ? ` ${styles.navLinkActive}` : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </button>
        );
      })}
    </>
  );
};

export default WorkspaceNavLinks;
