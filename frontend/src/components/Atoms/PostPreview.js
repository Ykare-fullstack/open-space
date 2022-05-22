import '../../styles/Mollecules/PostPreview.css'
import React from 'react'
import { Link } from 'react-router-dom'

function PostPreview(props) {
    console.log(props.post)
    return (
        <div className="post-preview-wrapper">
            <Link
                key={props.post.idpost}
                to={`/OnePagePost/${props.post.idpost}`}
                id="post-preview-link"
            >
                {props.post.picture.length === 0 ? null : (
                    <div className="post-preview-picture-frame">
                        <img
                            src={props.post.picture[0].url}
                            alt="contenu du post"
                            className="post-preview-picture"
                        />
                    </div>
                )}

                <div className="post-preview-description-frame">
                    <p>{props.post.description}</p>
                </div>
            </Link>
        </div>
    )
}
export default PostPreview
