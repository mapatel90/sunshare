'use client'
import React from 'react'
import Checkbox from './Checkbox';
import { FiMoreVertical } from 'react-icons/fi';
import Link from 'next/link';

const Dropdown = ({
    triggerPosition,
    triggerClass = "avatar-sm",
    triggerIcon,
    triggerText,
    dropdownItems = [],
    dropdownPosition = "dropdown-menu-end",
    dropdownAutoClose,
    dropdownParentStyle,
    dataBsToggle = "modal",
    tooltipTitle,
    dropdownMenuStyle,
    iconStrokeWidth = 1.7,
    isItemIcon = true,
    isAvatar = true,
    onClick,
    active,
    id
}) => {

    return (
        <>
            <div className={`filter-dropdown ${dropdownParentStyle}`}>
                {/* Dropdown Trigger */}
                {
                    tooltipTitle ?
                        <span className="d-flex c-pounter" data-bs-toggle="dropdown" data-bs-offset={triggerPosition} data-bs-auto-close={dropdownAutoClose}>
                            {
                                isAvatar ?
                                    <div className={`avatar-text ${triggerClass}`} data-toggle="tooltip" data-bs-trigger="hover" data-title={tooltipTitle} >
                                        {triggerIcon || <FiMoreVertical />} {triggerText}
                                    </div>
                                    :
                                    <div className={`${triggerClass}`} data-toggle="tooltip" data-bs-trigger="hover" data-title={tooltipTitle}>
                                        {triggerIcon || <FiMoreVertical />} {triggerText}
                                    </div>
                            }
                        </span>
                        :
                        isAvatar ?
                            <Link href="#" className={`avatar-text ${triggerClass}`} data-bs-toggle="dropdown" data-bs-offset={triggerPosition} data-bs-auto-close={dropdownAutoClose} >
                                {triggerIcon || <FiMoreVertical />} {triggerText}
                            </Link>
                            :
                            <Link href="#" className={`${triggerClass}`} data-bs-toggle="dropdown" data-bs-offset={triggerPosition} data-bs-auto-close={dropdownAutoClose} >
                                {triggerIcon || <FiMoreVertical />} {triggerText}
                            </Link>
                }


                {/* Dropdown Menu */}
                <ul className={`dropdown-menu ${dropdownMenuStyle} ${dropdownPosition}`}>
                    {dropdownItems.map((item, index) => {
                        if (item.type === "divider") {
                            return <li className="dropdown-divider" key={index}></li>;
                        }
                        return (
                            <li key={index} className={`${item.checkbox ? "dropdown-item" : ""}`}>
                                {
                                    item.checkbox ?
                                        <Checkbox checked={item.checked} id={item.id} name={item.label} className={""} />
                                        :

                                        // If item has an onClick handler, render a clickable anchor and call it (prevent default navigation)
                                        (item.onClick ? (
                                            <a href="#" className={`${active === item.label ? "active" : ""} dropdown-item`} 
                                               onClick={(e) => { e.preventDefault(); item.onClick(); onClick && onClick(item.label, id); }}
                                               data-bs-toggle={item.modalTarget ? dataBsToggle : undefined} data-bs-target={item.modalTarget}
                                            >
                                                {
                                                    isItemIcon ?
                                                        item.icon && React.cloneElement(item.icon, { className: "me-3", size: 16, strokeWidth: iconStrokeWidth })
                                                        :
                                                        <span className={`wd-7 ht-7 rounded-circle me-3 ${item.color}`}></span>
                                                }
                                                <span>{item.label}</span>
                                            </a>
                                        ) : (
                                            <Link href={item.link || "#"} target={item.link ? '_blank' : undefined} className={`${active === item.label ? "active" : ""} dropdown-item`}
                                                data-bs-toggle={item.link || dataBsToggle} data-bs-target={item.modalTarget} onClick={() => onClick && onClick(item.label, id)}
                                            >
                                                {
                                                    isItemIcon ?
                                                        item.icon && React.cloneElement(item.icon, { className: "me-3", size: 16, strokeWidth: iconStrokeWidth })
                                                        :
                                                        <span className={`wd-7 ht-7 rounded-circle me-3 ${item.color}`}></span>
                                                }
                                                <span>{item.label}</span>
                                            </Link>
                                        ))
                                }
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    )
}

export default Dropdown