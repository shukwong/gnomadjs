import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'

import { Track } from '@broad/region-viewer'

import { VariantGwasPlot } from './VariantGwasPlot'

const hPadding = 98
const vPadding = 5

const TitlePanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`

// eslint-disable-next-line react/prop-types
const leftPanel = ({ title = '', height, variants, width }) => {
  const yExtent = extent(variants, d => d.logp)
  const yScale = scaleLinear()
    .domain(yExtent)
    .range([height - vPadding, vPadding])
    .nice()

  const yAxisLabel = (
    <text x={5} y={height / 2} transform={`rotate(270 ${hPadding / 3} ${height / 2})`}>
      {'-log10(P)'}
    </text>
  )

  const yAxisTicks = (
    <g>
      {yScale.ticks().map(t => {
        return (
          <g key={t}>
            <text className="yTickText" textAnchor="middle" x={hPadding - 15} y={yScale(t) + 5}>
              {t}
            </text>
          </g>
        )
      })}
    </g>
  )

  return (
    <svg width={width} height={height}>
      {yAxisLabel}
      {yAxisTicks}
    </svg>
  )
}

export const VariantGwasTrack = ({ height, title, variants }) => (
  <Track title={title} renderLeftPanel={leftPanel} variants={variants} height={height}>
    {({ scalePosition, width }) => (
      <VariantGwasPlot
        height={height}
        scalePosition={scalePosition}
        variants={variants}
        width={width}
        vPadding={vPadding}
      />
    )}
  </Track>
)

VariantGwasTrack.propTypes = {
  height: PropTypes.number,
  title: PropTypes.string,
  variants: PropTypes.arrayOf(
    PropTypes.shape({
      allele_freq: PropTypes.number,
      consequence: PropTypes.string,
      pos: PropTypes.number.isRequired,
      variant_id: PropTypes.string.isRequired,
    })
  ).isRequired,
}

VariantGwasTrack.defaultProps = {
  height: 60,
  title: '',
}
