import React, { useContext } from 'react'
import useFetch from '../useFetch'
import { AuthContext } from '../authContext'
import CustCard from '../components/CustCard'
import Navbar from '../components/Navbar'
import "../styles/customers.css"

const Customers = ({ type }) => {

    const { user } = useContext(AuthContext)

    // Call useFetch unconditionally
    const { data } = useFetch(`/customers/${user._id}`)

    return (
        <div>
            <Navbar />
            <div className="cust-container">
                {data ? (
                    data?.map((item, index) => (
                        <CustCard key={index}
                            props={{ ...item, type }} />
                    ))
                ) : (
                    "No Customers Yet"
                )}
            </div>
        </div>
    )
}

export default Customers