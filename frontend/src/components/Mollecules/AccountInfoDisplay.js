import React, { useContext } from 'react'
import { LoginContext } from '../../contexts/index'
import InfoDisplayDataContainer from '../Atoms/InfoDisplayDataContainer'
import InfoDisplayPictureContainer from '../Atoms/InfoDisplayPictureContainer'
import '../../styles/Mollecules/AccountInfoDisplay.css'

// fonction d'affichage des infos utilisateur actuel via contexte. (userData)
//-------------------------------------------------------------------------------------------
function AccountInfoDisplay() {
    const { userData } = useContext(LoginContext)
    return (
        <div className="account-info-display-frame">
            <InfoDisplayPictureContainer data={userData.profilepicture} />
            <InfoDisplayDataContainer data={userData.firstname} />
            <InfoDisplayDataContainer data={userData.lastname} />
            <InfoDisplayDataContainer
                data={userData.description}
                id="description-container"
            />
        </div>
    )
}
export default AccountInfoDisplay
