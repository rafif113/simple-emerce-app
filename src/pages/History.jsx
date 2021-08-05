import React from "react";
import Axios from "axios";
import { API_URL } from "../constants/API";
import { connect } from "react-redux";

class History extends React.Component {
  state = {
    transactionList: [],
    transactionDetails: [],
  };

  fetchTranscations = () => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        userId: this.props.userGlobal.id,
      },
    })
      .then((result) => {
        console.log(result.data);
        this.setState({ transactionList: result.data });
      })
      .catch((err) => {
        alert(`Error server ${err}`);
      });
  };

  seeDetailsBtnHandler = (transactionDetails) => {
    this.setState({ transactionDetails });
  };

  renderTransactions = () => {
    return this.state.transactionList.map((val) => {
      return (
        <tr>
          <td>{val.transactionsDate}</td>
          <td>{val.transactionsItems.length} items</td>
          <td>Rp {val.totalPrice}</td>
          <td>
            <button
              onClick={() => this.seeDetailsBtnHandler(val.transactionsItems)}
              className="btn btn-info text-white"
            >
              See details
            </button>
          </td>
        </tr>
      );
    });
  };

  renderTransactionDetailItems = () => {
    return this.state.transactionDetails.map((val) => {
      return (
        <div className="d-flex my-2 flex-row justify-content-between align-items-center">
          <span className="font-weight-bold">
            {val.productName} ({val.quantity})
          </span>
          <span>Rp {val.price * val.quantity}</span>
        </div>
      );
    });
  };

  componentDidMount() {
    this.fetchTranscations();
  }

  render() {
    return (
      <div className="p-5">
        <h1>Transaction History</h1>
        <div className="row mt-5">
          <div className="col-8">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th>Transaction Date</th>
                  <th>Total Items</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{this.renderTransactions()}</tbody>
            </table>
          </div>
          <div className="col-4">
            {this.state.transactionDetails.length ? (
              <div className="card">
                <div className="card-header">
                  <strong>Transaction Detail</strong>
                </div>
                <div className="card-body">
                  {this.renderTransactionDetailItems()}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

export default connect(mapStateToProps)(History);
