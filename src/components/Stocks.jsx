import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import fetch from 'isomorphic-fetch';
import { nFormatter, percentChange } from '../util';

class Stocks extends Component {
  constructor() {
    // Initialize mutable state
    super();
    this.toggleColumn = this.toggleColumn.bind(this);
    this.filterList = this.filterList.bind(this);
    this.state = {
      stockData: [],
      filteredList: [],
      columns: [
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
          accessor: 'volume',
        },
        {
          Header: ({ column }) => (
            <Fragment>
              1D
              <button
                type="button"
                className="filter-toggle"
                onClick={this.toggleColumn}
                data-colid={column.id}
              >
                &nabla;
              </button>
            </Fragment>
          ),
          accessor: 'percent_change_1d',
        },
      ],
    };
  }

  componentDidMount() {
    // Call IEX API
    const comps = ['aapl', 'fb', 'gs', 'amzn', 'snap'];
    // const comps = ['aapl'];
    let i;
    for (i = 0; i < comps.length; i += 1) {
      let header = new Headers({
          'Access-Control-Allow-Origin':'*',
          'Content-Type': 'multipart/form-data',
      });
      let reqData = {
        header: header,
        mode: 'cors',
        method: 'GET',
        body: null,
      };
      let comp = {};
      let url = this.props.url + `${comps[i]}/`
      fetch(url, reqData)
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
          comp = {
            name: data.name,
            symbol: data.symbol,
            price: data.price,
            market_cap: data.market_cap,
            percent_change_1d: `${nFormatter(data.percent_change_1d, 2)}%`,
            percent_change_1w: `${nFormatter(data.percent_change_1w, 2)}%`,
            percent_change_1m: `${nFormatter(data.percent_change_1m, 2)}%`,
            volume: nFormatter(data.volume, 2),
          };
          const { stockData } = this.state;
          this.setState({
            stockData: stockData.concat(comp),
            filteredList: stockData.concat(comp),
          });
        })
        .catch(error => console.log(error)); // eslint-disable-line no-console
    }
  }

  toggleColumn() {
    const headers = [({ column }) => (
      <Fragment>
        1D
        <button
          type="button"
          className="filter-toggle"
          onClick={this.toggleColumn}
          data-colid={column.id}
        >
          &nabla;
        </button>
      </Fragment>
    ),
    ({ column }) => (
      <Fragment>
        1W
        <button
          type="button"
          className="filter-toggle"
          onClick={this.toggleColumn}
          data-colid={column.id}
        >
          &nabla;
        </button>
      </Fragment>
    ),
    ({ column }) => (
      <Fragment>
        1M
        <button
          type="button"
          className="filter-toggle"
          onClick={this.toggleColumn}
          data-colid={column.id}
        >
          &nabla;
        </button>
      </Fragment>
    )];
    const accessors = ['percent_change_1d', 'percent_change_1w', 'percent_change_1m'];
    const { columns } = this.state;
    const cols = columns.map(col => ((accessors.indexOf(col.accessor) !== -1)
      ? {
        ...col,
        Header: headers[(accessors.indexOf(col.accessor) + 2) % 3],
        accessor: accessors[(accessors.indexOf(col.accessor) + 2) % 3],
      } : col));
    this.setState({
      columns: cols,
    });
  }

  filterList(event) {
    let { stockData } = this.state;
    stockData = stockData.filter(item => item.symbol.toLowerCase().search(
      event.target.value.toLowerCase(),
    ) !== -1);
    this.setState({ filteredList: stockData });
  }

  render() {
    const { filteredList, columns } = this.state;
    return (
      <div>
        <form>
          <input type="text" placeholder="Search" onChange={this.filterList} />
        </form>
        <Route
          exact
          path="/(stocks|)"
          render={() => (
            <div>
              <ReactTable
                columns={columns}
                data={filteredList}
              />
            </div>
          )
        }
        />
      </div>
    );
  }
}

Stocks.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Stocks;
