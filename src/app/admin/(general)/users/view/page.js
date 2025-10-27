import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import UsersViewHeader from '@/components/users/UsersViewHeader'
import UsersViewDetails from '@/components/users/UsersViewDetails'

const page = () => {
  return (
    <>
      <PageHeader>
        <UsersViewHeader />
      </PageHeader>
      <div className='main-content container-lg'>
        <div className='row'>
          <UsersViewDetails />
        </div>
      </div>
    </>
  )
}

export default page