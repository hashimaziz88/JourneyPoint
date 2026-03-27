"use client";

import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Button, Drawer, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useStyles } from "@/layout/style/style";
import AppShellBrand from "./AppShellBrand";

/**
 * Defines the props required to render the mobile workspace navigation drawer.
 */
interface IMobileNavigationProps {
  menuItems: NonNullable<MenuProps["items"]>;
  onNavigate: (href: string) => void;
  routeMap: Record<string, string>;
  selectedMenuKey: string;
  subtitle: string;
}

/**
 * Renders the mobile-only navigation entry point and full-screen drawer.
 */
const MobileNavigation: React.FC<IMobileNavigationProps> = ({
  menuItems,
  onNavigate,
  routeMap,
  selectedMenuKey,
  subtitle,
}) => {
  const { styles } = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigationClick: MenuProps["onClick"] = ({ key }) => {
    const href = routeMap[String(key)];

    if (!href) {
      return;
    }

    setIsOpen(false);
    onNavigate(href);
  };

  return (
    <>
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setIsOpen(true)}
        className={styles.mobileMenuButton}
        aria-label="Open navigation menu"
      />

      <Drawer
        placement="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        closable
        size="100vw"
        rootClassName={styles.mobileDrawerRoot}
      >
        <div className={styles.mobileDrawerContent}>
          <AppShellBrand subtitle={subtitle} />

          <Menu
            mode="inline"
            selectedKeys={[selectedMenuKey]}
            items={menuItems}
            onClick={handleNavigationClick}
            className={styles.shellMenu}
          />
        </div>
      </Drawer>
    </>
  );
};

export default MobileNavigation;
