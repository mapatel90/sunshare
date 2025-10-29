"use client"

import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ChangePasswordAdminPage from '@/components/users/ChangePasswordAdminPage'
import ChangePasswordHeader from '@/components/users/ChangePasswordHeader'

const page = () => {
    return (
        <>
            <PageHeader>
            {/* <ChangePasswordHeader /> */}
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <ChangePasswordAdminPage />
                </div>
            </div>
        </>
    )
}

export default page
