'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import TabProjectType from './TabProjectType'
import { useLanguage } from '@/contexts/LanguageContext'

const TabProjectDetails = dynamic(() => import('./TabProjectDetails'), { ssr: false })

const ProjectCreateContent = () => {
    const { lang } = useLanguage()
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(false);

    const steps = [
        { name: lang('projects.projectBasic', 'Project Basic'), required: true }
    ];

    const [formData, setFormData] = useState({
        projectType: "",
        projectManage: "",
        project_name: '',
        project_type: '',
        offtaker: '',
        address1: '',
        address2: '',
        countryId: '',
        stateId: '',
        cityId: '',
        zipcode: '',
        status: 'active'
    });

    const validateFields = () => {
        const { projectManage, projectType } = formData;

        if (steps[currentStep].required) {
            if (currentStep === 0 && (projectManage === "" || projectType === "")) {
                setError(true);
                return false;
            }
        }

        return true;
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (validateFields()) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handlePrev = (e) => {
        e.preventDefault();
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleTabClick = (e, index) => {
        e.preventDefault();
        if (validateFields()) {
            setCurrentStep(index);
        }
    };

    return (
        <div className="col-lg-12">
            <div className="card border-top-0">
                <div className="card-body p-0 wizard" id="project-create-steps">
                    {/* Compact nav tabs */}
                    <div className="steps clearfix">
                        <ul role="tablist" className="custom-steps" style={{ width: '20%' }}>
                            {steps.map((step, index) => (
                                <li
                                    key={index}
                                    className={`${currentStep === index ? "current" : ""} ${currentStep === index && error ? "error" : ""}`}
                                    onClick={(e) => handleTabClick(e, index)}
                                >
                                    <a href="#" className="d-block fw-bold">{step.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tab content */}
                    <div className="main-content">
                        {currentStep === 0 && (
                            <TabProjectType
                                setFormData={setFormData}
                                formData={formData}
                                error={error}
                                setError={setError}
                            />
                        )}
                        {currentStep === 1 && <TabProjectDetails />}
                    </div>

                    {/* Buttons */}
                    <div className="actions clearfix">
                        <ul>
                            <li
                                className={`${currentStep === 0 ? "disabled" : ""}`}
                                onClick={handlePrev}
                            >
                                <a href="#">Previous</a>
                            </li>
                            <li
                                className={`${currentStep === steps.length - 1 ? "disabled" : ""}`}
                                onClick={handleNext}
                            >
                                <a href="#">Next</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCreateContent;
