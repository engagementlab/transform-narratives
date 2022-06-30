import React from "react"
import { CustomNavigation } from "./components/CustomNav"
import { Global, css } from '@emotion/core'

// admin/config.tsx
function CustomLogo () {
    return ( 
        <div style={{display: 'flex', flexDirection: 'row'}}>
        <Global styles={
        css`
            @font-face {
            font-family: 'Patrick Hand SC';
            font-style: normal;
            font-weight: 400;
            src: local('Patrick Hand SC'),
                local('PatrickHandSC-Regular'),
                url(https://fonts.gstatic.com/s/patrickhandsc/v4/OYFWCgfCR-7uHIovjUZXsZ71Uis0Qeb9Gqo8IZV7ckE.woff2)
                format('woff2');
            unicode-range: U+0100-024f, U+1-1eff,
            U+20a0-20ab, U+20ad-20cf, U+2c60-2c7f,
            U+A720-A7FF;
            }
        `
        }
        />
        <div style={{width: '80px'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="none" viewBox="0 0 70 70">
                <path fill="#000" fill-rule="evenodd" d="M70 35c0 19.33-15.67 35-35 35S0 54.33 0 35 15.67 0 35 0s35 15.67 35 35z" clip-rule="evenodd"/>
                <path fill="#F6A536" fill-rule="evenodd" d="M28.075 17.992l.018 28.195h20.244v5.82H21.69V18.053l6.385-.06z" clip-rule="evenodd"/>
                <path fill="#00AB9E" fill-rule="evenodd" d="M28.075 32.18v5.869h20.262v-5.821l-20.262-.048z" clip-rule="evenodd"/>
                <path fill="#F72923" fill-rule="evenodd" d="M28.075 17.992v5.868h20.262v-5.82l-20.262-.048z" clip-rule="evenodd"/>
            </svg>
        </div>
        <h1 style={{fontSize: 'large'}}>Engagement Lab <br />Content Management</h1>
        </div>
    )
}

export const components = {
    Logo: CustomLogo,
    Navigation: CustomNavigation,
}