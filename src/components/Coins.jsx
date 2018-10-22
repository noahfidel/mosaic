import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import fetch from 'isomorphic-fetch';
import { nFormatter } from '../util';

class Coins extends Component {
  constructor() {
    super();
    this.state = {
      coinData: [],
    };
  }

  componentDidMount() {
    // Call CoinMarketCap API
    let i;
    for (i = 1; i < 3; i += 1) {
      fetch(`https://api.coinmarketcap.com/v2/ticker/${i}/`)
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((responseData) => {
          const { data } = responseData;
          const { coinData } = this.state;
          this.setState({
            coinData: coinData.concat({
              name: data.name,
              symbol: data.symbol,
              circulating_supply: nFormatter(data.circulating_supply, 1),
              price: data.quotes.USD.price.toFixed(2),
              market_cap: nFormatter(data.quotes.USD.market_cap, 1),
              percent_change_24h: `${nFormatter(data.quotes.USD.percent_change_24h, 2)}%`,
              percent_change_1h: data.quotes.USD.percent_change_1h,
              percent_change_7d: data.quotes.USD.percent_change_7d,
              volume_24h: nFormatter(data.quotes.USD.volume_24h, 2),
            }),
          });
        })
        .catch(error => console.log(error)); // eslint-disable-line no-console
    }
  }

  render() {
    const { coinData } = this.state;
    return (
      <div>
        <Route
          exact
          path="/coins"
          render={() => (
            <ReactTable
              columns={[
                {
                  Header: 'Name',
                  accessor: 'name',
                },
                {
                  Header: 'Symbol',
                  accessor: 'symbol',
                },
                {
                  Header: 'Price',
                  accessor: 'price',
                },
                {
                  Header: 'Market Cap',
                  accessor: 'market_cap',
                },
                {
                  Header: 'Volume',
                  accessor: 'volume_24h',
                },
                {
                  Header: 'Today',
                  accessor: 'percent_change_24h',
                },
              ]}
              data={coinData}
            />
          )
        }
        />
      </div>
    );
  }
}

export default Coins;
