import React from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { API_URL } from "../constants/API";
import { getCartData } from "../redux/actions/cart";

class Cart extends React.Component {
  state = {
    isCheckoutMode: false,
    recipientName: "",
    address: "",
    payment: 0,
  };

  deleteCartHandler = (cartId) => {
    Axios.delete(`${API_URL}/carts/${cartId}`)
      .then((result) => {
        this.props.getCartData(this.props.userGlobal.id);
      })
      .catch((err) => {
        alert("Gagal server");
      });
  };

  renderCart = () => {
    return this.props.cartGlobal.cartList.map((val) => {
      return (
        <tr>
          <td className="align-middle">{val.productName}</td>
          <td className="align-middle">{val.price}</td>
          <td className="align-middle">
            <img src={val.productImage} alt="" style={{ height: "125px" }} />
          </td>
          <td className="align-middle">{val.quantity}</td>
          <td className="align-middle">Rp {val.quantity * val.price}</td>
          <td className="align-middle">
            <button
              onClick={() => this.deleteCartHandler(val.id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  renderSubtotalPrice = () => {
    let subtotal = 0;
    for (let i = 0; i < this.props.cartGlobal.cartList.length; i++) {
      subtotal +=
        this.props.cartGlobal.cartList[i].price *
        this.props.cartGlobal.cartList[i].quantity;
    }
    return subtotal;
  };

  renderTaxFee = () => {
    return this.renderSubtotalPrice() * 0.05;
  };

  renderTotalPrice = () => {
    return this.renderSubtotalPrice() + this.renderTaxFee();
  };

  checkoutModeToggle = () => {
    this.setState({ isCheckoutMode: !this.state.isCheckoutMode });
  };

  inputHandler = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  payBtnHandler = () => {
    // 1. Post ke transacation
    // 2. Delete cart item

    if (this.state.payment < this.renderTotalPrice()) {
      alert(`Uang anda kurang ${this.renderTotalPrice() - this.state.payment}`);
      return;
    }

    if (this.state.payment > this.renderTotalPrice()) {
      alert(
        `Sukses anda mendapatkan kembalian ${
          this.state.payment - this.renderTotalPrice()
        }`
      );
    } else if (this.state.payment === this.renderTotalPrice()) {
      alert(`Terima kasih uang anda pas`);
    }

    const d = new Date();
    Axios.post(`${API_URL}/transactions`, {
      userId: this.props.userGlobal.id,
      address: this.state.address,
      recipientName: this.state.recipientName,
      totalPrice: parseInt(this.renderTotalPrice()),
      totalPayment: parseInt(this.state.payment),
      transactionsDate: `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`,
      transactionsItems: this.props.cartGlobal.cartList, // Array of objects -> cart
    })
      .then((result) => {
        alert("Berhasil Checkout");
        result.data.transactionsItems.forEach((val) => {
          this.deleteCartHandler(val.id);
        });
      })
      .catch((err) => {
        alert("Terjadi kelsahan di server");
      });
  };

  render() {
    return (
      <div className="p-5 text-center">
        <h1>Cart</h1>
        <div className="row mt-5">
          <div className="col-9">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{this.renderCart()}</tbody>
              <tfoot className="bg-light">
                <tr>
                  <td colspan="6">
                    <button
                      onClick={this.checkoutModeToggle}
                      className="btn btn-success"
                    >
                      CheckOut
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {this.state.isCheckoutMode ? (
            <div className="col-3">
              <div className="card " style={{ textAlign: "left" }}>
                <div className="card-header">
                  <strong>Order Summary</strong>
                </div>
                <div className="card-body">
                  <div className="d-flex my-2 flex-row justify-content-between align-items-center">
                    <span style={{ fontWeight: "bold" }}>Subtotal Price</span>
                    <span>Rp {this.renderSubtotalPrice()}</span>
                  </div>
                  <div className="d-flex my-2 flex-row justify-content-between align-items-center">
                    <span style={{ fontWeight: "bold" }}>Tax Fee (5%)</span>
                    <span>Rp {this.renderTaxFee()}</span>
                  </div>
                  <div className="d-flex my-2 flex-row justify-content-between align-items-center">
                    <span style={{ fontWeight: "bold" }}>Total Price</span>
                    <span>Rp {this.renderTotalPrice()}</span>
                  </div>
                </div>
                <div className="card-body border-top">
                  <label htmlFor="recipientName">Recipient Name</label>
                  <input
                    onChange={this.inputHandler}
                    type="text"
                    className="form-control mb-3"
                    name="recipientName"
                  />
                  <label htmlFor="address">Address</label>
                  <input
                    onChange={this.inputHandler}
                    type="text"
                    className="form-control"
                    name="address"
                  />
                </div>
                <div className="card-footer">
                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <input
                      onChange={this.inputHandler}
                      type="number"
                      name="payment"
                      className="form-control mx-1"
                    />
                    <button
                      onClick={this.payBtnHandler}
                      className="btn btn-success mx-1"
                    >
                      Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartGlobal: state.cart,
    userGlobal: state.user,
  };
};

const mapDispatchToProps = {
  getCartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
