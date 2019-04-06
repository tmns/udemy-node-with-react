import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {

    renderContent() {
        switch (this.props.auth) {
            case null:
                return;
            case false:
                return <li><a href="/auth/google">Login With Google!</a></li>
            default:
                return <li><a href="/api/logout">Logout</a></li>
        }
    }

    render() {
        console.log(this.props)
        return (
            <nav>
                <div className="nav-wrapper">
                    <Link
                        to={this.props.auth ? '/surveys' : '/'}
                        className="left brand-logo"
                        style={{ paddingLeft: '15px' }}
                    >
                        Emaily
                    </Link>
                    <ul className="right">
                        {this.renderContent()}
                    </ul>
                </div>
            </nav>
        );
    }
}

function mapStateToProps({ auth }) { // uses destructuring to take { auth } from passed in state
    return { auth } // equivalent to { auth: auth }
}

export default connect(mapStateToProps)(Header);