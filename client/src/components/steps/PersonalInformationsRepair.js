import React from 'react'
import { useContext } from 'react'
import { StepperContextRepair } from '../contexts/StepperContextRepair'

export default function PersonalInformationsRepair() {
  const { userData, setUserData } = useContext(StepperContextRepair)
  const personalInfoRepair = userData.personalInfoRepair || {}

  const handleChange = e => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      personalInfoRepair: {
        ...userData.personalInfoRepair,
        [name]: value,
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
            // value={userData["fullname"] || ''}
            value={personalInfoRepair.fullname || ''}
            // value={userData.personalInfoRepair["fullname"] || ''}
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
            value={personalInfoRepair.fullnameInArabic || ''}
            // value={userData.personalInfoRepair["fullnameInArabic"] || ''}
            // value={userData["fullname in arabic"] || ''}
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
            value={personalInfoRepair.dateOfBirth || ''}
            // value={userData.personalInfoRepair["dateOfBirth"] || ''}
            //value={userData["dateOfBirth"] || ''}
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
            value={personalInfoRepair.placeOfBirth || ''}
            // value={userData.personalInfoRepair["placeOfBirth"] || ''}
            //value={userData["placeOfBirth"] || ''}
            name="placeOfBirth"
            placeholder="Place of Birth"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* National Identification Number Field */}
    {/*}  <div className="w-full mx-2 flex-1">
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
            value={personalInfoRepair.nationalId || ''}
            // value={userData.personalInfoRepair["nationalId"] || ''}
            //value={userData["nationalId"] || ''}
            name="nationalId"
            placeholder="National Identification Number"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>*/}

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
            value={personalInfoRepair.phoneNumber || ''}
            //  value={userData.personalInfoRepair["phoneNumber"] || ''}
            //value={userData["phoneNumber"] || ''}
            name="phoneNumber"
            placeholder="Phone Number"
            type="tel"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/*Company Name */}
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
            value={personalInfoRepair.companyName || ''}
            // value={userData.personalInfoRepair["companyName"] || ''}
            //value={userData["companyName"] || ''}
            name="companyName"
            placeholder="Enter your company name"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/*Company Address */}
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
          value={personalInfoRepair.companyAddress || ''}
          //value={userData.personalInfoRepair["companyAddress"] || ''}
          //value={userData["companyAddress"] || ''}
          name="companyAddress"
          placeholder="Enter your company address"
          className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
        />
      </div>
    </div>
  )
}

/*import React from 'react'
import { useContext } from 'react'
import { StepperContextRepair } from '../contexts/StepperContextRepair'


export default function PersonalInformationsRepair() {
   const {userData, setUserData} = useContext(StepperContextRepair);
   const handleChange = (e) => {
    const { name, value } = e.target; 
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



{/*Company Name }
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
          </div>



{/*Company Address }
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
  )
}*/
