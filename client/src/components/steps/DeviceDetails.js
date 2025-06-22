import React from 'react'
import { useContext, useState } from 'react'
import { StepperContextRepair } from '../contexts/StepperContextRepair'

import { FaChevronDown } from 'react-icons/fa' // Ta3  l'icône  <

export default function DeviceDetails() {
  // Récupération des données utilisateur depuis le contexte
  const { userData, setUserData } = useContext(StepperContextRepair)

  const deviceDetails = userData.deviceDetails || {}
  //jaaa
  const [status, setStatus] = useState(deviceDetails.status || '')

  // Gestion du changement des valeurs des champs
  const handleChange = e => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      deviceDetails: {
        ...userData.deviceDetails,
        [name]: value, // Store personal info under "personalInfo"
      },
    })
  }

  // Handle changes in select dropdown
  const handleStatusChange = e => {
    const selectedStatus = e.target.value
    setStatus(selectedStatus)

    setUserData({
      ...userData,
      deviceDetails: {
        ...userData.deviceDetails,
        status: selectedStatus, // Store status inside academicInfo
      },
    })
  }

  return (
    <div className="flex flex-col">
      {/* Champ pour le type d'appareil */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Device Type
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
            value={deviceDetails.deviceType || ''}
            // value={userData.deviceDetails["deviceType"] || ''}
            //value={userData["deviceType"] || ''}
            name="deviceType"
            placeholder="Device Type"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* Champ pour la marque */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Brand
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <input
            onChange={handleChange}
            value={deviceDetails.brand || ''}
            // value={userData.deviceDetails["brand"] || ''}
            //value={userData["brand"] || ''}
            name="brand"
            placeholder="Brand"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* Champ pour le numéro de modèle */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Model Number
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
            value={deviceDetails.modelNumber || ''}
            // value={userData.deviceDetails["modelNumber"] || ''}
            //value={userData["modelNumber"] || ''}
            name="modelNumber"
            placeholder="Model Number"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* Champ pour le numéro de série */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Serial Number
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
            value={deviceDetails.serialNumber || ''}
            // value={userData.deviceDetails["serialNumber"] || ''}
            //value={userData["serialNumber"] || ''}
            name="serialNumber"
            placeholder="Serial Number"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* Champ pour la date d'achat */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Purchase Date
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <input
            onChange={handleChange}
            value={deviceDetails.purchaseDate || ''}
            // value={userData.deviceDetails["purchaseDate"] || ''}
            // value={userData["purchaseDate"] || ''}
            name="purchaseDate"
            type="date"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* Champ pour le statut de la garantie */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Warranty Status
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
            onChange={handleStatusChange}
            value={status}
            //  onChange={handleChange}
            //  value={deviceDetails.warrantyStatus || ''}
            //value={userData["warrantyStatus"] || ''}
            name="warrantyStatus"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800 bg-transparent"
          >
            <option value="">Select Warranty Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
          {/* Icône à droite du select */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <FaChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  )
}


/*import React from 'react';
import { useContext } from 'react';
import { StepperContextRepair } from '../contexts/StepperContextRepair';

import { FaChevronDown } from 'react-icons/fa'; // Ta3  l'icône  <


export default function DeviceDetails() {
    // Récupération des données utilisateur depuis le contexte
    const { userData, setUserData } = useContext(StepperContextRepair);

    // Gestion du changement des valeurs des champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    return (
        <div className="flex flex-col">
            {/* Champ pour le type d'appareil }
            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    Device Type
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
                    <input
                        onChange={handleChange}
                        value={userData["deviceType"] || ''}
                        name="deviceType"
                        placeholder="Device Type"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                    />
                </div>
            </div>

            {/* Champ pour la marque }
            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    Brand
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
                    <input
                        onChange={handleChange}
                        value={userData["brand"] || ''}
                        name="brand"
                        placeholder="Brand"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                    />
                </div>
            </div>

            {/* Champ pour le numéro de modèle }
            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    Model Number
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
                    <input
                        onChange={handleChange}
                        value={userData["modelNumber"] || ''}
                        name="modelNumber"
                        placeholder="Model Number"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                    />
                </div>
            </div>

            {/* Champ pour le numéro de série }
            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    Serial Number
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
                    <input
                        onChange={handleChange}
                        value={userData["serialNumber"] || ''}
                        name="serialNumber"
                        placeholder="Serial Number"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                    />
                </div>
            </div>

            {/* Champ pour la date d'achat }
            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    Purchase Date
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
                    <input
                        onChange={handleChange}
                        value={userData["purchaseDate"] || ''}
                        name="purchaseDate"
                        type="date"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                    />
                </div>
            </div>

            {/* Champ pour le statut de la garantie }
            <div className="w-full mx-2 flex-1">
            <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                Warranty Status
            </div>
            <div className="bg-white my-2 p-1 flex border border-gray-200 rounded relative">
                <select
                    onChange={handleChange}
                    value={userData["warrantyStatus"] || ''}
                    name="warrantyStatus"
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800 bg-transparent"
                >
                    <option value="">Select Warranty Status</option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                </select>
                {/* Icône à droite du select }
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FaChevronDown className="h-4 w-4" />
                </div>
            </div>
            </div>
        </div>
    );
} */
