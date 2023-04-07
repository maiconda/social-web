import "./index.css"

function PostCard(props){
    return (
            <div onClick={props.click} className={`post-form ${props.class}`}>
                <img src={props.img} alt="" />
                <div>
                <p>{props.placeholder}</p>
                </div>
            </div>
    )
}

export default PostCard