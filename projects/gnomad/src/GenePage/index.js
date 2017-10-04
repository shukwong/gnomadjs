/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable space-before-function-paren */
/* eslint-disable no-shadow */
/* eslint-disable comma-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-case-declarations */

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withRouter, Route, Switch } from 'react-router-dom'
import GenePageHOC from '@broad/gene-page/src/containers/GenePage'

import GeneInfo from './GeneInfo'
import GeneSettings from './GeneSettings'
import GeneRegion from './RegionViewer'
import Table from './Table'
import VariantPage from './VariantPage'

import { fetchGene } from './fetch'

const GenePage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #FAFAFA;
  color: black;
  margin-left: 10px;
`

const Summary = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-left: 60px;
  margin-bottom: 10px;
`

const MainSection = styled.div`
  margin-left: 110px;
`


const AppGenePage = ({
  gene,
  isFetching,
  // match,
  // location,
  // history,
}) => {
  // console.log('current variant data', currentVariantData)
  // console.log('match', match)
  // console.log('location', location)
  // console.log('history', history)
  if (isFetching || !gene) {
    return <div>Loading...!</div>
  }
  return (
    <GenePage>
      <Summary>
        <GeneInfo
          gene={gene}
        />
      </Summary>
      <GeneRegion />
      <GeneSettings />
      <MainSection>
        {/* <Switch> */}
        {/* http://localhost:8010/gene/SCN5A/3-38591847-G-C */}
        <Route path={'/gene/:gene/:variantId'} component={VariantPage} />
        <Route exact path="/gene/:gene" component={Table} />
        {/* </Switch> */}
      </MainSection>
    </GenePage>
  )
}

AppGenePage.propTypes = {
  gene: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
}
AppGenePage.defaultProps = {
  gene: null,
}

export default withRouter(GenePageHOC(AppGenePage, fetchGene))
