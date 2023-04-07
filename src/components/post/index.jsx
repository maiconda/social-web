import { Link } from 'react-router-dom'
import './index.css'

function Post(props){


    return (
        <div onLoad={props.loadFunction} className={props.class}>
            <div className='card-header-div'>
                <div className='card-header'>
                    <Link to={`/profile/${props.userId}`}><img src={props.img} alt="" /></Link>
                    <div>
                        <Link to={`/profile/${props.userId}`}><h3>{props.name}</h3></Link>
                        <p>{props.data}</p>
                    </div>
                </div>
                <div className={props.classOption} onClickCapture={props.openOptions} onClick={props.openOptions}>
                <svg fill="#566b87" width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="17" width="18" height="2" rx="1" ry="1"/>
                <rect x="3" y="11" width="18" height="2" rx="1" ry="1"/>
                <rect x="3" y="5" width="18" height="2" rx="1" ry="1"/>
                </svg>
                </div>
            </div>
            <p className='card-conteudo'>{props.post}</p>
            <div className='comments-likes'>
                <div id={props.like1id} className={props.like1class}>
                    <svg onClick={props.like} width="24px" height="19px" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" className='like-svg' id={props.likeId} version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg"><desc/><path d="M28.343,17.48L16,29  L3.657,17.48C1.962,15.898,1,13.684,1,11.365v0C1,6.745,4.745,3,9.365,3h0.17c2.219,0,4.346,0.881,5.915,2.45L16,6l0.55-0.55  C18.119,3.881,20.246,3,22.465,3h0.17C27.255,3,31,6.745,31,11.365v0C31,13.684,30.038,15.898,28.343,17.48z" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.95"/></svg>
                    <p onClick={props.openLikes}>{props.numLikes} Curtidas</p>
                </div>

                <div id={props.like2id} className={props.like2class}>
                    <svg onClick={props.deslike} width="24px" height="19px" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" className='like-svg' id={props.likeId} version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg"><desc/><path d="M28.343,17.48L16,29  L3.657,17.48C1.962,15.898,1,13.684,1,11.365v0C1,6.745,4.745,3,9.365,3h0.17c2.219,0,4.346,0.881,5.915,2.45L16,6l0.55-0.55  C18.119,3.881,20.246,3,22.465,3h0.17C27.255,3,31,6.745,31,11.365v0C31,13.684,30.038,15.898,28.343,17.48z" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.95"/></svg>
                    <p onClick={props.openLikes}>{props.numLikes} Curtidas</p>
                </div>

                <div onClick={props.commentFunction}>
                    <svg width="21px" height="21px" id='comment-svg' viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <g id="Layer_2" data-name="Layer 2">
                        <g id="invisible_box" data-name="invisible box">
                        <rect width="48" height="48" fill="none"/>
                        </g>
                        <g id="icons_Q2" data-name="icons Q2">
                        <path d="M40,8V32H13.6l-1.2,1.1L8,37.3V8H40m2-4H6A2,2,0,0,0,4,6V42a2,2,0,0,0,2,2,2,2,0,0,0,1.4-.6L15.2,36H42a2,2,0,0,0,2-2V6a2,2,0,0,0-2-2Z"/>
                        </g>
                    </g>
                    </svg>
                    <p>{props.numComment} Comentários</p>
                </div>
            </div>
        </div>
    )
}

export default Post