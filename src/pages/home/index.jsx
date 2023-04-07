import Post from "../../components/post"
import PostCard from "../../components/postCard"
import "./index.css"
import Comments from "../../components/comments"
import User from "../../components/user"
import { UserContext } from '../../UserContext';
import React, {Fragment, useEffect, useContext} from "react"
import axios from "axios"
import { Link } from "react-router-dom"

function Home(){

    const url = 'http://localhost:3000'
    
    const { user, setUser, log, allUsers, setAllUsers, setPostOptions, setCommentOptions, posts, setPosts, setLikes, setProfilePosts } = useContext(UserContext)

    const getUsers = () => {
        axios.get(`${url}/users`).then((res) => {
            setAllUsers(res.data)
            if(user.email != ''){
                res.data.forEach(element => {
                        if(element.email === user.email){
                            setUser(prevUser => ({
                                ...prevUser,
                                userId: element.id
                            }))
                        }
                });
            }
        })  
    }

    const getPosts = () => {
        axios.get(`${url}/posts`).then((res) => setPosts(res.data.reverse()))
    }

    useEffect(()=>{
        setProfilePosts([])
        getUsers()
    }, [])

    useEffect(()=>{
        allUsers.forEach(element => {
            if(element.email === user.email){
                setUser({
                    name: user.name,
                    firstName: user.firstName,
                    email: user.email,
                    img: user.img,
                    userId: element.id
                })
            }
        });
    }, [allUsers])

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

    return (
            <main className="home-main">
                <div className="esquerda">
                    {log === 'logado' && 
                    <Link to={`/profile/${user.userId}`}>
                    <div className="my-profile">
                    <div>
                        <img src={user.img} alt="" />
                    </div>
                    <div>
                        <h3>{user.name}</h3>
                    </div>
                    </div>
                    </Link>}
                    
                    
                    <div id="linkedin-div" className="contact">
                        <svg id="linkedin" fill="#000000" width="800px" height="800px" viewBox="-5.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 8.219v15.563c0 1.469 1.156 2.625 2.625 2.625h15.563c0.719 0 1.406-0.344 1.844-0.781 0.469-0.469 0.781-1.063 0.781-1.844v-15.563c0-1.469-1.156-2.625-2.625-2.625h-15.563c-0.781 0-1.375 0.313-1.844 0.781-0.438 0.438-0.781 1.125-0.781 1.844zM2.813 10.281c0-1 0.813-1.875 1.813-1.875 1.031 0 1.875 0.875 1.875 1.875 0 1.031-0.844 1.844-1.875 1.844-1 0-1.813-0.813-1.813-1.844zM7.844 23.125v-9.531c0-0.219 0.219-0.406 0.375-0.406h2.656c0.375 0 0.375 0.438 0.375 0.719 0.75-0.75 1.719-0.938 2.719-0.938 2.438 0 4 1.156 4 3.719v6.438c0 0.219-0.188 0.406-0.375 0.406h-2.75c-0.219 0-0.375-0.219-0.375-0.406v-5.813c0-0.969-0.281-1.5-1.375-1.5-1.375 0-1.719 0.906-1.719 2.125v5.188c0 0.219-0.219 0.406-0.438 0.406h-2.719c-0.156 0-0.375-0.219-0.375-0.406zM2.875 23.125v-9.531c0-0.219 0.219-0.406 0.375-0.406h2.719c0.25 0 0.406 0.156 0.406 0.406v9.531c0 0.219-0.188 0.406-0.406 0.406h-2.719c-0.188 0-0.375-0.219-0.375-0.406z"></path>
                        </svg>
                        <p>LinkedIn</p>
                    </div>
                    <div id="github-div" className="contact">
                    <svg id="github" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <title>github</title>
                    <rect width="24" height="24" fill="none"/>
                    <path d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z"/>
                    </svg>
                        <p>GitHub</p>
                    </div>
                    <div id="site-div" className="contact">
                    <svg fill="#000000" width="800px" height="800px" viewBox="0 0 512 512" id="site" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M418.275,146h-46.667  c-5.365-22.513-12.324-43.213-20.587-61.514c15.786,8.776,30.449,19.797,43.572,32.921C403.463,126.277,411.367,135.854,418.275,146  z M452,256c0,17.108-2.191,33.877-6.414,50h-64.034c1.601-16.172,2.448-32.887,2.448-50s-0.847-33.828-2.448-50h64.034  C449.809,222.123,452,238.892,452,256z M256,452c-5.2,0-21.048-10.221-36.844-41.813c-6.543-13.087-12.158-27.994-16.752-44.187  h107.191c-4.594,16.192-10.208,31.1-16.752,44.187C277.048,441.779,261.2,452,256,452z M190.813,306  c-1.847-16.247-2.813-33.029-2.813-50s0.966-33.753,2.813-50h130.374c1.847,16.247,2.813,33.029,2.813,50s-0.966,33.753-2.813,50  H190.813z M60,256c0-17.108,2.191-33.877,6.414-50h64.034c-1.601,16.172-2.448,32.887-2.448,50s0.847,33.828,2.448,50H66.414  C62.191,289.877,60,273.108,60,256z M256,60c5.2,0,21.048,10.221,36.844,41.813c6.543,13.087,12.158,27.994,16.752,44.187H202.404  c4.594-16.192,10.208-31.1,16.752-44.187C234.952,70.221,250.8,60,256,60z M160.979,84.486c-8.264,18.301-15.222,39-20.587,61.514  H93.725c6.909-10.146,14.812-19.723,23.682-28.593C130.531,104.283,145.193,93.262,160.979,84.486z M93.725,366h46.667  c5.365,22.513,12.324,43.213,20.587,61.514c-15.786-8.776-30.449-19.797-43.572-32.921C108.537,385.723,100.633,376.146,93.725,366z   M351.021,427.514c8.264-18.301,15.222-39,20.587-61.514h46.667c-6.909,10.146-14.812,19.723-23.682,28.593  C381.469,407.717,366.807,418.738,351.021,427.514z"/></svg>
                        <p>WebSite</p>
                    </div>

                    <div onClick={() => openPopup('usuarios-div')} id="users-lateral-div" className="contact">
                    <svg id="users-lateral"  viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M288 320a224 224 0 1 0 448 0 224 224 0 1 0-448 0zm544 608H160a32 32 0 0 1-32-32v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 0 1-32 32z"/></svg>
                        <p>Usuários</p>
                    </div>
                </div>

                <div className="esquerda-2">
                        {log === 'logado' && <Link to={`/profile/${user.userId}`}><img className="profile-2" src={user.img} alt="" /></Link>}

                        <div id="linkedin-div-2" className="contact-2">
                            <svg id="likedin-2" width="20px" height="20px" viewBox="-5.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 8.219v15.563c0 1.469 1.156 2.625 2.625 2.625h15.563c0.719 0 1.406-0.344 1.844-0.781 0.469-0.469 0.781-1.063 0.781-1.844v-15.563c0-1.469-1.156-2.625-2.625-2.625h-15.563c-0.781 0-1.375 0.313-1.844 0.781-0.438 0.438-0.781 1.125-0.781 1.844zM2.813 10.281c0-1 0.813-1.875 1.813-1.875 1.031 0 1.875 0.875 1.875 1.875 0 1.031-0.844 1.844-1.875 1.844-1 0-1.813-0.813-1.813-1.844zM7.844 23.125v-9.531c0-0.219 0.219-0.406 0.375-0.406h2.656c0.375 0 0.375 0.438 0.375 0.719 0.75-0.75 1.719-0.938 2.719-0.938 2.438 0 4 1.156 4 3.719v6.438c0 0.219-0.188 0.406-0.375 0.406h-2.75c-0.219 0-0.375-0.219-0.375-0.406v-5.813c0-0.969-0.281-1.5-1.375-1.5-1.375 0-1.719 0.906-1.719 2.125v5.188c0 0.219-0.219 0.406-0.438 0.406h-2.719c-0.156 0-0.375-0.219-0.375-0.406zM2.875 23.125v-9.531c0-0.219 0.219-0.406 0.375-0.406h2.719c0.25 0 0.406 0.156 0.406 0.406v9.531c0 0.219-0.188 0.406-0.406 0.406h-2.719c-0.188 0-0.375-0.219-0.375-0.406z"></path>
                            </svg>
                        </div>

                        <div id="github-div-2" className="contact-2">
                            <svg id="github-2" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" fill="none"/>
                            <path d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z"/>
                            </svg>
                        </div>
                        <div id="site-div-2" className="contact-2">
                            <svg id="site-2" width="800px" height="800px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M418.275,146h-46.667  c-5.365-22.513-12.324-43.213-20.587-61.514c15.786,8.776,30.449,19.797,43.572,32.921C403.463,126.277,411.367,135.854,418.275,146  z M452,256c0,17.108-2.191,33.877-6.414,50h-64.034c1.601-16.172,2.448-32.887,2.448-50s-0.847-33.828-2.448-50h64.034  C449.809,222.123,452,238.892,452,256z M256,452c-5.2,0-21.048-10.221-36.844-41.813c-6.543-13.087-12.158-27.994-16.752-44.187  h107.191c-4.594,16.192-10.208,31.1-16.752,44.187C277.048,441.779,261.2,452,256,452z M190.813,306  c-1.847-16.247-2.813-33.029-2.813-50s0.966-33.753,2.813-50h130.374c1.847,16.247,2.813,33.029,2.813,50s-0.966,33.753-2.813,50  H190.813z M60,256c0-17.108,2.191-33.877,6.414-50h64.034c-1.601,16.172-2.448,32.887-2.448,50s0.847,33.828,2.448,50H66.414  C62.191,289.877,60,273.108,60,256z M256,60c5.2,0,21.048,10.221,36.844,41.813c6.543,13.087,12.158,27.994,16.752,44.187H202.404  c4.594-16.192,10.208-31.1,16.752-44.187C234.952,70.221,250.8,60,256,60z M160.979,84.486c-8.264,18.301-15.222,39-20.587,61.514  H93.725c6.909-10.146,14.812-19.723,23.682-28.593C130.531,104.283,145.193,93.262,160.979,84.486z M93.725,366h46.667  c5.365,22.513,12.324,43.213,20.587,61.514c-15.786-8.776-30.449-19.797-43.572-32.921C108.537,385.723,100.633,376.146,93.725,366z   M351.021,427.514c8.264-18.301,15.222-39,20.587-61.514h46.667c-6.909,10.146-14.812,19.723-23.682,28.593  C381.469,407.717,366.807,418.738,351.021,427.514z"/></svg>
                        </div>

                        <div className="users" onClick={() => openPopup('usuarios-div')}>
                            <svg id="users-2"  viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M288 320a224 224 0 1 0 448 0 224 224 0 1 0-448 0zm544 608H160a32 32 0 0 1-32-32v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 0 1-32 32z"/></svg>
                        </div>
                </div>

                <div className="conteudo">
                    <PostCard
                    img={log === 'logado' ? user.img : 'https://digimedia.web.ua.pt/wp-content/uploads/2017/05/default-user-image.png'}
                    placeholder={log === 'logado' ?  `No que você está pensando, ${user.firstName}?` : 'No que você está pensando?'}
                    click={() => {
                        if (log == 'deslogado') {
                            openPopup('login-div')
                        } else {
                            openPopup('postar-popup')
                        }
                    }}/>


                    {posts.map((post, index) => {

                        const isLiked = post.likes && post.likes.some((like) => like.email === user.email)

                        return (
                        <div className="card-div" key={index}>
                            <Fragment>
                                
                            <Post
                                class={`card`}
                                classOption={post.userId === user.userId ? 'option-active' : 'option-disable'}
                                userId={post.userId}
                                openOptions={() => {
                                    openPopup('options-div')
                                    setPostOptions({
                                        id: post.id,
                                        userId: post.userId
                                    })
                                    document.getElementById('edit-textarea').value = post.post
                                }}
                                name={post.name}
                                post={post.post}
                                data={post.data}
                                key={post.id}
                                img={post.img}
                                like={() => {like(`like1id-${post.id}`, `like2id-${post.id}`, post.id, post.userId)}}
                                deslike={() => {deslike(`like2id-${post.id}`, `like1id-${post.id}`, post.id, post.userId)}}
                                like1id={`like1id-${post.id}`}
                                like2id={`like2id-${post.id}`}
                                like1class={isLiked ? `like-1-none` : 'like-1'}
                                like2class={isLiked ? `like-2-flex` : 'like-2'}
                                openLikes={() => {
                                    if (post.likes.length > 0) {
                                        setLikes(post.likes)
                                        openPopup('curtidas-div')
                                    }
                                }}
                                numComment={post.comments.length}
                                numLikes={post.likes.length}
                                commentFunction={() => {
                                    viewComment(`comment-${index}`, post.comments.length)
                                }}
                                loadFunction={() => {
                                    viewComment(`comment-${index}`, post.comments.length)
                                }}
                            />
                            
                            </Fragment>
                            {post.comments.length > 0 &&

                            <Fragment>

        
                            <div id={`comment-${index}`} className="comments-div">
                            
                            
                            {post.comments.map((comment, index) => (
                                <Comments
                                    key={index}
                                    openOptions={() => {
                                        setCommentOptions({
                                            comment: comment.comment,
                                            postId: post.id,
                                            userPostId: post.userId
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
                                    comment(`comment${index}`, post.id, post.userId)}}>
                                        <input autoComplete="off" type="text" id={`comment${index}`} placeholder={'Escreva seu comentário'}/>
                                        <button>Publicar</button>
                                </form>
                            </div>
                        </div>

                        </div>
                        )})}
                </div>
                
                <div className="direita">
                    <div className="usuarios-title">
                        <p>Todos os Usuários</p>
                        <span>
                            {allUsers.length}
                        </span>
                    </div>
                    <div className="usuarios">
                        {allUsers.map((user, index) => (
                            <Link
                            to={`profile/${user.id}`}
                            key={index}>
                            <User
                                key={index}
                                name={user.name}
                                img={user.img}/>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
    )
}

export default Home