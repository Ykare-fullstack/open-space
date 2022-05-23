import React from 'react'
import '../../styles/Atoms/InfoDisplayPictureContainer.css'
//composant structure pour image
function InfoDisplayPictureContainer({ data }) {
    return (
        <div className="info-display-picture-container">
            <img
                src={data}
                alt="profil"
                className="info-display-picture-content"
            />
        </div>
    )
}
export default InfoDisplayPictureContainer
