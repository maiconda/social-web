import './index.css'

function User(props){
    return (
        <div className={`usuario`}>
            <img src={props.img} alt="" />
            <p>{props.name}</p>
        </div>
    )
}

export default User