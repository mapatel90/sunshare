import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectViewContent from '@/components/projectsCreate/ProjectViewContent'

const page = ({ params }) => {
  const { id } = params
  return (
    <>
      <PageHeader>
        {/* You can add a header component later if needed */}
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <ProjectViewContent projectId={id} />
        </div>
      </div>
    </>
  )
}

export default page

