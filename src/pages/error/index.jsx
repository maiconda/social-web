import './index.css'
import { Link } from 'react-router-dom'

function Error(){

    return(
        <main className='error-div'>
            <div>
                <h2>Esta página não está disponível no momento</h2>
                <Link to={'/'}>
                    <button>Ir para a página inicial</button>
                </Link>
            </div>
        </main>
    )

}

export default Error