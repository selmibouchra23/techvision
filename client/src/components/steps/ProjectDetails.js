import React, { useContext, useState } from 'react'
import { StepperContext } from '../contexts/StepperContextApp'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore'
//import { auth, db } from "../firebaseConfig"; // Make sure this path is correct
import { FaChevronDown } from 'react-icons/fa' 

export default function ProjectDetails() {
  const { userData, setUserData } = useContext(StepperContext)

  const [status, setStatus] = useState(userData.status || '')
  const navigate = useNavigate() // Used to navigate after submission

  /*const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };*/
  // Ensure projectDetails is initialized to prevent undefined errors
  const projectDetails = userData.projectDetails || {}

  const handleChange = e => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      projectDetails: {
        ...projectDetails,
        [name]: value, // Store project info under "projectDetails"
      },
    })
  } 

   // Handle changes in select dropdown
  const handleStatusChange = e => {
    const selectedStatus = e.target.value
    setStatus(selectedStatus)

    setUserData({
      ...userData,
      projectDetails: {
        ...projectDetails,
        status: selectedStatus, // Store status inside academicInfo
      },
    })
  }

  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Project Name
          <span
            // hadi equired fields
            className="text-red-600 text-xl"
          >
            {' '}
            *
          </span>
        </div>
        <input
          onChange={handleChange}
          value={userData.projectDetails['projectName'] || ''}
          //value={projectDetails.projectName || ''}
          name="projectName"
          placeholder="Enter project name"
          className="p-1 px-2 appearance-none outline-none w-full text-gray-800 border border-gray-200 rounded"
        />
      </div>
            {/* Status Selection */}
            <div className="w-full mx-2 flex-1">
              <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                Project type
                <span
                  // hadi equired fields
                  className="text-red-600 text-xl"
                >
                  {' '}
                  *
                </span>
              </div>
              <div className="bg-white my-2 p-1 flex border border-gray-200 rounded relative">
                <select
                  /* onChange={(e) => {
                    setStatus(e.target.value);
                    setUserData({ ...userData, status: e.target.value });
                  }}*/
                  onChange={handleStatusChange}
                  value={status}
                  name="status"
                  className="p-1 px-2 appearance-none outline-none w-full text-gray-800 bg-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="student">
                    Application
                  </option>
                  <option value="businessOwner">Web Site</option>
                  <option value="other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FaChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Project Description
          <span
            // hadi equired fields
            className="text-red-600 text-xl"
          >
            {' '}
            *
          </span>
        </div>
        <textarea
          onChange={handleChange}
          value={userData.projectDetails['projectDescription'] || ''}
          //value={projectDetails.projectDescription || ''}
          name="projectDescription"
          placeholder="Enter project description"
          className="p-1 px-2 appearance-none outline-none w-full text-gray-800 border border-gray-200 rounded"
        />
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Technologies Used
         {/* <span
            // hadi equired fields
            className="text-red-600 text-xl"
          >
            {' '}
            *
          </span>*/}
        </div>
        <input
          onChange={handleChange}
          value={userData.projectDetails['technologiesUsed'] || ''}
          //value={projectDetails.technologiesUsed || ''}
          name="technologiesUsed"
          placeholder="Enter technologies used"
          className="p-1 px-2 appearance-none outline-none w-full text-gray-800 border border-gray-200 rounded"
        />
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Start Date
        </div>
        <input
          type="date"
          onChange={handleChange}
          value={userData.projectDetails['startDate'] || ''}
          //value={projectDetails.startDate || ''}
          name="startDate"
          className="p-1 px-2 appearance-none outline-none w-full text-gray-800 border border-gray-200 rounded"
        />
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          End Date
        </div>
        <input
          type="date"
          onChange={handleChange}
          value={userData.projectDetails['endDate'] || ''}
          //value={projectDetails.endDate || ''}
          name="endDate"
          className="p-1 px-2 appearance-none outline-none w-full text-gray-800 border border-gray-200 rounded"
        />
      </div>
    </div>
  )
}



/*import React, { useContext } from 'react';
import { StepperContext } from '../contexts/StepperContextApp';

export default function ProjectDetails() {
  const { userData, setUserData } = useContext(StepperContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Project Name</div>
        <input
          onChange={handleChange}
          value={userData["projectName"] || ''}
          name="projectName"
          placeholder="Enter project name"
          className="p-1 px-2 appearance-none outline-none w-full text-gray-800 border border-gray-200 rounded"
        />
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Project Description</div>
        <textarea
          onChange={handleChange}
          value={userData["projectDescription"] || ''}
          name="projectDescription"
          placeholder="Enter project description"
          className="p-1 px-2 appearance-none outline-none w-full text-gray-800 border border-gray-200 rounded"
        />
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Technologies Used</div>
        <input
          onChange={handleChange}
          value={userData["technologiesUsed"] || ''}
          name="technologiesUsed"
          placeholder="Enter technologies used"
          className="p-1 px-2 appearance-none outline-none w-full text-gray-800 border border-gray-200 rounded"
        />
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Start Date</div>
        <input
          type="date"
          onChange={handleChange}
          value={userData["startDate"] || ''}
          name="startDate"
          className="p-1 px-2 appearance-none outline-none w-full text-gray-800 border border-gray-200 rounded"
        />
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">End Date</div>
        <input
          type="date"
          onChange={handleChange}
          value={userData["endDate"] || ''}
          name="endDate"
          className="p-1 px-2 appearance-none outline-none w-full text-gray-800 border border-gray-200 rounded"
        />
      </div>
    </div>
  );
}*/
