import '../../styles/Atoms/PostDescriptionFrame.css'
import React from 'react'
//composant structure affichage de texte
function PostDescriptionFrame(post) {
    return (
        <div className="post-description-frame">
            <h3>{post.description}</h3>
        </div>
    )
}
export default PostDescriptionFrame
