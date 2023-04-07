import './index.css'

function Notification(props){
    return(
    <div className={`notification ${props.class}`}>
        <img src={props.img} alt="" />
        <p>{props.name} {props.type} seu post</p>
    </div>
    )
}

export default Notification