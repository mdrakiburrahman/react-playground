import './App.css';
import { FluentProvider, webLightTheme, Button } from "@fluentui/react-components";
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { getRTL } from '@fluentui/react/lib/Utilities';
import { IChartProps, ILineChartProps, LineChart, DataVizPalette } from '@fluentui/react-charting';
import { IColumn, buildColumns, SelectionMode, IListProps } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import { Image, ImageFit } from '@fluentui/react/lib/Image';
import { ITheme, mergeStyleSets, getTheme, getFocusStyle } from '@fluentui/react/lib/Styling';
import { List } from '@fluentui/react/lib/List';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { useSetInterval, useConst } from '@fluentui/react-hooks';
import * as d3 from 'd3-format';
import * as React from 'react';

// =================================
//               Info
// =================================
const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;
const classNames = mergeStyleSets({
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 54,
      padding: 10,
      boxSizing: 'border-box',
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      display: 'flex',
      selectors: {
        '&:hover': { background: palette.neutralLight },
      },
    },
  ],
  itemImage: {
    flexShrink: 0,
  },
  itemContent: {
    marginLeft: 10,
    overflow: 'hidden',
    flexGrow: 1,
  },
  itemHeader: [
    fonts.xLarge,
    {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontWeight: 'bold',
      color: palette.neutralSecondary,
      textTransform: 'uppercase',
    },
  ],
  itemName: [
    fonts.large,
    {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontWeight: 'bold',
    },
  ],
  itemIndex: {
    fontSize: fonts.small.fontSize,
    color: palette.neutralTertiary,
    marginBottom: 10,
  },
  itemDescription: {
    fontSize: fonts.medium.fontSize,
    color: palette.neutralPrimary,
    marginBottom: 10,
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: 10,
    color: palette.neutralTertiary,
    fontSize: fonts.large.fontSize,
    flexShrink: 0,
  },
});

export interface IHeaderItem {
  thumbnail: string;
  title: string;
  subtitle: string;
  description: string;
}

const conceptMap: Record<string, IHeaderItem> = {
  AI_OPS: {
    thumbnail: 'https://arcdataciadomisc.blob.core.windows.net/media/svgs/PredictiveAnalytics.svg',
    title: 'AIOps for SQL Server',
    subtitle: 'Predictive Intelligence for SQL Server, hosted anywhere',
    description: `AIOps applies Artificial Intelligence and Big Data Processing to enhance IT Operation efficiency
    using Microsoft's Intelligent Data Platform.`,
  },
  COPILOT: {
    thumbnail: 'https://arcdataciadomisc.blob.core.windows.net/media/svgs/Copilot.svg',
    title: 'Microsoft Copilot for SQL Server',
    subtitle: 'Applying private LLM models hosted by SQL Server',
    description: `Microsoft Copilot leverages AI to help you understand your SQL Serverinformation better with a simple chat
    interface. Microsoft never shares your data with external parties - only aggregated, non-PII data is visible to the LLM.`,
  },
};

const dataSourceMap: Record<string, IHeaderItem> = {
  TELEMETRY: {
    thumbnail: 'https://arcdataciadomisc.blob.core.windows.net/media/svgs/Telemetry.svg',
    title: 'Telemetry Plugin',
    subtitle: 'Collecting system telemetry, non-PII data',
    description: `The Arc SQL Server extension periodically collects telemetry (such as DMV metrics) and logs (Arc Extension logs)
    from the SQL Server instances and databases hosted on-premises or in the cloud.`,
  },
  HEARTBEAT: {
    thumbnail: 'https://arcdataciadomisc.blob.core.windows.net/media/svgs/Heartbeat.svg',
    title: 'Heartbeat and Health Plugin',
    subtitle: 'Continuous non-intrusive monitoring of Instance health',
    description: `The Arc SQL Server extension periodically probes various key components of the SQL Server Engine to create a
    health model of your SQL Server Instance, Availability Groups and more.`,
  },
  ARC_EXTENSION_STATUS: {
    thumbnail: 'https://arcdataciadomisc.blob.core.windows.net/media/svgs/ArcServer.svg',
    title: 'Arc Server Telemetry',
    subtitle: 'Common telemetry collected from all Arc extensions',
    description: `The Arc Server Platform collects telemetry from all Arc extensions, such as deployment and upgrade metrics.
    This data is used by Arc SQL Server AIOps platform to aggregate and analyze the health of the SQL Server Extension.`,
  },
  AZURE_RESOURCE_MANAGER: {
    thumbnail: 'https://arcdataciadomisc.blob.core.windows.net/media/svgs/ARM.svg',
    title: 'Azure Resource Manager',
    subtitle: 'Common telemetry collected from ARM Control Plane',
    description: `Azure Resource Manager - or ARM - collects Control Plane telemetry, such as operations performed against the 
    SQL Server Instance or Arc-enabled Server. This data is used by Arc SQL Server AIOps platform to correlate events.`,
  },
};

const createConceptItems = (): IHeaderItem[] => {
  return [
    conceptMap.AI_OPS,
    conceptMap.COPILOT,
  ];
};

const createDataSourceItems = (): IHeaderItem[] => {
  return [
    dataSourceMap.TELEMETRY,
    dataSourceMap.HEARTBEAT,
    dataSourceMap.ARC_EXTENSION_STATUS,
    dataSourceMap.AZURE_RESOURCE_MANAGER,
  ];
};

enum HeaderType {
  Concept = 'Concept',
  DataSource = 'DataSource',
}

const onRenderCell = (item: IHeaderItem | undefined, index: number | undefined): JSX.Element => {

  if (!item) {
    return <></>;
  }

  return (
    <div className={classNames.itemCell} data-is-focusable={true}>
      <Image
        className={classNames.itemImage}
        src={item.thumbnail}
        width={25}
        height={25}
        imageFit={ImageFit.cover}
      />
      <div className={classNames.itemContent}>
        <div className={classNames.itemName}>{item.title}</div>
        <div className={classNames.itemIndex}>{`${item.subtitle}`}</div>
        <div className={classNames.itemDescription}>{`${item.description}`}</div>
      </div>
      <Icon className={classNames.chevron} iconName={getRTL() ? 'ChevronLeft' : 'ChevronRight'} />
    </div>
  );
};

export const ListBasicExample: React.FunctionComponent<{ headerType: HeaderType }> = ({ headerType }) => {

  let items: IHeaderItem[] = [];

  switch (headerType) {
    case HeaderType.Concept:
      items = createConceptItems();
      break;
    case HeaderType.DataSource:
      items = createDataSourceItems();
      break;
  }

  return (
    <FocusZone direction={FocusZoneDirection.vertical}>
      <List items={items} onRenderCell={onRenderCell} />
    </FocusZone>
  );
};

// =================================
//               Table
// =================================
interface IShimmerApplicationExampleState {
  lastIntervalId: number;
  visibleCount: number;
}

export interface IRootCauseDescription {
  thumbnail: string;
  id: string;
  description: string;
  timestamp: string;
  payload: string;
}

export interface IRootCauseItem {
  thumbnail: string;
  time: string;
  id: string;
  description: string;
  payload: string;
}

const shimmeredDetailsListProps: IListProps = {
  renderedWindowsAhead: 0,
  renderedWindowsBehind: 0,
};

const onRenderItemColumn = (item?: any, index?: number | undefined, column?: IColumn | undefined): React.ReactNode => {
  if (!item) {
    return null;
  }

  if (column?.key === 'thumbnail') {
    return <img src={item.thumbnail} alt="" />;
  }
  return item[column?.key as keyof IRootCauseItem];
};


const rootCauseMap: Record<string, IRootCauseDescription> = {
  TRX_UNUSUAL_VOLUME: {
    thumbnail: 'https://arcdataciadomisc.blob.core.windows.net/media/svgs/SqlServerInstancesDatabasesArc.svg',
    id: 'TRX_UNUSUAL_VOLUME',
    description: 'Unusual number of transactions detected',
    timestamp: '2024-02-03T09:17:30.000Z',
    payload: '{writeTransactionsPerSec: 1969.0, writeTransactionsPerSecHistoricalAverage: 132.5}',
  },
  ABNORMAL_LOG_GROWTH: {
    thumbnail: 'https://arcdataciadomisc.blob.core.windows.net/media/svgs/SqlServerInstancesDatabasesArc.svg',
    id: 'ABNORMAL_LOG_GROWTH',
    description: 'Database logs are growing abnormally',
    timestamp: '2024-02-03T09:17:30.000Z',
    payload: '{allocatedSizeInGb: 26.1875, fileSizeInGb: 22.0625, writeTransactionsPerSec: 1969.0, logFlushesPerSec: 281.0, logGrowths: 0.0, logFlushWaitTime: 567.0, minsTillFullPredicted: 13}',
  },
  HIGH_REPLICA_LAG: {
    thumbnail: 'https://arcdataciadomisc.blob.core.windows.net/media/svgs/HighAvailability.svg',
    id: 'HIGH_REPLICA_LAG',
    description: 'High secondary_lag_seconds detected, replica lag increased',
    timestamp: '2024-02-03T09:20:00.000Z',
    payload: '{secondaryLagSeconds: 120, continuousDurationInMinutes: 5}',
  },
  TRX_DEADLOCK: {
    thumbnail: 'https://arcdataciadomisc.blob.core.windows.net/media/svgs/Deadlock.svg',
    id: 'TRX_DEADLOCK',
    description: 'High rate of transaction deadlocks detected',
    timestamp: '2024-02-03T09:22:30.000Z',
    payload: '{transactionDeadlocksPerSec: 5, continuousDurationInMinutes: 3}',
  },
  HADR_SEEDING_FAILURES: {
    thumbnail: 'https://arcdataciadomisc.blob.core.windows.net/media/svgs/HighAvailability.svg',
    id: 'HADR_SEEDING_FAILURES',
    description: 'High rate of seeding failures detected',
    timestamp: '2024-02-03T19:30:00.000Z',
    payload: '{consecutiveFailedSeedingAttempts: 8}',
  },
  TRX_REJECTED_RESOURCE_CONSTRAINTS: {
    thumbnail: 'https://arcdataciadomisc.blob.core.windows.net/media/svgs/Resource.svg',
    id: 'TRX_REJECTED_RESOURCE_CONSTRAINTS',
    description: 'High rate of transactions rejected',
    timestamp: '2024-02-03T21:00:00.000Z',
    payload: '{consecutiveRejectedTransactions: 14}',
  },
  LOGIN_FAILURE: {
    thumbnail: 'https://arcdataciadomisc.blob.core.windows.net/media/svgs/User.svg',
    id: 'LOGIN_FAILURE',
    description: 'High rate of login failures detected',
    timestamp: '2024-02-03T23:00:00.000Z',
    payload: '{loginFailuresPerSec: 3}',
  }
};

const internalCreateListItems = (): IRootCauseItem[] => {
  return [
    {
      thumbnail: rootCauseMap.TRX_UNUSUAL_VOLUME.thumbnail,
      time: rootCauseMap.TRX_UNUSUAL_VOLUME.timestamp,
      id: rootCauseMap.TRX_UNUSUAL_VOLUME.id,
      description: rootCauseMap.TRX_UNUSUAL_VOLUME.description,
      payload: rootCauseMap.TRX_UNUSUAL_VOLUME.payload,
    },
    {
      thumbnail: rootCauseMap.ABNORMAL_LOG_GROWTH.thumbnail,
      time: rootCauseMap.ABNORMAL_LOG_GROWTH.timestamp,
      id: rootCauseMap.ABNORMAL_LOG_GROWTH.id,
      description: rootCauseMap.ABNORMAL_LOG_GROWTH.description,
      payload: rootCauseMap.ABNORMAL_LOG_GROWTH.payload,
    },
    {
      thumbnail: rootCauseMap.HIGH_REPLICA_LAG.thumbnail,
      time: rootCauseMap.HIGH_REPLICA_LAG.timestamp,
      id: rootCauseMap.HIGH_REPLICA_LAG.id,
      description: rootCauseMap.HIGH_REPLICA_LAG.description,
      payload: rootCauseMap.HIGH_REPLICA_LAG.payload,
    },
    {
      thumbnail: rootCauseMap.TRX_DEADLOCK.thumbnail,
      time: rootCauseMap.TRX_DEADLOCK.timestamp,
      id: rootCauseMap.TRX_DEADLOCK.id,
      description: rootCauseMap.TRX_DEADLOCK.description,
      payload: rootCauseMap.TRX_DEADLOCK.payload,
    },
    {
      thumbnail: rootCauseMap.HADR_SEEDING_FAILURES.thumbnail,
      time: rootCauseMap.HADR_SEEDING_FAILURES.timestamp,
      id: rootCauseMap.HADR_SEEDING_FAILURES.id,
      description: rootCauseMap.HADR_SEEDING_FAILURES.description,
      payload: rootCauseMap.HADR_SEEDING_FAILURES.payload,
    },
    {
      thumbnail: rootCauseMap.TRX_REJECTED_RESOURCE_CONSTRAINTS.thumbnail,
      time: rootCauseMap.TRX_REJECTED_RESOURCE_CONSTRAINTS.timestamp,
      id: rootCauseMap.TRX_REJECTED_RESOURCE_CONSTRAINTS.id,
      description: rootCauseMap.TRX_REJECTED_RESOURCE_CONSTRAINTS.description,
      payload: rootCauseMap.TRX_REJECTED_RESOURCE_CONSTRAINTS.payload,
    },
    {
      thumbnail: rootCauseMap.LOGIN_FAILURE.thumbnail,
      time: rootCauseMap.LOGIN_FAILURE.timestamp,
      id: rootCauseMap.LOGIN_FAILURE.id,
      description: rootCauseMap.LOGIN_FAILURE.description,
      payload: rootCauseMap.LOGIN_FAILURE.payload,
    }
  ];
};

const exampleItems: IRootCauseItem[] = internalCreateListItems();

export const ShimmerApplicationExample: React.FunctionComponent = () => {
  const { current: state } = React.useRef<IShimmerApplicationExampleState>({
    lastIntervalId: 0,
    visibleCount: 0,
  });

  const [items, setItems] = React.useState<(IRootCauseItem | null)[] | undefined>(undefined);

  const shimmerColumns: IColumn[] = useConst(() => {
    const currentItems = internalCreateListItems();
    const columns: IColumn[] = buildColumns(currentItems);
    for (const column of columns) {
      switch (column.key) {
        case 'thumbnail':
          column.name = 'FileType';
          column.minWidth = 16;
          column.maxWidth = 16;
          column.isIconOnly = true;
          column.iconName = 'Page';
          break;
        case 'time':
          column.minWidth = 150;
          column.maxWidth = 150;
          break;
        case 'id':
          column.minWidth = 250;
          column.maxWidth = 250;
          break;
        case 'description':
          column.minWidth = 400;
          column.maxWidth = 400;
          break;

      }
    }
    return columns;
  });

  const { setInterval, clearInterval } = useSetInterval();
  const generateRandomWaitTime = (): number => {
    const minDelay = 200;
    const maxDelay = 1500;
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  };

  React.useEffect(() => {
    const loadMoreItems = (): void => {
      state.visibleCount = Math.min(exampleItems.length, state.visibleCount + 2);
      setItems(exampleItems.map((current, index) => (index < state.visibleCount ? current : null)) as IRootCauseItem[]);
    };

    loadMoreItems();
    state.lastIntervalId = setInterval(loadMoreItems, generateRandomWaitTime());

    return () => {
      clearInterval(state.lastIntervalId);
    };
  }, [clearInterval, setInterval, state]);

  return (
    <div style={{ width: '100vw', height: '50vh', overflow: 'visible' }}>
      <ShimmeredDetailsList
        setKey="items"
        items={items || []}
        columns={shimmerColumns}
        selectionMode={SelectionMode.none}
        onRenderItemColumn={onRenderItemColumn}
        enableShimmer={!items}
        ariaLabelForShimmer="Content is being fetched"
        ariaLabelForGrid="Item details"
        listProps={shimmeredDetailsListProps}
      />
    </div>
  );
};



// =================================
//               Line Chart
// =================================

const calloutItemStyle = mergeStyles({
  borderBottom: '1px solid #D9D9D9',
  padding: '3px',
});

interface ILineChartEventsExampleState {
  width: number;
  height: number;
  allowMultipleShapes: boolean;
  customEventAnnotationColor: string | undefined;
}

export class LineChartEventsExample extends React.Component<{}, ILineChartEventsExampleState> {
  constructor(props: ILineChartProps) {
    super(props);
    this.state = {
      width: 800,
      height: 500,
      allowMultipleShapes: true,
      customEventAnnotationColor: DataVizPalette.highError,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <label htmlFor="changeWidth_Events">Width:</label>
        <input
          type="range"
          value={this.state.width}
          min={700}
          max={1200}
          onChange={this._onWidthChange}
          id="changeWidth_Events"
          aria-valuetext={`ChangeWidthSlider${this.state.width}`}
        />
        <label htmlFor="changeHeight_Events">Height:</label>
        <input
          type="range"
          value={this.state.height}
          min={200}
          max={1000}
          id="changeHeight_Events"
          onChange={this._onHeightChange}
          aria-valuetext={`ChangeHeightslider${this.state.height}`}
        />
        <div>{this._basicExample()}</div>
      </>
    );
  }

  private _onWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ width: parseInt(e.target.value, 10) });
  };
  private _onHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ height: parseInt(e.target.value, 10) });
  };

  private _basicExample(): JSX.Element {
    const data: IChartProps = {
      chartTitle: 'Line Chart',
      lineChartData: [
        {
          legend: 'Health Thresholds Breached',
          data: [
            {
              x: new Date('2024-02-01T00:00:00.000Z'),
              y: 0,
            },
            {
              x: new Date('2024-02-01T06:00:00.000Z'),
              y: 0,
            },
            {
              x: new Date('2024-02-01T12:00:00.000Z'),
              y: 0,
            },
            {
              x: new Date('2024-02-01T18:00:00.000Z'),
              y: 0,
            },
            {
              x: new Date('2024-02-02T00:00:00.000Z'),
              y: 0,
            },
            {
              x: new Date('2024-02-02T06:00:00.000Z'),
              y: 0,
            },
            {
              x: new Date('2024-02-02T12:00:00.000Z'),
              y: 0,
            },
            {
              x: new Date('2024-02-02T18:00:00.000Z'),
              y: 0,
            },
            {
              x: new Date('2024-02-03T00:00:00.000Z'),
              y: 0,
            },
            {
              x: new Date('2024-02-03T06:00:00.000Z'),
              y: 0,
            },
            {
              x: new Date('2024-02-03T12:00:00.000Z'),
              y: 0,
            },
            {
              x: new Date('2024-02-03T18:00:00.000Z'),
              y: .25,
            },
            {
              x: new Date('2024-02-03T18:10:00.000Z'),
              y: .30,
            },
            {
              x: new Date('2024-02-03T18:20:00.000Z'),
              y: .30,
            },
            {
              x: new Date('2024-02-03T18:30:00.000Z'),
              y: .50,
            },
            {
              x: new Date('2024-02-03T18:35:00.000Z'),
              y: .70,
            },
            {
              x: new Date('2024-02-03T18:37:00.000Z'),
              y: .90,
            },
            {
              x: new Date('2024-02-03T19:40:30.000Z'),
              y: .95,
            },
            {
              x: new Date('2024-02-03T19:45:00.000Z'),
              y: .99,
            },
            {
              x: new Date('2024-02-03T20:45:00.000Z'),
              y: .97,
            },
            {
              x: new Date('2024-02-03T21:15:00.000Z'),
              y: .98,
            },
            {
              x: new Date('2024-02-03T21:30:00.000Z'),
              y: .99,
            },
            {
              x: new Date('2024-02-03T21:45:00.000Z'),
              y: .99,
            },
            {
              x: new Date('2024-02-03T22:30:00.000Z'),
              y: .95,
            },
            {
              x: new Date('2024-02-04T00:00:00.000Z'),
              y: .85,
            },
            {
              x: new Date('2024-02-04T02:00:00.000Z'),
              y: .50,
            },
            {
              x: new Date('2024-02-04T05:00:00.000Z'),
              y: .30,
            },
            {
              x: new Date('2024-02-04T10:00:00.000Z'),
              y: .25,
            },
            {
              x: new Date('2024-02-04T14:00:00.000Z'),
              y: .15,
            },
            {
              x: new Date('2024-02-04T23:00:00.000Z'),
              y: .0,
            },
            {
              x: new Date('2024-02-05T00:00:00.000Z'),
              y: .0,
            },
            {
              x: new Date('2024-02-06T00:00:00.000Z'),
              y: .0,
            },
            {
              x: new Date('2024-02-07T00:00:00.000Z'),
              y: .0,
            }
          ],
          color: DataVizPalette.error,
          lineOptions: {
            lineBorderWidth: '4',
          },
        },
        {
          legend: 'Anomalies Detected',
          data: [
            {
              x: new Date('2024-02-01T00:00:00.000Z'),
              y: 0.0,
            },
            {
              x: new Date('2024-02-02T00:00:00.000Z'),
              y: 0.0,
            },
            {
              x: new Date('2024-02-02T18:00:00.000Z'),
              y: 0.0,
            },
            {
              x: new Date('2024-02-03T00:00:00.000Z'),
              y: 0.0,
            },
            {
              x: new Date('2024-02-03T09:30:00.000Z'),
              y: 0.7,
            },
            {
              x: new Date('2024-02-04T00:00:00.000Z'),
              y: 0.0,
            },
            {
              x: new Date('2024-02-05T00:00:00.000Z'),
              y: 0.0,
            },
            {
              x: new Date('2024-02-06T00:00:00.000Z'),
              y: 0.0,
            },
            {
              x: new Date('2024-02-07T00:00:00.000Z'),
              y: 0.0,
            },
          ],
          color: DataVizPalette.warning,
          lineOptions: {
            lineBorderWidth: '4',
          },
        },
      ],
    };

    const rootStyle = {
      width: `${this.state.width}px`,
      height: `${this.state.height}px`,
    };

    return (
      <div style={rootStyle}>
        <LineChart
          data={data}
          legendsOverflowText={'Overflow Items'}
          yMinValue={0}
          yMaxValue={1}
          yAxisTickFormat={d3.format('.0%')}
          tickFormat={'%m/%d %H:%M:%S'}
          allowMultipleShapesForPoints={this.state.allowMultipleShapes}
          tickValues={[
            new Date('2024-02-01'),
            new Date('2024-02-02'),
            new Date('2024-02-03'),
            new Date('2024-02-04'),
            new Date('2024-02-05'),
            new Date('2024-02-06'),
            new Date('2024-02-07'),
          ]}
          eventAnnotationProps={{
            //
            // Good errors: https://eng.ms/docs/cloud-ai-platform/azure-data/azure-data-azure-databases/sql-/sql-availability-and-geodr/sql-availability-and-geodr/trdb0023-sterling-log-full-error-9002
            //
            events: [
              {
                event: rootCauseMap.TRX_UNUSUAL_VOLUME.id,
                date: new Date(rootCauseMap.TRX_UNUSUAL_VOLUME.timestamp),
                onRenderCard: () => <div className={calloutItemStyle}>Unusual number of transactions detected</div>,
              },
              {
                event: rootCauseMap.ABNORMAL_LOG_GROWTH.id,
                date: new Date(rootCauseMap.ABNORMAL_LOG_GROWTH.timestamp),
                onRenderCard: () => <div className={calloutItemStyle}>Database logs growing abnormally</div>,
              },
              {
                event: rootCauseMap.HIGH_REPLICA_LAG.id,
                date: new Date(rootCauseMap.HIGH_REPLICA_LAG.timestamp),
                onRenderCard: () => <div className={calloutItemStyle}>High secondary_lag_seconds detected, replica lag increased</div>,
              },
              {
                event: rootCauseMap.TRX_DEADLOCK.id,
                date: new Date(rootCauseMap.TRX_DEADLOCK.timestamp),
                onRenderCard: () => <div className={calloutItemStyle}>Multiple transaction deadlocks detected</div>,
              },
              {
                event: rootCauseMap.HADR_SEEDING_FAILURES.id,
                date: new Date(rootCauseMap.HADR_SEEDING_FAILURES.timestamp),
                onRenderCard: () => <div className={calloutItemStyle}>Multiple consecutive seeding failures detected</div>,
              },
              {
                event: rootCauseMap.TRX_REJECTED_RESOURCE_CONSTRAINTS.id,
                date: new Date(rootCauseMap.TRX_REJECTED_RESOURCE_CONSTRAINTS.timestamp),
                onRenderCard: () => <div className={calloutItemStyle}>Multiple transactions rejected</div>,
              },
              {
                event: rootCauseMap.LOGIN_FAILURE.id,
                date: new Date(rootCauseMap.LOGIN_FAILURE.timestamp),
                onRenderCard: () => <div className={calloutItemStyle}>Multiple login failures detected.</div>,
              }
            ],
            strokeColor: this.state.customEventAnnotationColor,
            labelColor: this.state.customEventAnnotationColor,
            labelHeight: 18,
            labelWidth: 50,
            mergedLabel: (count: number) => `${count} alerts`,
          }}
          height={this.state.height}
          width={this.state.width}
          enablePerfOptimization={true}
          yAxisTitle={'Severity (%)'}
          xAxisTitle={'Time'}
        />
      </div>
    );
  }
}

const copilotSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="none">
    <path d="M34.1423 7.32501C33.5634 5.35387 31.7547 4 29.7003 4L28.3488 4C26.1142 4 24.1985 5.59611 23.7952 7.79398L21.4805 20.4072L22.0549 18.4419C22.6319 16.4679 24.4419 15.1111 26.4986 15.1111H34.3524L37.6462 16.3942L40.8213 15.1111H39.8946C37.8401 15.1111 36.0315 13.7572 35.4525 11.7861L34.1423 7.32501Z" fill="url(#paint0_radial_56201_15503)"></path>
    <path d="M14.3307 40.656C14.9032 42.6366 16.7165 44 18.7783 44H21.6486C24.1592 44 26.2122 41.999 26.2767 39.4893L26.5893 27.3271L25.9354 29.5602C25.3577 31.5332 23.5481 32.8889 21.4923 32.8889L13.5732 32.8889L10.7499 31.3573L7.69336 32.8889H8.60461C10.6663 32.8889 12.4796 34.2522 13.0521 36.2329L14.3307 40.656Z" fill="url(#paint1_radial_56201_15503)"></path>
    <path d="M29.4993 4H13.46C8.87732 4 6.12772 10.0566 4.29466 16.1132C2.12296 23.2886 -0.718769 32.8852 7.50252 32.8852H14.4282C16.4978 32.8852 18.3147 31.5168 18.8835 29.5269C20.0876 25.3143 22.1978 17.9655 23.8554 12.3712C24.6977 9.52831 25.3993 7.08673 26.4762 5.56628C27.0799 4.71385 28.086 4 29.4993 4Z" fill="url(#paint2_linear_56201_15503)"></path>
    <path d="M29.4993 4H13.46C8.87732 4 6.12772 10.0566 4.29466 16.1132C2.12296 23.2886 -0.718769 32.8852 7.50252 32.8852H14.4282C16.4978 32.8852 18.3147 31.5168 18.8835 29.5269C20.0876 25.3143 22.1978 17.9655 23.8554 12.3712C24.6977 9.52831 25.3993 7.08673 26.4762 5.56628C27.0799 4.71385 28.086 4 29.4993 4Z" fill="url(#paint3_linear_56201_15503)"></path>
    <path d="M18.498 44H34.5374C39.12 44 41.8696 37.9424 43.7027 31.8848C45.8744 24.7081 48.7161 15.1098 40.4948 15.1098H33.5693C31.4996 15.1098 29.6827 16.4784 29.114 18.4684C27.9098 22.6817 25.7996 30.032 24.142 35.6273C23.2996 38.4708 22.598 40.9127 21.5212 42.4335C20.9175 43.286 19.9113 44 18.498 44Z" fill="url(#paint4_radial_56201_15503)"></path>
    <path d="M18.498 44H34.5374C39.12 44 41.8696 37.9424 43.7027 31.8848C45.8744 24.7081 48.7161 15.1098 40.4948 15.1098H33.5693C31.4996 15.1098 29.6827 16.4784 29.114 18.4684C27.9098 22.6817 25.7996 30.032 24.142 35.6273C23.2996 38.4708 22.598 40.9127 21.5212 42.4335C20.9175 43.286 19.9113 44 18.498 44Z" fill="url(#paint5_linear_56201_15503)"></path>
    <defs>
      <radialGradient id="paint0_radial_56201_15503" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(38.005 20.5144) rotate(-129.304) scale(17.3033 16.2706)">
        <stop offset="0.0955758" stop-color="#00AEFF"></stop>
        <stop offset="0.773185" stop-color="#2253CE"></stop>
        <stop offset="1" stop-color="#0736C4"></stop>
      </radialGradient>
      <radialGradient id="paint1_radial_56201_15503" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.1215 32.8171) rotate(51.84) scale(15.9912 15.5119)">
        <stop stop-color="#FFB657"></stop>
        <stop offset="0.633728" stop-color="#FF5F3D"></stop>
        <stop offset="0.923392" stop-color="#C02B3C"></stop>
      </radialGradient>
      <linearGradient id="paint2_linear_56201_15503" x1="12.5" y1="7.5" x2="14.7884" y2="33.9751" gradientUnits="userSpaceOnUse">
        <stop offset="0.156162" stop-color="#0D91E1"></stop>
        <stop offset="0.487484" stop-color="#52B471"></stop>
        <stop offset="0.652394" stop-color="#98BD42"></stop>
        <stop offset="0.937361" stop-color="#FFC800"></stop>
      </linearGradient>
      <linearGradient id="paint3_linear_56201_15503" x1="14.5" y1="4" x2="15.7496" y2="32.8852" gradientUnits="userSpaceOnUse">
        <stop stop-color="#3DCBFF"></stop>
        <stop offset="0.246674" stop-color="#0588F7" stop-opacity="0"></stop>
      </linearGradient>
      <radialGradient id="paint4_radial_56201_15503" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(41.3187 12.2813) rotate(109.274) scale(38.3873 45.9867)">
        <stop offset="0.0661714" stop-color="#8C48FF"></stop>
        <stop offset="0.5" stop-color="#F2598A"></stop>
        <stop offset="0.895833" stop-color="#FFB152"></stop>
      </radialGradient>
      <linearGradient id="paint5_linear_56201_15503" x1="42.5859" y1="13.346" x2="42.5695" y2="21.2147" gradientUnits="userSpaceOnUse">
        <stop offset="0.0581535" stop-color="#F8ADFA"></stop>
        <stop offset="0.708063" stop-color="#A86EDD" stop-opacity="0"></stop>
      </linearGradient>
    </defs>
  </svg>

);

export class CopilotButtonExample extends React.Component<{}, ILineChartEventsExampleState> {
  render(): JSX.Element {
    return (
      <FluentProvider theme={webLightTheme}>
        <Button appearance="primary">
          {copilotSvg}
          <h1 style={{ fontSize: '18px' }}>Ask Copilot</h1>
        </Button>
      </FluentProvider>
    );
  }
}

// =================================
//              Divider
// =================================
export const FluentDivider: React.FunctionComponent = () => {
  return (
    <div style={{ width: '100%', height: '25px', backgroundColor: '#F3F2F1' }}></div>
  );
};

// =================================
//               App
// =================================

function App() {
  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 className='mt-3' style={{ marginLeft: '1vw', marginRight: '1vw' }}>AIOps Dashboard (preview)</h1>
        <CopilotButtonExample />
      </div>
      <FluentDivider />
      <div className='row mt-3' style={{ display: 'flex', justifyContent: 'left' }}>
        <div style={{ width: '25vw', height: '30vh', overflow: 'scroll', marginLeft: '1vw', marginRight: '2vw' }}>
          <h3 className={classNames.itemHeader}>Concepts</h3>
          <ListBasicExample headerType={HeaderType.Concept} />
        </div>
        <div style={{ width: '25vw', height: '30vh', overflow: 'scroll', marginLeft: '1vw', marginRight: '2vw' }}>
          <h3 className={classNames.itemHeader}>Data Catalog</h3>
          <ListBasicExample headerType={HeaderType.DataSource} />
        </div>
      </div>
      <FluentDivider />
      <div className='row mt-3' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '50vw', height: '60vh', overflow: 'scroll', marginLeft: '1vw', marginRight: '2vw' }}>
          <h3 className={classNames.itemHeader}>Alerts</h3>
          <ShimmerApplicationExample />
        </div>
        <div style={{ width: '50vw', height: '60vh', overflow: 'scroll', marginLeft: '1vw', marginRight: '2vw' }}>
          <h3 className={classNames.itemHeader}>Distribution by time</h3>
          <LineChartEventsExample />
        </div>
      </div>
      <FluentDivider />
    </div>
  );
}

export default App;