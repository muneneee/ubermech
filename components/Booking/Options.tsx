import OptList from '@/data/OptList'
import Image from 'next/image'
import React, { useState } from 'react'

function Options() {

  const [selectedCar, setSelectedCar]=useState<any>()

  return (
    <div className='mt-3'>
       <h2 className='font-semibold'>Select service</h2> 
       <div className='grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3'>
            {OptList.map((item,index)=>(
                <div key={index} className={`m-2 p-2 border-[2px] rounded-md hover:border-gray-700 cursor-pointer
                  ${index==selectedCar ? 'border-gray-950 border-[2px]' :null}`}
                  onClick={()=>setSelectedCar(index)}
                >
                    <Image 
                        src={item.image}
                        alt={item.name}
                        width={75}
                        height={90}
                    />
                    <h2 className='text-[12px] text-gray-500'>{item.name}
                        <span className='float-right font-medium text-black'>{item.charges*8} $</span>
                    </h2>
                </div>
            ))}
       </div>
    </div>

  )
}

export default Options