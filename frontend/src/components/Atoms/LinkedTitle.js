import React from 'react'
import '../../styles/Atoms/LinkedTitle.css'
import { Link } from 'react-router-dom'
//composant logo Open-Space
function LinkedTitle() {
    return (
        <div className="os-linkedTitle">
            <Link to="/" className="link-style-disabled">
                <p id="os-logo">Open-Space</p>
            </Link>
        </div>
    )
}
export default LinkedTitle
