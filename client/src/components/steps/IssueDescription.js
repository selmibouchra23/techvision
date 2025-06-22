
import React from 'react'
import { useContext } from 'react'
import { StepperContextRepair } from '../contexts/StepperContextRepair'

export default function IssueDescription() {
  // Récupération des données utilisateur depuis le contexte
  const { userData, setUserData } = useContext(StepperContextRepair)

  const issueDescription = userData.issueDescription || {}

  // Gestion du changement des valeurs des champs
  const handleChange = e => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      issueDescription: {
        ...issueDescription,
        [name]: value, // Store personal info under "personalInfo"
      },
    })
  }

  return (
    <div className="flex flex-col">
      {/* Champ pour le titre du dommage */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Damage Title
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
            value={issueDescription.damageTitle || ''}
            //  value={userData.issueDescription["damageTitle"] || ''}
            //value={userData["damageTitle"] || ''}
            name="damageTitle"
            placeholder="Enter damage title"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* Champ pour la description du dommage */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Damage Description
          <span
            // hadi equired fields
            className="text-red-600 text-xl"
          >
            {' '}
            *
          </span>
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <textarea
            onChange={handleChange}
            value={issueDescription.damageDescription || ''}
            //value={userData.issueDescription["damageDescription"] || ''}
            //value={userData["damageDescription"] || ''}
            name="damageDescription"
            placeholder="Describe the issue in detail"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800 h-24"
          />
        </div>
      </div>
    </div>
  )
}

/*
import React from 'react';
import { useContext } from 'react';
import { StepperContextRepair } from '../contexts/StepperContextRepair';

export default function IssueDescription() {
    // Récupération des données utilisateur depuis le contexte
    const { userData, setUserData } = useContext(StepperContextRepair);

    // Gestion du changement des valeurs des champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    return (
        <div className="flex flex-col">
            {/* Champ pour le titre du dommage }
            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    Damage Title
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
                    <input
                        onChange={handleChange}
                        value={userData["damageTitle"] || ''}
                        name="damageTitle"
                        placeholder="Enter damage title"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                    />
                </div>
            </div>

            {/* Champ pour la description du dommage }
            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    Damage Description
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
                    <textarea
                        onChange={handleChange}
                        value={userData["damageDescription"] || ''}
                        name="damageDescription"
                        placeholder="Describe the issue in detail"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800 h-24"
                    />
                </div>
            </div>
        </div>
    );
} */
