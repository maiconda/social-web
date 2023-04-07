import './index.css'

function Comments(props){
    return(
        <div id={props.commentId} className='comment'>
            <img src={props.img} alt="" />
            <div className='comment-div'>
                <h3>{props.name}</h3>
                <p>{props.comment}</p>
            </div>
            <div className={`comment-options ${props.commentClass}`}>
                <svg onClick={props.openOptions} width="23px" height="23px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm0-6a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm0 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" fill="#566b87"/></svg>
            </div>
        </div>
    )
}

export default Comments