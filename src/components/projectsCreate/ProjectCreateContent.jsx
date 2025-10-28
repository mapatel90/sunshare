'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import TabProjectType from './TabProjectType'

const TabProjectDetails = dynamic(() => import('./TabProjectDetails'), { ssr: false })

// Only keep the two tabs
const steps = [
    { name: "Project Basic", required: true }
];

const ProjectCreateContent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(false);

    const [formData, setFormData] = useState({
        projectType: "",
        projectManage: "",
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
                    {/* Tabs */}
                    <div className="steps clearfix">
                        <ul role="tablist">
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
                    <div className="content clearfix">
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
