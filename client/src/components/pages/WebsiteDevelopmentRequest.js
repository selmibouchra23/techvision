import React, { useState } from 'react'
import { StepperContext } from '../contexts/StepperContextApp'

import Stepper from '../pages/Stepper'
import StepperControl from '../pages/StepperControl'

import PersonalInformations from '../steps/PersonalInformations'
import ProjectDetails from '../steps/ProjectDetails'
import AcademicAprofessionalSituation from '../steps/AcademicAprofessionalSituation'
import Complete from '../steps/Complete'

import { auth, db } from '../firebase' // Import Firebase
import { collection, addDoc } from 'firebase/firestore'
import { doc, setDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//StepperContext (userData and setUserData) to collect form data from each step.

function WebsiteDevelopmentRequest() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState({
    personalInfo: {},
    academicInfo: {},
    projectDetails: {},
  })
  const [finalData, setFinalData] = useState([])
  const steps = [
    'Personal Informations',
    'Academic or professional situation',
    'Project Details',
    // "Confermation",
    'Complete',
  ]

  const displaySteps = step => {
    switch (step) {
      case 1:
        return <PersonalInformations />
      case 2:
        return <AcademicAprofessionalSituation />
      case 3:
        return <ProjectDetails />

      case 4:
        return <Complete />
    }
  }


  const handleClick = direction => {
    if (direction === 'next') {
      if (currentStep === 1) {
        // Validate Step 1
        if (
          !userData.personalInfo.fullname ||
          !userData.personalInfo.fullnameInArabic ||
          !userData.personalInfo.nationalId ||
          !userData.personalInfo.phoneNumber
        ) {
          toast.error(
            '⚠️ Please fill in all required fields before proceeding.',
            {
              position: 'bottom-center',
              //   autoClose: 3000,
              //   hideProgressBar: false,
              //   closeOnClick: true,
              //   pauseOnHover: true,
              //   draggable: true,
              //   theme: "colored",
            },
          )
          return // Stop from moving forward
        }
      }
      if (currentStep === 2) {
        // Validate Step 2
        const {
          status,
          institution,
          registrationNumber,
          faculty,
          department,
          companyName,
          businessType,
          companyAddress,
          otherDetail,
        } = userData.academicInfo 

        if (!status) {
          toast.error(
            '⚠️ Please select your status (Student, Business Owner, Other).',
            {
              position: 'bottom-center',
            },
          )
          return
        }
        if (userData.academicInfo.status === 'student') {
          if (
            !userData.academicInfo.status ||
            !userData.academicInfo.institution ||
            !userData.academicInfo.registrationNumber ||
            !userData.academicInfo.faculty ||
            !userData.academicInfo.department
          ) {
            toast.error('⚠️ Please fill in all required student information.', {
              position: 'bottom-center',
            })
            return
          }
        }
        if (userData.academicInfo.status === 'businessOwner') {
          if (
            !userData.academicInfo.companyName ||
            !userData.academicInfo.businessType ||
            !userData.academicInfo.companyAddress
          ) {
            toast.error(
              '⚠️ Please fill in all required fields before proceeding.',
              {
                position: 'bottom-center',
                //  autoClose: 3000,
                // hideProgressBar: false,
                //closeOnClick: true,
                // pauseOnHover: true,
                //draggable: true,
                // theme: "colored",
              },
            )
            return
          }
        }
        if (
          userData.academicInfo.status === 'other' &&
          !userData.academicInfo.otherDetail
        ) {
          toast.error("⚠️ Please specify your status in 'Other'.", {
            position: 'bottom-center',
          })
          return
        }
      }
      if (currentStep === 3) {
        // Validate Step 3
        if (
          !userData.projectDetails.projectName ||
          !userData.projectDetails.projectDescription ||
          !userData.projectDetails.technologiesUsed
        ) {
          toast.error(
            '⚠️ Please fill in all required fields before proceeding.',
            {
              position: 'bottom-center',
              // autoClose: 3000,
              // hideProgressBar: false,
              //  closeOnClick: true,
              //  pauseOnHover: true,
              //  draggable: true,
              //  theme: "colored",
            },
          )
          return
        }
      }
    }

    // Move to the next step if validation passes
    let newStep = currentStep
    direction === 'next' ? newStep++ : newStep--
    // check if staps are within bounds
    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep)
    /* if (newStep > 0 && newStep <= steps.length) { 
        setCurrentStep(newStep);  // Met à jour l'étape actuelle
    }         */
  }

  return (
    <div className="md:w-3/4 mt-[3%] mx-auto shadow-xl rounded-2xl pb-2 bg-gray-100">
      {/* Title */}

      <h2 className="text-3xl font-semibold opacity-90 text-center text-green-600 relative top-4">
        Request Programming or Development of Your App/Website Now
      </h2>

      {/*Stepper */}
      <div className="container horizontal mt-5">
        <Stepper steps={steps} currentStep={currentStep} />

        {/*Display components le conteu ta3na */}

        <div className="my-10 p-10">
          <StepperContext.Provider
            value={{
              userData,
              setUserData,
              finalData,
              setFinalData,
            }}
          >
            {displaySteps(currentStep)}
          </StepperContext.Provider>
        </div>
      </div>

      {/*Navigation control */}
      {currentStep !== steps.length && (
        <StepperControl
          handleClick={handleClick}
          currentStep={currentStep}
          steps={steps}
        />
      )}
    </div>
  )
}

export default WebsiteDevelopmentRequest



/*
import React, { useState } from 'react';
import { StepperContext } from '../contexts/StepperContextApp';

import Stepper from '../pages/Stepper'
import StepperControl from '../pages/StepperControl'

import PersonalInformations from '../steps/PersonalInformations'
import ProjectDetails from '../steps/ProjectDetails'
import AcademicAprofessionalSituation from '../steps/AcademicAprofessionalSituation'
import Complete from '../steps/Complete'




function WebsiteDevelopmentRequest() {

    const [currentStep, setCurrentStep] = useState(1);
    const [userData , setUserData] = useState('');
    const [finalData, setFinalData] = useState([]);
    const steps = [
        "Personal Informations",
        "Academic or professional situation",
        "Project Details",
       // "Confermation",
        "Complete"
    ];

    const displaySteps = (step) => {
        switch (step){
            case 1:
            return <PersonalInformations/>
            case 2:
            return <AcademicAprofessionalSituation/>
            case 3:
            return <ProjectDetails/>
            
            case 4:
            return <Complete/>
        }
    }

    const handleClick = (direction) => {
        let newStep = currentStep;
        direction === "next" ? newStep++ : newStep-- ;
        // check if staps are within bounds
        newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
        
    }

  return (
    <div className='md:w-3/4 mt-[3%] mx-auto shadow-xl rounded-2xl pb-2 bg-gray-100'>
      
             
      {Title }
      
      <h2 className="text-3xl font-semibold opacity-90 text-center text-green-600 relative top-4">
        Request Programming or Development of Your App/Website Now
      </h2>


      {Stepper }
      <div className='container horizontal mt-5'>
      <Stepper
      steps = {steps}
      currentStep ={currentStep}
      />
      

      {Display components le conteu ta3na }


      <div className='my-10 p-10'>
        <StepperContext.Provider value={ {
            userData,
            setUserData,
            finalData,
            setFinalData,
        }}>
            {displaySteps(currentStep)}
        </StepperContext.Provider>
      </div>
      </div>



      {Navigation control }
      {currentStep !== steps.length && 
      <StepperControl
      handleClick = {handleClick}
      currentStep = {currentStep}
      steps = {steps}
      /> }
      
    </div>
  );
}

export default WebsiteDevelopmentRequest; */

