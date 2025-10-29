import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectCreateContent from '@/components/projectsCreate/ProjectCreateContent'
import ProjectCreateHeader from '@/components/projectsCreate/ProjectCreateHeader'
import DynamicTitle from '@/components/common/DynamicTitle'

export const metadata = { title: 'Sunshare | Create Project' }

const page = () => {
  return (
    <>
      <DynamicTitle titleKey="projects.createproject" />
      <PageHeader>
        <ProjectCreateHeader />
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <ProjectCreateContent />
        </div>
      </div>

    </>
  )
}

export default page