import React from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

const Connected = ( { children } ) => {
    const { data } = useQuery(gql`{ online @client }`)
    return (
        <>
            <div>
                Online: {JSON.stringify(data)}
            </div>
            { children }
        </>
    )
}

export default Connected