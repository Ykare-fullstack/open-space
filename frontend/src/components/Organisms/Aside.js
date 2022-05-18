import React from 'react'
import '../../styles/Organisms/Aside.css'
import InfoFrameModerator from '../Mollecules/InfoFrameModerator'
import InfoFrameCorporation from '../Mollecules/InfoFrameCorporation'

function Aside() {
    return (
        <div className="aside-wrapper">
            <InfoFrameModerator />
            <InfoFrameCorporation />
        </div>
    )
}

export default Aside
