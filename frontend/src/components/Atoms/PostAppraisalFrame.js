import '../../styles/Atoms/PostAppraisalFrame.css'
import React, { useContext, useState, useEffect } from 'react'
import { LoginContext } from '../../contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function PostAppraisalFrame(props) {
    const { userData } = useContext(LoginContext)
    const [appraisal, setAppraisal] = useState(-1)
    const [like, setLike] = useState(0)
    const [dislike, setDislike] = useState(0)
    const token = sessionStorage.getItem('token')
    const urlpost = 'http://localhost:3001/api/appraisal/'
    const urlget = 'http://localhost:3001/api/appraisal/' + props.postId
    let getAppraisal = {
        method: 'GET',
        headers: new Headers({
            authorization: token,
        }),
    }
    useEffect(() => {
        fetch(urlget, getAppraisal)
            .then((response) => response.json())
            .then((res) => {
                setLike(res.likes)
                setDislike(res.dislikes)
                setAppraisal(res.userappraisal)
            })
    }, [])

    function submitAppraisal(value) {
        let authPayload = {
            postId: props.postId,
            userId: userData.userId,
            appraisal: value,
        }
        let postAppraisal = {
            method: 'POST',
            body: JSON.stringify(authPayload),
            headers: new Headers({
                'content-type': 'application/JSON',
                authorization: token,
            }),
        }
        fetch(urlpost, postAppraisal).then(() => {
            console.log('publication évaluée')
        })
    }
    return (
        <div className="appraisal-frame">
            {appraisal === -1 ? (
                <div className="button-wrapper-appraisal">
                    <div className="like-wrapper">
                        <button
                            type="submit"
                            onClick={() => {
                                submitAppraisal(1)
                                setAppraisal(1)
                                setLike((like) => like + 1)
                            }}
                            className="appraisal-button"
                            aria-label="aimer le post"
                        >
                            <p>
                                <FontAwesomeIcon
                                    icon="fa-solid fa-thumbs-up"
                                    className="appraisal-icon"
                                />
                            </p>
                        </button>
                        <p aria-label="nombre de like">{like}</p>
                    </div>
                    <div className="dislike-wrapper">
                        <p aria-label="nombre de dislike">{dislike}</p>
                        <button
                            type="submit"
                            onClick={() => {
                                submitAppraisal(0)
                                setAppraisal(0)
                                setDislike((dislike) => dislike + 1)
                            }}
                            className="appraisal-button"
                            aria-label="ne pas aimer le post"
                        >
                            <p>
                                <FontAwesomeIcon
                                    icon="fa-solid fa-thumbs-down"
                                    className="appraisal-icon"
                                />
                            </p>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="button-wrapper-appraisal">
                    <div className="like-wrapper">
                        <button
                            disabled={appraisal === 1 ? false : true}
                            type="submit"
                            onClick={() => {
                                setLike((like) => like - 1)
                                setAppraisal(-1)
                                submitAppraisal(-1)
                            }}
                            className={
                                appraisal === 0
                                    ? 'appraisal-button'
                                    : 'appraisal-button-disabled-check-red appraisal-button'
                            }
                            aria-label={
                                appraisal === 1
                                    ? 'ne plus aimer la publication'
                                    : 'bouton désactivé'
                            }
                        >
                            <p>
                                <FontAwesomeIcon
                                    icon="fa-solid fa-thumbs-up"
                                    className="appraisal-icon"
                                />
                            </p>
                        </button>
                        <p>{like}</p>
                    </div>
                    <div className="dislike-wrapper">
                        <p>{dislike}</p>
                        <button
                            disabled={appraisal === 0 ? false : true}
                            type="submit"
                            onClick={() => {
                                setDislike((dislike) => dislike - 1)
                                setAppraisal(-1)
                                submitAppraisal(-1)
                            }}
                            className={
                                appraisal === 1
                                    ? 'appraisal-button'
                                    : 'appraisal-button-disabled-check-blue appraisal-button'
                            }
                            aria-label={
                                appraisal === 1
                                    ? 'ne plus disliker la publication'
                                    : 'bouton désactivé'
                            }
                        >
                            <p>
                                <FontAwesomeIcon
                                    icon="fa-solid fa-thumbs-down"
                                    className="appraisal-icon"
                                />
                            </p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
export default PostAppraisalFrame
