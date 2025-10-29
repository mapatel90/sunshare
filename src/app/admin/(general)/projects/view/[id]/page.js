import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectViewContent from '@/components/projectsCreate/ProjectViewContent'
import DynamicTitle from '@/components/common/DynamicTitle'

export const metadata = { title: 'Sunshare | View Project' }

const page = ({ params }) => {
  const { id } = params
  return (
    <>
      <DynamicTitle titleKey="projects.viewproject" />
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

