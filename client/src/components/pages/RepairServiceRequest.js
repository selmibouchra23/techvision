import React, { useState } from 'react'
import { StepperContextRepair } from '../contexts/StepperContextRepair'

import Stepper from '../pages/Stepper'
import StepperControl from '../pages/StepperControl'

import PersonalInformationsRepair from '../steps/PersonalInformationsRepair'
import DeviceDetails from '../steps/DeviceDetails'
import IssueDescription from '../steps/IssueDescription'
import CompleteRepair from '../steps/CompleteRepair'
//import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function RepairServiceRequest() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState({
    personalInfoRepair: {},
    deviceDetails: {},
    issueDescription: {},
  })
  const [finalData, setFinalData] = useState([])

  const steps = [
    'Personal Information',
    'Device Details',
    'Issue Description',
    'Complete',
  ]

  /* useEffect(() => {
        console.log("Context initialized:", userData);
    }, [userData]);*/

  const displaySteps = step => {
    switch (step) {
      case 1:
        return <PersonalInformationsRepair />
      case 2:
        return <DeviceDetails />
      case 3:
        return <IssueDescription />
      case 4:
        return <CompleteRepair />
      default:
        return null
    }
  }

  const handleClick = direction => {
    if (direction === 'next') {
      if (currentStep === 1) {
        // Validate Step 1
        if (
          !userData.personalInfoRepair.fullname ||
          !userData.personalInfoRepair.fullnameInArabic ||
         // !userData.personalInfoRepair.nationalId ||
          !userData.personalInfoRepair.phoneNumber ||
          !userData.personalInfoRepair.companyName ||
          !userData.personalInfoRepair.companyAddress
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
          /*  Swal.fire({
                        icon: "warning",
                        title: "Missing Information",
                        text: "🚨 Please fill in all required fields before proceeding.",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK",
                    });*/
          return // Stop from moving forward
        }
      }
      if (currentStep === 2) {
        // Validate Step 2
        if (
          !userData.deviceDetails.deviceType ||
          !userData.deviceDetails.modelNumber ||
          !userData.deviceDetails.serialNumber ||
          !userData.deviceDetails.status
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
          /*  Swal.fire({
                        icon: "warning",
                        title: "Missing Information",
                        text: "🚨 Please fill in all required fields before proceeding.",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK",
                    });*/
          return
        }
      }
      if (currentStep === 3) {
        // Validate Step 3
        if (
          !userData.issueDescription.damageTitle ||
          !userData.issueDescription.damageDescription
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
          /*  Swal.fire({
                        icon: "warning",
                        title: "Missing Information",
                        text: "🚨 Please fill in all required fields before proceeding.",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK",
                    });*/
          return
        }
      }
    }
    // Move to the next step if validation passes
    let newStep = currentStep
    direction === 'next' ? newStep++ : newStep--
    // newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
    if (newStep > 0 && newStep <= steps.length) {
      setCurrentStep(newStep) // Met à jour l'étape actuelle
    }
  }

  return (
    <div className="md:w-3/4 mt-[3%] mx-auto shadow-xl rounded-2xl pb-2 bg-gray-100">
      {/* Title */}

      <h2 className="text-3xl font-semibold opacity-90 text-center text-green-600 relative top-4">
        Request a Repair Service Now
      </h2>

      {/*Stepper */}
      <div className="container horizontal mt-5">
        <Stepper steps={steps} currentStep={currentStep} />

        {/*Display components le conteu ta3na */}
        <div className="my-10 p-10">
          <StepperContextRepair.Provider
            value={{
              userData,
              setUserData,
              finalData,
              setFinalData,
            }}
          >
            {displaySteps(currentStep)}
          </StepperContextRepair.Provider>
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

export default RepairServiceRequest




/*import React, { useState } from 'react';
import { StepperContextRepair } from '../contexts/StepperContextRepair';

import Stepper from '../pages/Stepper';
import StepperControl from '../pages/StepperControl';

import PersonalInformationsRepair from '../steps/PersonalInformationsRepair';
import DeviceDetails from '../steps/DeviceDetails';
import IssueDescription from '../steps/IssueDescription';
import CompleteRepair from '../steps/CompleteRepair';

function RepairServiceRequest() {
    const [currentStep, setCurrentStep] = useState(1);
    const [userData, setUserData] = useState('');
    const [finalData, setFinalData] = useState([]);
    
    const steps = [
        "Personal Information",
        "Device Details",
        "Issue Description",
        "Complete"
    ];

    const displaySteps = (step) => {
        switch (step) {
            case 1:
                return <PersonalInformationsRepair />;
            case 2:
                return <DeviceDetails />;
            case 3:
                return <IssueDescription />;
            case 4:
                return <CompleteRepair />;
            default:
                return null;
        }
    };

    const handleClick = (direction) => {
        let newStep = currentStep;
        direction === "next" ? newStep++ : newStep--;
        newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
    };

    return (
        <div className='md:w-3/4 mt-[3%] mx-auto shadow-xl rounded-2xl pb-2 bg-gray-100'>
      
             
      { Title }
      
      <h2 className="text-3xl font-semibold opacity-90 text-center text-green-600 relative top-4">
      Request a Repair Service Now
      </h2>




            {Stepper }
            <div className='container horizontal mt-5'>
                <Stepper
                 steps={steps}
                 currentStep={currentStep

                 } />


                {Display components le conteu ta3na }
                <div className='my-10 p-10'>
                    <StepperContextRepair.Provider value={{
                        userData,
                        setUserData,
                        finalData,
                        setFinalData,
                    }}>
                        {displaySteps(currentStep)}
                    </StepperContextRepair.Provider>
                </div>
            </div>



            {/*Navigation control }
            {currentStep !== steps.length && (
                <StepperControl
                    handleClick={handleClick}
                    currentStep={currentStep}
                    steps={steps}
                />
            )}
        </div>
    );
}

export default RepairServiceRequest;*/
