import './App.css';
import { createListItems, IExampleItem } from '@fluentui/example-data';
import { IChartProps, ILineChartProps, LineChart, DataVizPalette } from '@fluentui/react-charting';
import { IColumn, buildColumns, SelectionMode, IListProps } from '@fluentui/react';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { useSetInterval, useConst } from '@fluentui/react-hooks';
import * as d3 from 'd3-format';
import * as React from 'react';

// =================================
//               Table
// =================================
interface IShimmerApplicationExampleState {
  lastIntervalId: number;
  visibleCount: number;
}

const ITEMS_COUNT: number = 200;
const shimmeredDetailsListProps: IListProps = {
  renderedWindowsAhead: 0,
  renderedWindowsBehind: 0,
};

const fileIcons: { name: string }[] = [
  { name: 'accdb' },
  { name: 'audio' },
  { name: 'code' },
  { name: 'csv' },
  { name: 'docx' },
  { name: 'dotx' },
  { name: 'mpt' },
  { name: 'model' },
  { name: 'one' },
  { name: 'onetoc' },
  { name: 'pdf' },
  { name: 'photo' },
  { name: 'pptx' },
  { name: 'presentation' },
  { name: 'potx' },
  { name: 'pub' },
  { name: 'rtf' },
  { name: 'spreadsheet' },
  { name: 'txt' },
  { name: 'vector' },
  { name: 'vsdx' },
  { name: 'xlsx' },
  { name: 'xltx' },
  { name: 'xsn' },
];

const randomFileIcon = (): { docType: string; url: string } => {
  const docType: string = fileIcons[Math.floor(Math.random() * fileIcons.length) + 0].name;
  return {
    docType,
    url: `https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/item-types/16/${docType}.svg`,
  };
};

const onRenderItemColumn = (item?: any, index?: number | undefined, column?: IColumn | undefined): React.ReactNode => {
  if (!item) {
    return null;
  }

  if (column?.key === 'thumbnail') {
    return <img src={item.thumbnail} alt="" />;
  }
  return item[column?.key as keyof IExampleItem];
};

const exampleItems: IExampleItem[] = createListItems(ITEMS_COUNT).map((item: IExampleItem) => {
  const randomFileType = randomFileIcon();
  return { ...item, thumbnail: randomFileType.url };
});

export const ShimmerApplicationExample: React.FunctionComponent = () => {
  const { current: state } = React.useRef<IShimmerApplicationExampleState>({
    lastIntervalId: 0,
    visibleCount: 0,
  });

  const [items, setItems] = React.useState<(IExampleItem | null)[] | undefined>(undefined);

  const shimmerColumns: IColumn[] = useConst(() => {
    const currentItems = createListItems(1);
    const columns: IColumn[] = buildColumns(currentItems);
    for (const column of columns) {
      if (column.key === 'thumbnail') {
        column.name = 'FileType';
        column.minWidth = 16;
        column.maxWidth = 16;
        column.isIconOnly = true;
        column.iconName = 'Page';
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
      setItems(exampleItems.map((current, index) => (index < state.visibleCount ? current : null)) as IExampleItem[]);
    };

    loadMoreItems();
    state.lastIntervalId = setInterval(loadMoreItems, generateRandomWaitTime());

    return () => {
      clearInterval(state.lastIntervalId);
    };
  }, [clearInterval, setInterval, state]);

  return (
    <div style={{ width: '50vw', height: '50vh', overflow: 'auto' }}>
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
                event: 'TRX_UNUSUAL_VOLUME',
                date: new Date('2024-02-03T09:17:30.000Z'),
                onRenderCard: () => <div className={calloutItemStyle}>Unusual number of transactions detected</div>,
              },
              {
                event: 'ABNORMAL_LOG_GROWTH',
                date: new Date('2024-02-03T09:17:30.000Z'),
                onRenderCard: () => <div className={calloutItemStyle}>Database logs growing abnormally</div>,
              },
              {
                event: 'HIGH_REPLICA_LAG',
                date: new Date('2024-02-03T09:20:00.000Z'),
                onRenderCard: () => <div className={calloutItemStyle}>High secondary_lag_seconds detected, replica lag increased</div>,
              },
              {
                event: 'TRX_DEADLOCK',
                date: new Date('2024-02-03T09:22:30.000Z'),
                onRenderCard: () => <div className={calloutItemStyle}>Transaction deadlock detected, impacting system performance</div>,
              },
              {
                event: 'HADR_SEEDING_FAILURES',
                date: new Date('2024-02-03T19:30:00.000Z'),
                onRenderCard: () => <div className={calloutItemStyle}>Multiple seeding failures</div>,
              },
              {
                event: 'TRX_REJECTED_RESOURCE_CONSTRAINTS',
                date: new Date('2024-02-03T21:00:00.000Z'),
                onRenderCard: () => <div className={calloutItemStyle}>Multiple transactions rejected</div>,
              },
              {
                event: 'LOGIN_FAILURE',
                date: new Date('2024-02-03T23:00:00.000Z'),
                onRenderCard: () => <div className={calloutItemStyle}>Multiple logins failed.</div>,
              }
            ],
            strokeColor: this.state.customEventAnnotationColor,
            labelColor: this.state.customEventAnnotationColor,
            labelHeight: 18,
            labelWidth: 50,
            mergedLabel: (count: number) => `${count} events`,
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


// =================================
//               App
// =================================

// TODO: Add a button in the middle of the screen with a copilot svg logo that says "Ask Copilot"

function App() {
  return (
    <div className="container">
      <h1 className='mt-3'>Predictive Analytics</h1>
      <div className='row mt-3' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48vw', height: '60vh', overflow: 'auto', marginRight: '2vw' }}>
        <h2 className='mt-3'>Events</h2>
          <ShimmerApplicationExample />
        </div>
        <div style={{ width: '48vw', height: '60vh', overflow: 'auto' }}>
        <h2 className='mt-3'>Distribution</h2>
          <LineChartEventsExample />
        </div>
      </div>
    </div>
  );
}

export default App;
