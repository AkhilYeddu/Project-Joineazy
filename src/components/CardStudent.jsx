import React, { useState } from 'react'

const CardStudent = ({isSelected, onselect}) => {
   
  return (
    <div className={`rounded-xl text-sm border border-success m-3 p-3 hover:cursor-pointer ${isSelected ? "bg-green-600 text-white" : "bg-base-300 text-white"}`} onClick={onselect}>Student</div>
  )
}

export default CardStudent