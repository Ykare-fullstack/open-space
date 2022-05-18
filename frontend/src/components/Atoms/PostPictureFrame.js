import '../../styles/Atoms/PostPictureFrame.css'
import React from 'react'

function PostPictureFrame(props) {
    return (
        <div className="post-picture-frame">
            <img
                className="post-picture"
                src={props.picture.url}
                alt="élément visuel du post"
            />
        </div>
    )
}
export default PostPictureFrame
