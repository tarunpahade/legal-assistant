/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react';
import LegalAssistant from './components/leagal-editor';
import Header from '@/components/header';

const Page = () => {

    return (
        <div className="p-4 overflow-hidden w-[80vw]">
            <Header />
            <LegalAssistant />
            
        </div>
    );
};

export default Page;