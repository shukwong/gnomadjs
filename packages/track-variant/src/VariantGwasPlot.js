import { scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'
import { transparentize } from 'polished'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { getCategoryFromConsequence } from '@broad/utilities'

const exacClassicColors = {
  lof: transparentize(0.3, '#FF583F'),
  missense: transparentize(0.3, '#F0C94D'),
  synonymous: transparentize(0.3, 'green'),
  other: transparentize(0.3, '#757575'),
}

const getLogpScale = (height, yExtent, vPadding) =>
  scaleLinear()
    .domain(yExtent)
    .range([height - vPadding, vPadding])
    .nice()

const CANVAS_SCALE = window.devicePixelRatio || 1

export class VariantGwasPlot extends Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    scalePosition: PropTypes.func.isRequired,
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        allele_freq: PropTypes.number,
        consequence: PropTypes.string,
        pos: PropTypes.number.isRequired,
        variant_id: PropTypes.string.isRequired,
      })
    ).isRequired,
    vPadding: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }

  componentDidMount() {
    this.draw()
  }

  componentDidUpdate() {
    this.draw()
  }

  canvasRef = el => {
    this.ctx = el ? el.getContext('2d') : null
  }

  draw() {
    const { height, scalePosition, vPadding, variants, width } = this.props

    this.ctx.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0)
    this.ctx.clearRect(0, 0, width, height)
    this.ctx.lineWidth = 0.5
    this.ctx.strokeStyle = '#000'

    const yExtent = extent(variants, v => v.logp)
    const logpScale = getLogpScale(height, yExtent, vPadding)

    variants.forEach((variant, i) => {
      const markerX = scalePosition(variant.pos)
      const markerY = logpScale(variant.logp)

      let fill

      if (!variant.allele_freq) {
        fill = 'white'
      } else {
        const category = getCategoryFromConsequence(variant.consequence) || 'other'
        fill = exacClassicColors[category]
      }

      // if (.includes(i)) {
      //   fill = 'red'
      // }

      this.ctx.beginPath()
      // drawEllipse(this.ctx, markerX, markerY, rx, ry)
      this.ctx.arc(markerX, markerY, 3, 0, 2 * Math.PI)
      this.ctx.closePath()
      this.ctx.fillStyle = variant.color
      this.ctx.fill()
      this.ctx.stroke()
    })
  }

  render() {
    const { height, width } = this.props

    return (
      <canvas
        ref={this.canvasRef}
        height={height * CANVAS_SCALE}
        width={width * CANVAS_SCALE}
        style={{
          height: `${height}px`,
          width: `${width}px`,
        }}
      />
    )
  }
}
