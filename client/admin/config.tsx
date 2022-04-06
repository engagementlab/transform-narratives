import Image from "../components/Image"
import { CustomNavigation } from "./components/CustomNav"

// admin/config.tsx
function CustomLogo () {
    return ( 
        <div style={{display: 'flex', flexDirection: 'row'}}>

        <div style={{width: '80px'}}>
                <Image id="logo" alt="Engagement Lab logo" imgId="logos/logo-sm.svg" width={60}  />
        </div>
        <h1 style={{fontSize: 'large'}}>Engagement Lab <br />Content Management</h1>
        </div>
    )
}

export const components = {
    Logo: CustomLogo,
    Navigation: CustomNavigation,
}