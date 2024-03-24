"use client";

import React, { useEffect, useState} from 'react'
import AutocompleteAddress from './AutocompleteAddress'
import { ClientOnly } from 'react-client-only'
import Options from './Options';
import Cards from './Cards';


function Booking() {

    return (
        <div className='p-5'>
            <h2 className='text-[20px] font-semibold'>Booking</h2>
            <div className='border-[1px] p-5 rounded-md' style={{height:500}}>
                <AutocompleteAddress />
                <Options />
                <Cards />
                <button className='w-full bg-purple-400 p-1 rounded-md mt-4'>Book</button>
            </div>
        </div>
    )
}

export default Booking