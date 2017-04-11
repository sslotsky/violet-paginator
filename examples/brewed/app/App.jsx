import React from 'react'
import PropTypes from 'prop-types'
import Recipes from './recipes/Index'

export default function App() {
  return (
    <div>
      <div className="alert">
        <center>
          <h1>PaginateThis</h1>
          <a target="_blank" href="https://github.com/@orange-marmalade/paginate-this" className="btn">
            <span className="fa fa-github">
              View On Github
            </span>
          </a>
        </center>
      </div>
      <Recipes />
    </div>
  )
}

App.propTypes = {
  children: PropTypes.object
}
