import React from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import ProjectTable from '@/components/projectsList/ProjectTable'
import ProjectsListHeader from "@/components/projectsList/ProjectsListHeader";

const page = () => {
  return (
    <div className="content-area" data-scrollbar-target="#psScrollbarInit">
      {/* <PageHeader>
        <ProjectsListHeader />
      </PageHeader> */}
      <div className="content-area-body">
        <div className="card mb-0">
          <div className="card-body">
            <div className='main-content'>
                <div className='row'>
                    <ProjectTable />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
