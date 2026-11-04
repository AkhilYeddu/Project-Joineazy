import React, { useState } from 'react'

const CardAdmin = ({isSelected, onselect}) => {
   

   
    
  return (
    <div>
        
        <div className={`rounded-xl text-sm border border-pink-600 m-3 p-3 hover:cursor-pointer ${isSelected ? "bg-pink-600 text-white" : "bg-base-300 text-white"}`} onClick={onselect}>Admin</div>
    </div>
    
  )
}

export default CardAdmin