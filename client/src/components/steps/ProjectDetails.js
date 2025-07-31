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
  const [projectype, setProjectype] = useState(projectDetails.projectype || '')

   const [selectedFunctionalities, setSelectedFunctionalities] = useState(projectDetails.selectedFunctionalities || [])
  const [totalPrice, setTotalPrice] = useState(projectDetails.totalPrice || 0)
  const [totalDuration, setTotalDuration] = useState(projectDetails.totalDuration || 0)


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
   const handleProjectTypeChange = e => {
    const selectedType = e.target.value
    setProjectype(selectedType)
     setSelectedFunctionalities([])
    setTotalPrice(0)
    setTotalDuration(0)

    setUserData({
      ...userData,
      projectDetails: {
        ...projectDetails,
        projectype: selectedType,
        selectedFunctionalities: [],
        totalPrice: 0,
        totalDuration: 0,
      },
    })
  }

   // 1. Liste des fonctionnalités avec prix, durée (jours), et chemin
  const predefinedFunctionalities = {
    app: [
      { name: 'Authentification et gestion des comptes', price: 3000, duration: 2, path: '/auth' },
      { name: 'Navigation de base', price: 1500, duration: 1, path: '/navigation' },
      { name: 'Système de messagerie / commentaires', price: 2500, duration: 2, path: '/messaging' },
      { name: 'Notifications', price: 1500, duration: 1, path: '/notifications' },
      { name: 'Géolocalisation et carte', price: 2000, duration: 2, path: '/map' },
      { name: 'Multimédia (images / vidéos / caméra)', price: 4000, duration: 3, path: '/media' },
      { name: 'Gestion de contenu / flux', price: 2500, duration: 2, path: '/content' },
      { name: 'Paramètres et préférences', price: 1000, duration: 1, path: '/settings' },
      { name: 'Statistiques / tableau de bord', price: 3000, duration: 2, path: '/dashboard' },
      { name: 'Paiement et transactions', price: 3500, duration: 3, path: '/payment' },
      { name: 'Sécurité et confidentialité', price: 2000, duration: 1, path: '/security' },
      { name: 'Mise à jour de contenu / gestion à distance', price: 2500, duration: 2, path: '/remote' },
      { name: 'Compte admin', price: 1500, duration: 1, path: '/admin' },
    ],
    web: [
      { name: 'Structure de navigation', price: 1000, duration: 1, path: '/navigation' },
      { name: 'Gestion des utilisateurs', price: 2500, duration: 2, path: '/users' },
      { name: 'Moteur de recherche', price: 2000, duration: 2, path: '/search' },
      { name: 'Système de messagerie', price: 2000, duration: 2, path: '/messaging' },
      { name: 'Page contact', price: 1000, duration: 1, path: '/contact' },
      { name: 'Gestion de contenu', price: 2500, duration: 2, path: '/content' },
      { name: 'CMS', price: 3000, duration: 3, path: '/cms' },
      { name: 'Newsletter et mailing', price: 2000, duration: 2, path: '/newsletter' },
      { name: 'Notifications', price: 1500, duration: 1, path: '/notifications' },
      { name: 'Accessibilité', price: 1000, duration: 1, path: '/accessibility' },
      { name: 'Sécurité et confidentialité', price: 2000, duration: 1, path: '/security' },
      { name: 'Tableau de bord', price: 3000, duration: 2, path: '/dashboard' },
      { name: 'Analytics', price: 2500, duration: 2, path: '/analytics' },
      { name: 'Formulaires d’administration', price: 1500, duration: 1, path: '/forms' },
      { name: 'Référencement / SEO', price: 2000, duration: 2, path: '/seo' },
      { name: 'Responsivité / Design adaptatif', price: 2000, duration: 2, path: '/design' },
      { name: 'Gestion base de données', price: 3000, duration: 3, path: '/database' },
    ],
  }

   const handleCheckboxChange = (func) => {
    const isSelected = selectedFunctionalities.some(f => f.name === func.name)
    const updated = isSelected
      ? selectedFunctionalities.filter(f => f.name !== func.name)
      : [...selectedFunctionalities, func]

    setSelectedFunctionalities(updated)
      const priceSum = updated.reduce((acc, f) => acc + f.price, 0)
    const durationSum = updated.reduce((acc, f) => acc + f.duration, 0)

    setTotalPrice(priceSum)
    setTotalDuration(durationSum)

    setUserData({
      ...userData,
      projectDetails: {
        ...projectDetails,
        selectedFunctionalities: updated,
        totalPrice: priceSum,
        totalDuration: durationSum,
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
                  onChange={handleProjectTypeChange}
                  value={projectype}
                  name="projectype"
                  className="p-1 px-2 appearance-none outline-none w-full text-gray-800 bg-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="app">
                    Application
                  </option>
                  <option value="web">Web Site</option>
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
      {projectype && projectype !== 'other' &&  (
  <div className="w-full mx-2 mt-6">
    <h2 className="text-gray-800 font-semibold text-xl mb-4 border-b pb-2">Choisissez les fonctionnalités</h2>

    <div className="grid gap-3">
      {predefinedFunctionalities[projectype]?.map((func, index) => {
        const isChecked = selectedFunctionalities.some(f => f.name === func.name)
        return (
          <label
            key={index}
            className={`flex items-center justify-between gap-4 p-4 rounded-lg border transition-all duration-300 cursor-pointer shadow-sm 
              ${isChecked ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}
            `}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 transition duration-200"
                checked={isChecked}
                onChange={() => handleCheckboxChange(func)}
              />
              <span className="text-sm text-gray-800">
                <span className="font-semibold">{func.name}</span> 
                 <span className="text-gray-600">— {func.price} DA — {func.duration} jour(s) </span>
              </span>
            </div>
          </label>
        )
      })}  
      
    </div>
    <div className="mt-6 px-4 py-3 bg-gray-100 rounded-md text-gray-800 text-sm shadow-inner">
      <p className="mb-1"><strong>Prix total :</strong> {totalPrice} DA</p>
      <p><strong>Durée totale :</strong> {totalDuration} jour(s)</p>
    </div>

  
  </div>
)}
{projectype === 'other' && (
  <p className="text-gray-500 italic mt-4">Aucune fonctionnalité prédéfinie disponible pour ce type.</p>
)}


    {/*  <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Technologies Used
         {/* <span
            // hadi equired fields
            className="text-red-600 text-xl"
          >
            {' '}
            *
          </span>/}
        </div>
        <input
          onChange={handleChange}
          value={userData.projectDetails['technologiesUsed'] || ''}
          //value={projectDetails.technologiesUsed || ''}
          name="technologiesUsed"
          placeholder="Enter technologies used"
          className="p-1 px-2 appearance-none outline-none w-full text-gray-800 border border-gray-200 rounded"
        />
      </div>*/}

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
