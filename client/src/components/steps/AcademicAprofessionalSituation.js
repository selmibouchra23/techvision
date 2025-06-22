import React, { useContext, useState } from 'react'
import { StepperContext } from '../contexts/StepperContextApp'
import { FaChevronDown } from 'react-icons/fa' // Import de l'icône

export default function AcademicProfessionalSituation() {
  const { userData, setUserData } = useContext(StepperContext)
  const academicInfo = userData.academicInfo || {}
  const [status, setStatus] = useState(academicInfo.status || '')

  /* const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };*/

  //const academicInfo = userData.academicInfo || {};

  // jdid
  const handleChange = e => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      academicInfo: {
        ...academicInfo,
        [name]: value, // Store academic info under "academicInfo"
      },
    })
  }

  // Handle changes in select dropdown
  const handleStatusChange = e => {
    const selectedStatus = e.target.value
    setStatus(selectedStatus)

    setUserData({
      ...userData,
      academicInfo: {
        ...academicInfo,
        status: selectedStatus, // Store status inside academicInfo
      },
    })
  }

  return (
    <div className="flex flex-col">
      {/* Status Selection */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Status
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
            <option value="">Select Status</option>
            <option value="student">
              Student registered under Ministerial Resolution 1275
            </option>
            <option value="businessOwner">Business Owner</option>
            <option value="other">Other</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <FaChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Student Form */}
      {status === 'student' && (
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            University Name
            <span
              // hadi equired fields
              className="text-red-600 text-xl"
            >
              {' '}
              *
            </span>
          </div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              //value={userData.academicInfo["institution"] || ''}
              value={academicInfo.institution || ''}
              name="institution"
              placeholder="Enter your university"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Registration Number
            <span
              // hadi equired fields
              className="text-red-600 text-xl"
            >
              {' '}
              *
            </span>
          </div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              //value={userData.academicInfo["registrationNumber"] || ''}
              value={academicInfo.registrationNumber || ''}
              name="registrationNumber"
              placeholder="Enter your registration number"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Faculty
            <span
              // hadi equired fields
              className="text-red-600 text-xl"
            >
              {' '}
              *
            </span>
          </div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              // value={userData.academicInfo["faculty"] || ''}
              value={academicInfo.faculty || ''}
              name="faculty"
              placeholder="Enter your faculty"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Department
            <span
              // hadi equired fields
              className="text-red-600 text-xl"
            >
              {' '}
              *
            </span>
          </div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              // value={userData.academicInfo["department"] || ''}
              value={academicInfo.department || ''}
              name="department"
              placeholder="Enter your department"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Field of Study
          </div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              // value={userData.academicInfo["fieldOfStudy"] || ''}
              value={academicInfo.fieldOfStudy || ''}
              name="fieldOfStudy"
              placeholder="Enter your field of study"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Specialty
          </div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              //value={userData.academicInfo["specialty"] || ''}
              value={academicInfo.specialty || ''}
              name="specialty"
              placeholder="Enter your specialty"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
        </div>
      )}

      {/* Business Owner Form */}
      {status === 'businessOwner' && (
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Company Name
            <span
              // hadi equired fields
              className="text-red-600 text-xl"
            >
              {' '}
              *
            </span>
          </div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              //value={userData.academicInfo["companyName"] || ''}
              value={academicInfo.companyName || ''}
              name="companyName"
              placeholder="Enter your company name"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Business Type
            <span
              // hadi equired fields
              className="text-red-600 text-xl"
            >
              {' '}
              *
            </span>
          </div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              // value={userData.academicInfo["businessType"] || ''}
              value={academicInfo.businessType || ''}
              name="businessType"
              placeholder="Enter your business type"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Company Address
            <span
              // hadi equired fields
              className="text-red-600 text-xl"
            >
              {' '}
              *
            </span>
          </div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              //value={userData.academicInfo["companyAddress"] || ''}
              value={academicInfo.companyAddress || ''}
              name="companyAddress"
              placeholder="Enter your company address"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
        </div>
      )}

      {/* Other Option */}
      {status === 'other' && (
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Please specify
            <span
              // hadi equired fields
              className="text-red-600 text-xl"
            >
              {' '}
              *
            </span>
          </div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              //value={userData.academicInfo["otherDetail"] || ''}
              value={academicInfo.otherDetail || ''}
              name="otherDetail"
              placeholder="Specify your situation"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
        </div>
      )}
    </div>
  )
}


/*import React, { useContext, useState } from 'react';
import { StepperContext } from '../contexts/StepperContextApp';
import { FaChevronDown } from 'react-icons/fa'; // Import de l'icône

export default function AcademicProfessionalSituation() {
  const { userData, setUserData } = useContext(StepperContext);
  const [status, setStatus] = useState(userData.status || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="flex flex-col">
      { Status Selection }
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Status</div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded relative">
          <select
            onChange={(e) => {
              setStatus(e.target.value);
              setUserData({ ...userData, status: e.target.value });
            }}
            value={status}
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800 bg-transparent"
          >
            <option value="">Select Status</option>
            <option value="student">Student registered under Ministerial Resolution 1275</option>
            <option value="businessOwner">Business Owner</option>
            <option value="other">Other</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <FaChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Student Form }
      {status === "student" && (
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">University Name</div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              value={userData["institution"] || ''}
              name="institution"
              placeholder="Enter your university"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Registration Number</div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              value={userData["registrationNumber"] || ''}
              name="registrationNumber"
              placeholder="Enter your registration number"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Faculty</div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              value={userData["faculty"] || ''}
              name="faculty"
              placeholder="Enter your faculty"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Department</div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              value={userData["department"] || ''}
              name="department"
              placeholder="Enter your department"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Field of Study</div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              value={userData["fieldOfStudy"] || ''}
              name="fieldOfStudy"
              placeholder="Enter your field of study"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Specialty</div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              value={userData["specialty"] || ''}
              name="specialty"
              placeholder="Enter your specialty"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
        </div>
      )}

      {/* Business Owner Form }
      {status === "businessOwner" && (
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Company Name</div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              value={userData["companyName"] || ''}
              name="companyName"
              placeholder="Enter your company name"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Business Type</div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              value={userData["businessType"] || ''}
              name="businessType"
              placeholder="Enter your business type"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Company Address</div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              value={userData["companyAddress"] || ''}
              name="companyAddress"
              placeholder="Enter your company address"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
        </div>
      )}

      {/* Other Option }
      {status === "other" && (
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">Please specify</div>
          <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
            <input
              onChange={handleChange}
              value={userData["otherDetail"] || ''}
              name="otherDetail"
              placeholder="Specify your situation"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            />
          </div>
        </div>
      )}
    </div>
  );
} */