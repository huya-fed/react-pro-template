import React, { Component } from 'react'
import classNames from 'classnames'
import '../assets/sass/header.scss'

class Header extends Component {
  handleClick () {
    alert(1)
  }

  render () {
    const headerClass = classNames({
      "top-header": true,
      "flex": true
    })

    return (
      <header 
      		className={ headerClass } 
  	    	onClick={ this.handleClick.bind(this) }>
          {this.props.name}
  		</header>
    )
  }
}

export default Header