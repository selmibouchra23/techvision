import React from 'react'
import { useContext, useState } from 'react'
import { StepperContext } from '../contexts/StepperContextApp'

export default function PersonalInformations() {
  const { userData, setUserData } = useContext(StepperContext)

  const personalInfo = userData.personalInfo || {}
  // jdid
  const handleChange = e => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      personalInfo: {
        ...personalInfo,
        [name]: value, // Store personal info under "personalInfo"
      },
    })
  }

  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          fullname
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
            // value={userData.personalInfo["fullname"] || ''}
            value={personalInfo.fullname || ''}
            name="fullname"
            placeholder="fullname"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          fullname in arabic
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
            //value={userData.personalInfo["fullname in arabic"] || ''}
            value={personalInfo.fullnameInArabic || ''}
            name="fullnameInArabic"
            placeholder="fullname in arabic"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* Date of Birth Field */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Date of Birth
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <input
            onChange={handleChange}
            //value={userData.personalInfo["dateOfBirth"] || ''}
            value={personalInfo.dateOfBirth || ''}
            name="dateOfBirth"
            type="date"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* Place of Birth Field */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Place of Birth
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <input
            onChange={handleChange}
            // value={userData.personalInfo["placeOfBirth"] || ''}
            value={personalInfo.placeOfBirth || ''}
            name="placeOfBirth"
            placeholder="Place of Birth"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* National Identification Number Field */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          National Identification Number
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
            // value={userData.personalInfo["nationalId"] || ''}
            value={personalInfo.nationalId || ''}
            name="nationalId"
            placeholder="National Identification Number"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* Phone Number Field */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Phone Number
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
            //value={userData.personalInfo["phoneNumber"] || ''}
            value={personalInfo.phoneNumber || ''}
            name="phoneNumber"
            placeholder="Phone Number"
            type="tel"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>
    </div>
  )
}


/*import React from 'react'
import { useContext } from 'react'
import { StepperContext } from '../contexts/StepperContextApp'


export default function PersonalInformations() {
   const {userData, setUserData} = useContext(StepperContext);
   const handleChange = (e) => {
    const { name, value } = e.target; // Corrected 
    setUserData({ ...userData, [name]: value });
};


  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          fullname
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <input
            onChange={handleChange}
            value={userData["fullname"] || ''}
            name="fullname"
            placeholder="fullname"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>




      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          fullname in arabic
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <input
            onChange={handleChange}
            value={userData["fullname in arabic"] || ''}
            name="fullname in arabic"
            placeholder="fullname in arabic"
            
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>




       {/* Date of Birth Field }
       <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Date of Birth
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <input
            onChange={handleChange}
            value={userData["dateOfBirth"] || ''}
            name="dateOfBirth"
            type="date"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>



      {/* Place of Birth Field }
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Place of Birth
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <input
            onChange={handleChange}
            value={userData["placeOfBirth"] || ''}
            name="placeOfBirth"
            placeholder="Place of Birth"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* National Identification Number Field }
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          National Identification Number
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <input
            onChange={handleChange}
            value={userData["nationalId"] || ''}
            name="nationalId"
            placeholder="National Identification Number"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>



      {/* Phone Number Field }
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Phone Number
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <input
            onChange={handleChange}
            value={userData["phoneNumber"] || ''}
            name="phoneNumber"
            placeholder="Phone Number"
            type="tel"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>


    </div>
  )
} */
