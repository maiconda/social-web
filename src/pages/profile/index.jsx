import axios from "axios"
import { useEffect, useState, useContext, Fragment } from "react"
import { UserContext } from '../../UserContext';
import { useParams } from "react-router-dom"
import './index.css'
import Post from "../../components/post";
import Comments from "../../components/comments";
import PostCard from "../../components/postCard";

function Profile(){

    let { id } = useParams()
    const url = 'http://localhost:3000'
    const [profile, setProfile] = useState({})
    
    const { user, log, setPostOptions, setCommentOptions, setLikes, profilePosts, setProfilePosts } = useContext(UserContext)

    useEffect(()=> {
        getPosts()
    }, [])
    
    const comment = (input, postId, postUserId) => {

        if (user.name != "" && document.getElementById(input).value.length >= 1) {

            axios.get(`${url}/posts/${postId}`).then((res) => {
                axios.put(`${url}/posts/${postId}`,{
                    comments: [
                        {
                            comment: document.getElementById(input).value,
                            name: user.name,
                            img: user.img,
                            userId: user.userId
                        },
                        ...res.data.comments
                    ],
                    data: res.data.data,
                    likes: res.data.likes,
                    id: res.data.id,
                    img: res.data.img,
                    name: res.data.name,
                    post: res.data.post,
                    userId: res.data.userId
                }).then(() => {
                    getPosts()
                    setNotify(postUserId, postId, 'comentou em')
                    document.getElementById(input).value = ''
                })
            })
        }
    }

    const setNotify = (postUserId, postId, typeNotification) => {

        if(postUserId != user.userId){
                axios.get(`${url}/users/${postUserId}`).then((res) => {
                    axios.put(`${url}/users/${postUserId}`, {
                        notify: [
                            {
                                userImg: user.img,
                                userName: user.name,
                                userId: user.userId,
                                idPost: postId,
                                type: typeNotification,
                                status: 'no'
                            }, ...res.data.notify
                        ],
                        name: res.data.name,
                        email: res.data.email,
                        img: res.data.img,
                        id: res.data.id,
                        endpoints: res.data.endpoints
                    })
                })
            }
    }

    const removeNotify = (postUserId, postId, typeNotification) => {
     
        if(postUserId != user.userId){
            axios.get(`${url}/users/${postUserId}`).then((res) => {
                axios.put(`${url}/users/${postUserId}`, {
                    notify: res.data.notify.filter(i => !(i.userId === user.userId && i.type === typeNotification && i.idPost === postId)),
                    name: res.data.name,
                    email: res.data.email,
                    img: res.data.img,
                    id: res.data.id,
                    endpoints: res.data.endpoints
                })
            })
        }
    }

    const verifyComment = () => {
        
        if(user.name === ''){
            openPopup('login-div')
        }
    }

    const viewComment = (id, length) => {

        if (length > 0) {
            if(document.getElementById(id).style.display === 'none'){
                document.getElementById(id).style.display = 'block'
            } else {
                document.getElementById(id).style.display = 'none'
            }
        }
    }

    const like = (Id, Id2, postId, postUserId) => {

        if (user.name != "") {

            document.getElementById(Id).classList.remove('like-1')
            document.getElementById(Id).classList.add('like-1-none')
            document.getElementById(Id2).classList.remove('like-2')
            document.getElementById(Id2).classList.add('like-2-flex')

            axios.get(`${url}/posts/${postId}`).then((res) => {
                axios.put(`${url}/posts/${postId}`,{
                    likes: [
                        {
                            name: user.name,
                            img: user.img,
                            email: user.email
                        },
                        ...res.data.likes
                    ],
                    data: res.data.data,
                    comments: res.data.comments,
                    id: res.data.id,
                    img: res.data.img,
                    name: res.data.name,
                    post: res.data.post,
                    userId: res.data.userId
                }).then(() => {
                    getPosts()
                    setNotify(postUserId, postId, 'curtiu')
                })
            })
        } else {
            openPopup('login-div')
        }
    }

    const deslike = (Id, Id2, index, postUserId) => {

        
        document.getElementById(Id2).classList.add('like-1')
        document.getElementById(Id2).classList.remove('like-1-none')
        document.getElementById(Id).classList.add('like-2')
        document.getElementById(Id).classList.remove('like-2-flex')

        axios.get(`${url}/posts/${index}`).then((res) => {
            axios.put(`${url}/posts/${index}`,{
                likes: res.data.likes.filter((i) => {return i['email'] !== user.email}),
                data: res.data.data,
                comments: res.data.comments,
                id: res.data.id,
                img: res.data.img,
                name: res.data.name,
                post: res.data.post,
                userId: res.data.userId

            }).then(() => {
                getPosts()
                removeNotify(postUserId, index, 'curtiu')
            })
        })
    }

    const openPopup = (element) => {
        document.getElementById('popups').style.display = "flex"
        document.getElementById(element).style.display = "block"
    }

    const getPosts = () => {
        axios.get(`${url}/users/${id}`).then((res) => {
            setProfile({
                name: res.data.name,
                id: res.data.id,
                img: res.data.img,
                email: res.data.email
            })
            axios.all(res.data.endpoints.map((endpoint) => axios.get(endpoint))).then((res) => setProfilePosts(res))
        })
    }


    return(
    <Fragment>
    <main className="profile-main">
        <div className="profile-content">
            <div className="profile-header">
                <img src={profile.img} alt="" />
                <div>
                    <h1>{profile.name}</h1>
                    <p>{profile.email}</p>
                </div>
            </div>
            {profile.id == user.userId && 
            <PostCard
                    class={'second-postcard'}
                    img={log === 'logado' ? user.img : 'https://digimedia.web.ua.pt/wp-content/uploads/2017/05/default-user-image.png'}
                    placeholder={log === 'logado' ?  `No que você está pensando, ${user.firstName}?` : 'No que você está pensando?'}
                    click={() => {
                        if (log == 'deslogado') {
                            openPopup('login-div')
                        } else {
                            openPopup('postar-popup')
                        }
                    }}/>}
            {profilePosts.length == 0 ? 
            <div className="sem-post">
                <p>O usuário ainda não possui postagens</p>
            </div>
            :
            <div>
                {profilePosts.map((post, index) => {

                const isLiked = post.data.likes && post.data.likes.some((like) => like.email === user.email)

                return (
                <div className="card-div" key={index}>
                    <Fragment>
                    <Post
                        class={`card`}
                        classOption={post.data.userId === user.userId ? 'option-active' : 'option-disable'}
                        userId={post.data.userId}
                        openOptions={() => {
                            openPopup('options-div')
                            setPostOptions({
                                id: post.data.id,
                                userId: post.data.userId
                            })
                            document.getElementById('edit-textarea').value = post.data.post
                        }}
                        name={post.data.name}
                        post={post.data.post}
                        data={post.data.data}
                        key={post.data.id}
                        img={post.data.img}
                        like={() => {like(`like1id-${post.data.id}`, `like2id-${post.data.id}`, post.data.id, post.data.userId)}}
                        deslike={() => {deslike(`like2id-${post.data.id}`, `like1id-${post.data.id}`, post.data.id, post.data.userId)}}
     
                        like2id={`like2id-${post.data.id}`}
                        like1class={isLiked ? `like-1-none` : 'like-1'}
                        like2class={isLiked ? `like-2-flex` : 'like-2'}
                        openLikes={() => {
                            if (post.data.likes.length > 0) {
                                setLikes(post.data.likes)
                                openPopup('curtidas-div')
                            }
                        }}
                        numComment={post.data.comments.length}
                        numLikes={post.data.likes.length}
                        commentFunction={() => {
                            viewComment(`comment-${index}`, post.data.comments.length)
                        }}
                        loadFunction={() => {
                            viewComment(`comment-${index}`, post.data.comments.length)
                        }}
                    />
                    
                    </Fragment>
                    {post.data.comments.length > 0 &&

                    <Fragment>


                    <div id={`comment-${index}`} className="comments-div">
                    
                    
                    {post.data.comments.map((comment, index) => (
                        <Comments
                            key={index}
                            openOptions={() => {
                                setCommentOptions({
                                    comment: comment.comment,
                                    postId: post.data.id,
                                    userPostId: post.data.userId
                                })
                                openPopup('options-comment-div')
                            }}
                            commentClass={comment.userId != user.userId && 'comment-none'}
                            comment={comment.comment}
                            img={comment.img}
                            name={comment.name}
                        />
                    ))}

                    </div>
                    </Fragment>
                }

                <div id="comentar-div">
                    <div className='comentar'>
                        <img src={log === 'logado' ? user.img : 'https://digimedia.web.ua.pt/wp-content/uploads/2017/05/default-user-image.png'} alt="" />
                        <form onClick={verifyComment} onSubmit={(e) => {
                            e.preventDefault()
                            comment(`comment${index}`, post.data.id, post.data.userId)}}>
                                <input autoComplete="off" type="text" id={`comment${index}`} placeholder={'Escreva seu comentário'}/>
                                <button>Publicar</button>
                        </form>
                    </div>
                </div>

                </div>
                )})}
            </div>}
        </div>    
    </main>
    </Fragment>
    )
}

export default Profile