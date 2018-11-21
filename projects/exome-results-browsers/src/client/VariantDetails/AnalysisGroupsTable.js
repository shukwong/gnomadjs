import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'

import { BaseTable } from '@broad/ui'

import sortByGroup from '../sortByGroup'

function formatExponential(number) {
  return Number(number.toPrecision(4)).toExponential()
}

export function BaseAnalysisGroupsTable({ groups }) {
  return (
    <BaseTable>
      <thead>
        <tr>
          <th scope="col">Group</th>
          <th scope="col">AC Case</th>
          <th scope="col">AN Case</th>
          <th scope="col">AC Ctrl</th>
          <th scope="col">AN Ctrl</th>
          <th scope="col">AF Case</th>
          <th scope="col">AF Ctrl</th>
          <th scope="col">P-value</th>
          <th scope="col">Beta</th>
        </tr>
      </thead>
      <tbody>
        {sortByGroup([...groups]).map(group => (
          <tr key={group.analysis_group}>
            <th scope="row">{group.analysis_group}</th>
            <td>{group.ac_case}</td>
            <td>{group.an_case}</td>
            <td>{group.ac_ctrl}</td>
            <td>{group.an_ctrl}</td>
            <td>{group.an_case === 0 ? 0 : formatExponential(group.ac_case / group.an_case)}</td>
            <td>{group.an_ctrl === 0 ? 0 : formatExponential(group.ac_ctrl / group.an_ctrl)}</td>
            <td>{group.p}</td>
            <td>{group.se}</td>
          </tr>
        ))}
      </tbody>
    </BaseTable>
  )
}

BaseAnalysisGroupsTable.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      analysis_group: PropTypes.string.isRequired,
      ac_case: PropTypes.number.isRequired,
      an_case: PropTypes.number.isRequired,
      ac_ctrl: PropTypes.number.isRequired,
      an_ctrl: PropTypes.number.isRequired,
      p: PropTypes.number,
      se: PropTypes.number,
    })
  ).isRequired,
}

const analysisGroupsQuery = gql`
  query AnalysisGroups($variantId: String) {
    groups: analysisGroups(variant_id: $variantId) {
      analysis_group
      ac_case
      an_case
      ac_ctrl
      an_ctrl
      p
      se
    }
  }
`

const ConnectedAnalysisGroupsTable = graphql(analysisGroupsQuery, {
  options: ({ variantId }) => ({
    variables: { variantId },
    errorPolicy: 'ignore',
  }),
})(({ data: { loading, groups } }) => {
  if (loading) {
    return <span>Loading groups...</span>
  }
  return <BaseAnalysisGroupsTable groups={groups} />
})

export default ConnectedAnalysisGroupsTable
