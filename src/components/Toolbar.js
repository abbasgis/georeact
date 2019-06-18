import React from "react";
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem} from "reactstrap";
import {connect} from 'react-redux';

class Toolbar extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isOpen: false
        }
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.toggle3D = this.toggle3D.bind(this);
    }
    toggleNavbar() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
    toggle3D() {
        // this.ol3d.setEnabled(this.props.isEnable3D);
        this.props.handleEnable3D();
    }
    render(){
        return(
            <Navbar color="dark" dark expand="md" style={{padding: '0px'}}>
                <NavbarBrand style={{"paddingLeft": "15px", color: '#ffffff'}}>Map Panel</NavbarBrand>
                <NavbarToggler onClick={this.toggleNavbar} className="ml-auto"/>
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav navbar>
                        <NavItem>
                            <button onClick={this.toggle3D}
                                    className={"btn btn-primary btn-light text-dark"}>
                                3-D
                            </button>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        )
    }
}

const mapStateToProps = (state) =>{
    // return {
    //     isEnable3D : state.enable3D
    // }
    return state;
}
const mapDispatchToProps = (dispatch) =>{
    return {
        handleEnable3D: (evt) => {
            // console.log("handle input change...");
            dispatch({type: 'TOGGLE_3D_CHANGE'})
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);