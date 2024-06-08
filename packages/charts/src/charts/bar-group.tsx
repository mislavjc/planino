'use client';

import React from 'react';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { Grid } from '@visx/grid';
import { Group } from '@visx/group';
import { LegendOrdinal } from '@visx/legend';
import { ParentSize } from '@visx/responsive';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { BarGroup } from '@visx/shape';
import { BarGroupBar } from '@visx/shape/lib/types';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';

import { formatCurrency } from '../lib/utils';

type DataRecord = Record<string, string>;

export type BarGroupProps<T extends DataRecord> = {
  data: T[];
  domainKey: keyof T;
};

const tailwindColors = {
  blue: '#60a5fa', // Tailwind blue-400
  green: '#34d399', // Tailwind green-400
  red: '#f87171', // Tailwind red-400
  yellow: '#fbbf24', // Tailwind yellow-400
  purple: '#a78bfa', // Tailwind purple-400
  pink: '#f472b6', // Tailwind pink-400
  orange: '#fb923c', // Tailwind orange-400
  teal: '#14b8a6', // Tailwind teal-400
  indigo: '#818cf8', // Tailwind indigo-400
  lime: '#a3e635', // Tailwind lime-400
};

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: '#333',
  color: 'white',
};

export const BarGroupChart = <T extends DataRecord>({
  data,
  domainKey,
}: BarGroupProps<T>) => {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<BarGroupBar<string>>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  const keys =
    data.length > 0 ? Object.keys(data[0]).filter((d) => d !== domainKey) : [];

  const getDomain = (d: T) => d[domainKey];

  const dateScale = scaleBand<string>({
    domain: data.map(getDomain),
    padding: 0.2,
  });

  const valueScale = scaleLinear<number>({
    domain: [
      0,
      Math.max(
        ...data.map((d) => Math.max(...keys.map((key) => Number(d[key])))),
      ),
    ],
    nice: true,
  });

  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: [
      tailwindColors.blue,
      tailwindColors.green,
      tailwindColors.red,
      tailwindColors.yellow,
      tailwindColors.purple,
      tailwindColors.pink,
      tailwindColors.orange,
      tailwindColors.teal,
      tailwindColors.indigo,
      tailwindColors.lime,
    ],
  });

  let tooltipTimeout: number;

  return (
    <ParentSize className="relative mt-4">
      {(parent) => {
        const { width, height } = parent;

        const margin = { top: 40, bottom: 40, left: 70, right: 20 };

        const xMax = width - margin.left - margin.right;
        const yMax = height - margin.top - margin.bottom;

        dateScale.rangeRound([0, xMax]);
        valueScale.range([yMax, 0]);

        const x1Scale = scaleBand<string>({
          domain: keys,
          padding: 0.1,
        });

        x1Scale.rangeRound([0, dateScale.bandwidth()]);

        return (
          <div className="relative">
            <svg ref={containerRef} width={width} height={height}>
              <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill="white"
                rx={14}
              />
              <Grid
                top={margin.top}
                left={margin.left}
                xScale={dateScale}
                yScale={valueScale}
                width={xMax}
                height={yMax}
                stroke="black"
                strokeOpacity={0.1}
                xOffset={dateScale.bandwidth() / 2}
              />
              <Group top={margin.top} left={margin.left}>
                <BarGroup
                  data={data}
                  keys={keys}
                  height={yMax}
                  x0={getDomain}
                  x0Scale={dateScale}
                  x1Scale={x1Scale}
                  yScale={valueScale}
                  color={colorScale}
                >
                  {(barGroups) =>
                    barGroups.map((barGroup) => (
                      <Group
                        key={`bar-group-${barGroup.index}-${barGroup.x0}`}
                        left={barGroup.x0}
                      >
                        {barGroup.bars.map((bar) => (
                          <rect
                            key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                            x={bar.x}
                            y={bar.y}
                            width={bar.width}
                            height={bar.height}
                            fill={bar.color}
                            onMouseLeave={() => {
                              tooltipTimeout = window.setTimeout(() => {
                                hideTooltip();
                              }, 300);
                            }}
                            onMouseMove={(event) => {
                              if (tooltipTimeout) clearTimeout(tooltipTimeout);
                              const eventSvgCoords = localPoint(event);
                              const left = bar.x + bar.width / 2;

                              showTooltip({
                                tooltipData: bar,
                                tooltipTop: eventSvgCoords?.y,
                                tooltipLeft: left,
                              });
                            }}
                          />
                        ))}
                      </Group>
                    ))
                  }
                </BarGroup>
              </Group>
              <AxisBottom
                top={yMax + margin.top}
                left={margin.left}
                scale={dateScale}
                stroke="black"
                tickStroke="black"
                tickLabelProps={{
                  fill: 'black',
                  fontSize: 10,
                  textAnchor: 'middle',
                  fontFamily: 'monospace',
                }}
              />
              <AxisLeft
                scale={valueScale}
                top={margin.top}
                left={margin.left}
                stroke="black"
                tickStroke="black"
                tickLabelProps={(label) => {
                  if (label === 0) return { display: 'none' };

                  return {
                    fill: 'black',
                    fontSize: 10,
                    textAnchor: 'end',
                    dx: '-0.25em',
                    dy: '0.15em',
                    fontFamily: 'monospace',
                  };
                }}
                tickFormat={(value) =>
                  value.toLocaleString('en-HR', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                }
              />
            </svg>
            <div
              className="absolute flex w-full justify-center text-smo overflow-auto"
              style={{
                top: margin.top / 2 - 24,
              }}
            >
              <LegendOrdinal
                scale={colorScale}
                direction="row"
                labelMargin="0 1rem 0 0"
              />
            </div>
            {tooltipOpen && tooltipData && (
              <TooltipInPortal
                top={tooltipTop}
                left={tooltipLeft}
                style={tooltipStyles}
              >
                <div className="flex flex-col justify-center gap-1 p-1">
                  <div style={{ color: colorScale(tooltipData.key) }}>
                    <strong>{tooltipData.key}</strong>
                  </div>
                  <div className="font-mono">
                    {formatCurrency(Number(tooltipData.value))}
                  </div>
                </div>
              </TooltipInPortal>
            )}
          </div>
        );
      }}
    </ParentSize>
  );
};
