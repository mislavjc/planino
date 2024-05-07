'use client';

import React from 'react';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { Grid } from '@visx/grid';
import { Group } from '@visx/group';
import { LegendOrdinal } from '@visx/legend';
import { ParentSize } from '@visx/responsive';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { BarStack } from '@visx/shape';
import { SeriesPoint } from '@visx/shape/lib/types';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';

import { cn } from 'lib/utils';

type TooltipData = {
  bar: SeriesPoint<{
    year: string;
    [key: string]: number | string | null;
  }>;
  key: string;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

interface TransformedExpenseRecord {
  year: string;
  [key: string]: string | number | null;
}

export type BarStackProps = {
  data: TransformedExpenseRecord[];
  className?: string;
};

// Define color variables using Tailwind colors
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

export const BarStackChart = ({ data, className }: BarStackProps) => {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  const keys = Object.keys(data[0]).filter((d) => d !== 'year');

  const valueTotals = data.reduce((allTotals, currentYear) => {
    const totalValue = keys.reduce((dailyTotal, k) => {
      dailyTotal += Number(currentYear[k as keyof TransformedExpenseRecord]);
      return dailyTotal;
    }, 0);
    allTotals.push(totalValue);
    return allTotals;
  }, [] as number[]);

  const getYear = (d: TransformedExpenseRecord) => d.year.toString();

  const dateScale = scaleBand<string>({
    domain: data.map(getYear),
    padding: 0.2,
  });
  const valueScale = scaleLinear<number>({
    domain: [0, Math.max(...valueTotals)],
    nice: true,
  });
  const colorScale = scaleOrdinal({
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
    <ParentSize className={cn('relative mt-4', className)}>
      {(parent) => {
        const { width, height } = parent;

        const margin = { top: 20, bottom: 40, left: 70, right: 20 };

        const xMax = width - margin.left - margin.right;
        const yMax = height - margin.top - margin.bottom;

        dateScale.rangeRound([0, xMax]);
        valueScale.range([yMax, 0]);

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
                <BarStack
                  data={data}
                  keys={keys.map((key) => key)}
                  x={getYear}
                  xScale={dateScale}
                  yScale={valueScale}
                  color={colorScale}
                >
                  {(barStacks) =>
                    barStacks.map((barStack) =>
                      barStack.bars.map((bar) => (
                        <rect
                          key={`bar-stack-${barStack.index}-${bar.index}`}
                          x={bar.x}
                          y={bar.y}
                          height={bar.height}
                          width={bar.width}
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
                      )),
                    )
                  }
                </BarStack>
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
              className="absolute flex  w-full justify-center text-sm"
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
                    {new Intl.NumberFormat('en-HR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(Number(tooltipData.bar.data[tooltipData.key]))}
                  </div>
                  <div>
                    <small>{tooltipData.bar.data.year}</small>
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
