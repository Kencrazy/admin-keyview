import React,{useState} from 'react'
import { privacyPolicy,termsOfService } from '../constants';
import PopUpService from '../components/popup';
export const Footer = () => {
    const [display,setDisplay]=useState()
    const [type,setType]=useState()

    const togglePopUpService = (type)=>{
        setType(type)
        setDisplay(true)
    }
    return (
        <>
            <footer className="flex flex-wrap items-center justify-between gap-4 pt-4">
                <p className="text-base font-medium text-slate-900 dark:text-slate-50">© 2025 XD Code All Rights Reserved</p>
                <div className="flex flex-wrap gap-x-2">
                    <button
                        className="link"
                        onClick={()=>togglePopUpService("privacy policy")}
                    >
                        Privacy Policy
                    </button>
                    <button
                        className="link"
                        onClick={()=>togglePopUpService("term of service")}
                    >
                        Terms of Service
                    </button>
                </div>
            </footer>
            
            <div onClick={()=>{
                setDisplay(false)
                setType()
            }}>
                {display && (
                    <PopUpService notify={type=="privacy policy" ? privacyPolicy : termsOfService} />
                )}
            </div>
        </>
    );
};
