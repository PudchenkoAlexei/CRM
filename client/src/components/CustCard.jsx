import React from 'react'
import "../styles/custCard.css"
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';

const CustCard = ({ props }) => {

    const handleClick = async () => {
        try {
            await axios.delete(
                `http://localhost:7700/api/customers/${props._id}`,
                { withCredentials: false })
            window.location.reload();
        }
        catch (err) {
            console.log(err)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'not started':
                return 'grey';
            case 'ongoing':
                return 'orange';
            case 'completed':
                return 'green';
            default:
                return 'purple';
        }
    };

    return (
        <div className='cust-card'>
            <div className="details">
                <div className="cust-name">
                    <h1>{props.name}</h1>
                    <div className="status"
                         style={{ 
                             backgroundColor: getStatusColor(props.status) 
                            }}>
                        {props.status}
                    </div>
                </div>
                <div className='cust-details'>
                    <p>Service: </p> <span>{props.service}</span>
                    <p>Email: </p> <span>{props.email}</span>
                    <p>Phone Number: </p> <span>{props.phone}</span>
                </div>
            </div>
            <div className="icon">
                <FontAwesomeIcon
                    icon={faTrash}
                    onClick={handleClick} />
            </div>
        </div>
    )
}

export default CustCard