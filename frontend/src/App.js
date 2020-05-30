import React from 'react'
import './App.css'
import { ApolloClient, HttpLink, ApolloProvider } from '@apollo/client'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'
import Stocks from './Stocks'
import { SubscriptionClient } from 'subscriptions-transport-ws'

// Create an http link:
const httpLink = new HttpLink({
  uri: 'http://localhost:9001/graphql'
})

// const wsLink = new WebSocketLink({
//   uri: `ws://localhost:9001/subscriptions`,
//   options: {
//     reconnect: true,
//     connectionParams: {
//       authToken: 'foobar',
//     }
//   }
// });

const subClient = new SubscriptionClient('ws://localhost:9001/subscriptions', {
 reconnect: true,
 connectionParams: {
  authToken: 'foobar',
}
})

// Ez a megoldás ebből a cikkből indult ki
// http://www.petecorey.com/blog/2019/05/13/is-my-apollo-client-connected-to-the-server/
// Illetve itt található további információ
// https://stackoverflow.com/questions/50887793/check-for-internet-connectivity-using-websocketlink-from-apollo-link-ws/50893219#50893219


const wsLink = new WebSocketLink(subClient)


// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink,
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

client.cache.writeData({ data: { online: false } })

subClient.onConnected(() =>
    client.cache.writeData({ data: { online: true } })
)

subClient.onReconnected(() =>
    client.cache.writeData({ data: { online: true } })
)

subClient.onDisconnected(() =>
    client.cache.writeData({ data: { online: false } })
)

function App() {
  return (
    <ApolloProvider client={client}>
      <div className='App'>
        <div>
          <Stocks />
        </div>
      </div>
    </ApolloProvider>
  )
}

export default App
