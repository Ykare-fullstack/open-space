import '../../styles/Mollecules/UserPreview.css'
import React from 'react'
import { Link } from 'react-router-dom'

//composant vignette de pré-visualisation d'utilisateur
function UserPreview(props) {
    console.log(props.user)
    return (
        <div className="user-preview-wrapper">
            <Link
                to={`/OnePageProfile/${props.user.idusers}`}
                className="user-link"
            >
                <div className="user-preview-picture-frame">
                    <img
                        src={props.user.profilepicture}
                        alt="contenu du profil"
                        className="user-preview-picture"
                    />
                </div>
                <div className="user-preview-description-frame">
                    <p>{`${props.user.firstname} ${props.user.lastname}`}</p>
                    <p>{props.user.description}</p>
                </div>
            </Link>
        </div>
    )
}
export default UserPreview
