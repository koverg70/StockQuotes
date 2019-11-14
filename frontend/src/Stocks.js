import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useSubscription } from '@apollo/client';
import Connected from './Connected';

const QUOTES_SUBSCRIPTION = gql`
  subscription onStockQuotes($stockCodes: [String!]) {
    stockQuotes(stockCodes: $stockCodes) {
      dateTime
      stockCode
      stockPrice
      stockPriceChange
    }
  }
`;

const Quote = ( { quote: { dateTime, stockCode, stockPrice, stockPriceChange } }) => {
    return (
        <div>
            <span><b>Dátum:</b> {dateTime}</span>&nbsp;
            <span><b>Név:</b> {stockCode}</span>&nbsp;
            <span><b>Ár:</b> {stockPrice}</span>&nbsp;
            <span><b>Változás:</b> {stockPriceChange}</span>&nbsp;
        </div>
    )
}

const Stocks = () => {
  const [stockList, setStockList] = useState({})
  const { data, loading } = useSubscription(
    QUOTES_SUBSCRIPTION,
    {
        variables: {  },
        onSubscriptionData: (data) => {
            const q = data.subscriptionData.data.stockQuotes
            setStockList({...stockList, [q.stockCode]: q})
        }
    }
  );
  return (
      <Connected>
        { !loading ?
          <div>
            Legutolsó: <Quote quote={data.stockQuotes} />
          </div>
          :
          null
        }
        <div>
            Összes:
            { 
                Object.keys(stockList).map((key) => (
                    <Quote key={key} quote={stockList[key]} />
                ))
            }
        </div>
      </Connected>
  )
}

export default Stocks