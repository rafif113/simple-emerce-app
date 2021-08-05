import React, { Component } from "react";
import {
  Navbar,
  Nav,
  NavItem,
  NavbarText,
  UncontrolledDropdown,
  DropdownToggle,
  NavbarBrand,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/user";
class MyNavbar extends Component {
  render() {
    return (
      <div>
        <Navbar color="faded" light className="px-4">
          <NavbarBrand>
            <Link to="/" style={{ textDecoration: "none" }}>
              Emerce
            </Link>
          </NavbarBrand>
          <Nav>
            {this.props.userGlobal.username ? (
              <>
                <NavItem className="d-flex justify-content-center">
                  <NavbarText>
                    Hello, {this.props.userGlobal.fullName}
                  </NavbarText>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Pages
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      <Link to="/cart">
                        Cart ({this.props.cartGlobal.cartList.length})
                      </Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link to="/history">History</Link>
                    </DropdownItem>
                    {this.props.userGlobal.role === "admin" ? (
                      <DropdownItem>
                        <Link to="/admin">Admin</Link>
                      </DropdownItem>
                    ) : null}
                    <DropdownItem divider />
                    <DropdownItem onClick={this.props.logoutUser}>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </>
            ) : (
              <NavItem>
                <NavbarText>
                  <Link to="/login">Login</Link> |{" "}
                  <Link to="/register">Register</Link>
                </NavbarText>
              </NavItem>
            )}
          </Nav>
        </Navbar>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
    cartGlobal: state.cart,
  };
};

const mapDispatchToProps = {
  logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyNavbar);
