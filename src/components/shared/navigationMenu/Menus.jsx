'use client'
import React, { Fragment, useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { menuList } from "@/utils/Data/menuList";
import getIcon from "@/utils/getIcon";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const Menus = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [openSubDropdown, setOpenSubDropdown] = useState(null);
    const [activeParent, setActiveParent] = useState("");
    const [activeChild, setActiveChild] = useState("");
    const pathName = usePathname();
    const { lang } = useLanguage();

    const handleMainMenu = (e, name) => {
        if (openDropdown === name) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(name);
        }
    };

    const handleDropdownMenu = (e, name) => {
        e.stopPropagation();
        if (openSubDropdown === name) {
            setOpenSubDropdown(null);
        } else {
            setOpenSubDropdown(name);
        }
    };

    useEffect(() => {
        if (pathName !== "/") {
            const x = pathName.split("/");
            // Check if path starts with /admin
            if (x[1] === "admin") {
                setActiveParent(x[2]);
                setActiveChild(x[3]);
                setOpenDropdown(x[2]);
                setOpenSubDropdown(x[3]);
            } else {
                setActiveParent(x[1]);
                setActiveChild(x[2]);
                setOpenDropdown(x[1]);
                setOpenSubDropdown(x[2]);
            }
        } else {
            setActiveParent("dashboards");
            setOpenDropdown("dashboards");
        }
    }, [pathName]);

    return (
        <>
            {menuList.map(({ dropdownMenu, id, name, path, icon }) => {
                return (
                    <li
                        key={id}
                        onClick={(e) => handleMainMenu(e, name.split(' ')[0])}
                        className={`nxl-item nxl-hasmenu ${activeParent === name.split(' ')[0] ? "active nxl-trigger" : ""}`}
                    >
                        <Link href={path} className="nxl-link text-capitalize">
                            <span className="nxl-micon"> {getIcon(icon)} </span>
                            <span className="nxl-mtext" style={{ paddingLeft: "2.5px" }}>
                                {lang(`menu.${name.toLowerCase()}`, name)}
                            </span>
                            {dropdownMenu ? (
                                <span className={`nxl-arrow fs-16 nxl-item ${pathName === path ? "active" : ""}`}>
                                    <FiChevronRight />
                                </span>
                            ) : null}
                        </Link>
                        <ul className={`nxl-submenu ${openDropdown === name.split(' ')[0] ? "nxl-menu-visible" : "nxl-menu-hidden"}`}>
                            {dropdownMenu && dropdownMenu.map(({ id, name, path, subdropdownMenu, target }) => {
                                const x = name;
                                return (
                                    <Fragment key={id}>
                                        {subdropdownMenu && subdropdownMenu.length ? (
                                            <li
                                                className={`nxl-item nxl-hasmenu ${activeChild === name ? "active" : ""}`}
                                                onClick={(e) => handleDropdownMenu(e, x)}
                                            >
                                                <Link href={path} className={`nxl-link text-capitalize`}>
                                                    <span className="nxl-mtext">{lang(`menu.${name.toLowerCase().replace(/\s+/g, '')}`, name)}</span>
                                                    <span className="nxl-arrow">
                                                        <i>
                                                            {" "}
                                                            <FiChevronRight />
                                                        </i>
                                                    </span>
                                                </Link>
                                                {subdropdownMenu && subdropdownMenu.map(({ id, name, path }) => {
                                                    return (
                                                        <ul
                                                            key={id}
                                                            className={`nxl-submenu ${openSubDropdown === x
                                                                ? "nxl-menu-visible"
                                                                : "nxl-menu-hidden "
                                                                }`}
                                                        >
                                                            <li
                                                                className={`nxl-item ${pathName === path ? "active" : ""
                                                                    }`}
                                                            >
                                                                <Link
                                                                    className="nxl-link text-capitalize"
                                                                    href={path}
                                                                >
                                                                    {lang(`menu.${name.toLowerCase().replace(/\s+/g, '')}`, name)}
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    );
                                                })}
                                            </li>
                                        ) : (
                                            <li className={`nxl-item ${pathName === path ? "active" : ""}`}>
                                                <Link className="nxl-link" href={path} target={target}>
                                                    {lang(`menu.${name.toLowerCase().replace(/\s+/g, '')}`, name)}
                                                </Link>
                                            </li>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </ul>
                    </li>
                );
            })}
        </>
    );
};

export default Menus;
