import './App.css';
import { IExampleItem } from '@fluentui/example-data';
import { IChartProps, ILineChartProps, LineChart, DataVizPalette } from '@fluentui/react-charting';
import { FluentProvider, webLightTheme, Button } from "@fluentui/react-components";
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

const internalCreateListItems = (): IExampleItem[] => {
  return [
    {
      thumbnail: randomFileIcon().url,
      key: 'item-0',
      name: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
      color: 'blue',
      shape: 'triangle',
      location: 'Los Angeles',
      width: 100,
      height: 200,
    },
    {
      thumbnail: randomFileIcon().url,
      key: 'item-0',
      name: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
      color: 'blue',
      shape: 'triangle',
      location: 'Los Angeles',
      width: 100,
      height: 200,
    },
    {
      thumbnail: randomFileIcon().url,
      key: 'item-0',
      name: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
      color: 'blue',
      shape: 'triangle',
      location: 'Los Angeles',
      width: 100,
      height: 200,
    },
    {
      thumbnail: randomFileIcon().url,
      key: 'item-0',
      name: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
      color: 'blue',
      shape: 'triangle',
      location: 'Los Angeles',
      width: 100,
      height: 200,
    },
    {
      thumbnail: randomFileIcon().url,
      key: 'item-0',
      name: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
      color: 'blue',
      shape: 'triangle',
      location: 'Los Angeles',
      width: 100,
      height: 200,
    },
    {
      thumbnail: randomFileIcon().url,
      key: 'item-0',
      name: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
      color: 'blue',
      shape: 'triangle',
      location: 'Los Angeles',
      width: 100,
      height: 200,
    },
    {
      thumbnail: randomFileIcon().url,
      key: 'item-0',
      name: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
      color: 'blue',
      shape: 'triangle',
      location: 'Los Angeles',
      width: 100,
      height: 200,
    },
    {
      thumbnail: randomFileIcon().url,
      key: 'item-0',
      name: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
      color: 'blue',
      shape: 'triangle',
      location: 'Los Angeles',
      width: 100,
      height: 200,
    },
    {
      thumbnail: randomFileIcon().url,
      key: 'item-0',
      name: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
      color: 'blue',
      shape: 'triangle',
      location: 'Los Angeles',
      width: 100,
      height: 200,
    },
    {
      thumbnail: randomFileIcon().url,
      key: 'item-0',
      name: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
      color: 'blue',
      shape: 'triangle',
      location: 'Los Angeles',
      width: 100,
      height: 200,
    },
  ];
};

const exampleItems: IExampleItem[] = internalCreateListItems();

export const ShimmerApplicationExample: React.FunctionComponent = () => {
  const { current: state } = React.useRef<IShimmerApplicationExampleState>({
    lastIntervalId: 0,
    visibleCount: 0,
  });

  const [items, setItems] = React.useState<(IExampleItem | null)[] | undefined>(undefined);

  const shimmerColumns: IColumn[] = useConst(() => {
    const currentItems = internalCreateListItems();
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
    <div style={{ width: '100vw', height: '50vh', overflow: 'scroll' }}>
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
                onRenderCard: () => <div className={calloutItemStyle}>Multiple transaction deadlocks detected</div>,
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
                onRenderCard: () => <div className={calloutItemStyle}>Multiple login failures detected.</div>,
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
//               App
// =================================

function App() {
  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 className='mt-3' style={{ marginRight: '10px' }}>Preventive Intelligence</h1>
        <CopilotButtonExample />
      </div>
      <div className='row mt-3' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '50vw', height: '60vh', overflow: 'scroll', marginRight: '2vw' }}>
          <h2 className='mt-3'>Events</h2>
          <ShimmerApplicationExample />
        </div>
        <div style={{ width: '50vw', height: '60vh', overflow: 'scroll' }}>
          <h2 className='mt-3'>Distribution</h2>
          <LineChartEventsExample />
        </div>
      </div>
    </div>
  );
}

export default App;


// =================================
// TODOs
// =================================
//
// 0. Align line chart with table timestamps
// 1. Add all the events into the table with sample features and labels
// 2. Add all the heartbeats into the table
// 3. Have a column differentiator for each category
// 4. Have SVGs for each category (Health is all hearts, and anomalies, try to break apart)
// 5. If necessary, add more events to the line chart and tables
//