import React from 'react'

const StepperControl = ({handleClick, currentStep, steps}) => {
  return (
    <div className='container flex justify-around mt-4 mb-8'>
      {/* back button  */}
      <button
      onClick={()=> handleClick("")}
       className={`bg-white text-slate-400 uppercase text-lg py-3 px-6 rounded-xl 
      font-semibold cursor-pointer border border-gray-400 hover:bg-slate-700 hover:text-white
      transition duration-200 ease-in-out ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}>
          Back
      </button>

      {/* next button  */}
      <button 
      onClick={()=> handleClick("next")}
      className= "bg-green-500 text-white uppercase text-lg py-3 px-6 rounded-xl font-semibold cursor-pointer hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out">
          {currentStep === steps.length - 1 ? "Confirm" : "   Next   "}
      </button>  
    </div>
  )
}

export default StepperControl
