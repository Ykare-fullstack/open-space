import '../../styles/Atoms/PostCommentsFrame.css'
import React, { useEffect, useState } from 'react'
import CommentFrame from '../Atoms/CommentFrame'
import PostCommentInputFrame from '../Atoms/PostCommentInputFrame'

//composant d'affichage et saisie de commentaires
function PostCommentsFrame(props) {
    const [comments, setComments] = useState([])
    const [hasUpdated, setHasUpdated] = useState(false)
    const token = sessionStorage.getItem('token')
    const postId = props.postId

    const url = 'http://localhost:3001/api/comments/' + postId
    const getComments = {
        method: 'GET',
        headers: new Headers({
            authorization: token,
        }),
    }
    //fetch des commentaires relatifs à la publication
    useEffect(() => {
        fetch(url, getComments)
            .then((response) => response.json())
            .then((resultComments) => {
                setComments(resultComments)
                setHasUpdated(false)
            })
            .catch((err) => console.log({ err: err.message }))
    }, [hasUpdated])
    return (
        <React.Fragment>
            {comments.length === 0 ? null : (
                <div className="comments-frame">
                    {comments.map((comment, index) => (
                        <CommentFrame
                            key={index}
                            content={comment.content}
                            commentId={comment.idcomment}
                            ownerId={comment.iduser}
                            index={index}
                            setHasUpdated={setHasUpdated}
                        />
                    ))}
                </div>
            )}
            <div className="comments-input-frame">
                <PostCommentInputFrame
                    postId={postId}
                    setHasUpdated={setHasUpdated}
                />
            </div>
        </React.Fragment>
    )
}
export default PostCommentsFrame
