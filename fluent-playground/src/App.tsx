import './App.css';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { ColorPicker, IColor } from '@fluentui/react';
import { createListItems, IExampleItem } from '@fluentui/example-data';
import { IChartProps, ILineChartProps, LineChart, DataVizPalette } from '@fluentui/react-charting';
import { IColumn, buildColumns, SelectionMode, Toggle, IListProps } from '@fluentui/react';
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
const toggleStyle: React.CSSProperties = {
  marginBottom: '20px',
};
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

  const onLoadData = React.useCallback(
    (ev: React.MouseEvent<HTMLElement>, checked: boolean): void => {
      const loadMoreItems = (): void => {
        state.visibleCount = Math.min(exampleItems.length, state.visibleCount + 2);

        setItems(exampleItems.map((current, index) => (index < state.visibleCount ? current : null)) as IExampleItem[]);
      };

      state.visibleCount = 0;
      if (checked) {
        loadMoreItems();

        state.lastIntervalId = setInterval(loadMoreItems, generateRandomWaitTime());
      } else {
        setItems(undefined);
        clearInterval(state.lastIntervalId);
      }
    },
    [clearInterval, setInterval, state],
  );

  return (
    <>
      <Toggle
        style={toggleStyle}
        label="Toggle to load content"
        onChange={(ev: React.MouseEvent<HTMLElement>, checked: boolean | undefined) => onLoadData(ev, checked || false)}
        onText="Content"
        offText="Shimmer"
      />
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
    </>
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
      width: 700,
      height: 330,
      allowMultipleShapes: false,
      customEventAnnotationColor: undefined,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <label htmlFor="changeWidth_Events">Change Width:</label>
        <input
          type="range"
          value={this.state.width}
          min={200}
          max={1000}
          onChange={this._onWidthChange}
          id="changeWidth_Events"
          aria-valuetext={`ChangeWidthSlider${this.state.width}`}
        />
        <label htmlFor="changeHeight_Events">Change Height:</label>
        <input
          type="range"
          value={this.state.height}
          min={200}
          max={1000}
          id="changeHeight_Events"
          onChange={this._onHeightChange}
          aria-valuetext={`ChangeHeightslider${this.state.height}`}
        />
        <Toggle
          label="Enabled multiple shapes for each line"
          onText="On"
          offText="Off"
          onChange={this._onShapeChange}
          checked={this.state.allowMultipleShapes}
        />
        <Checkbox
          label="Use Custom Color for Event Annotation"
          checked={this.state.customEventAnnotationColor !== undefined}
          onChange={this._onToggleCustomEventAnnotationColor}
        />
        {this.state.customEventAnnotationColor && (
          <ColorPicker
            onChange={this._onChangeCustomEventAnnotationColor}
            color={this.state.customEventAnnotationColor}
          />
        )}
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
  private _onShapeChange = (ev: React.MouseEvent<HTMLElement>, checked?: boolean | undefined) => {
    if (checked !== undefined) {
      this.setState({ allowMultipleShapes: checked });
    }
  };
  private _onToggleCustomEventAnnotationColor = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean | undefined) => {
    if (checked !== undefined) {
      this.setState({ customEventAnnotationColor: checked ? '#111111' : undefined });
    }
  };
  private _onChangeCustomEventAnnotationColor = (ev: React.SyntheticEvent<HTMLElement, Event>, color: IColor) => {
    this.setState({ customEventAnnotationColor: color.str });
  };

  private _basicExample(): JSX.Element {
    const data: IChartProps = {
      chartTitle: 'Line Chart',
      lineChartData: [
        {
          legend: 'From_Legacy_to_O365',
          data: [
            {
              x: new Date('2020-03-03T00:00:00.000Z'),
              y: 297,
            },
            {
              x: new Date('2020-03-04T00:00:00.000Z'),
              y: 284,
            },
            {
              x: new Date('2020-03-05T00:00:00.000Z'),
              y: 282,
            },
            {
              x: new Date('2020-03-06T00:00:00.000Z'),
              y: 294,
            },
            {
              x: new Date('2020-03-07T00:00:00.000Z'),
              y: 294,
            },
            {
              x: new Date('2020-03-08T00:00:00.000Z'),
              y: 300,
            },
            {
              x: new Date('2020-03-09T00:00:00.000Z'),
              y: 298,
            },
          ],
          color: DataVizPalette.color8,
          lineOptions: {
            lineBorderWidth: '4',
          },
        },
        {
          legend: 'All',
          data: [
            {
              x: new Date('2020-03-03T00:00:00.000Z'),
              y: 292,
            },
            {
              x: new Date('2020-03-04T00:00:00.000Z'),
              y: 287,
            },
            {
              x: new Date('2020-03-05T00:00:00.000Z'),
              y: 287,
            },
            {
              x: new Date('2020-03-06T00:00:00.000Z'),
              y: 292,
            },
            {
              x: new Date('2020-03-07T00:00:00.000Z'),
              y: 287,
            },
            {
              x: new Date('2020-03-08T00:00:00.000Z'),
              y: 297,
            },
            {
              x: new Date('2020-03-09T00:00:00.000Z'),
              y: 292,
            },
          ],
          color: DataVizPalette.color10,
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
          yMinValue={282}
          yMaxValue={301}
          yAxisTickFormat={d3.format('$,')}
          tickFormat={'%m/%d'}
          allowMultipleShapesForPoints={this.state.allowMultipleShapes}
          tickValues={[
            new Date('2020-03-03'),
            new Date('2020-03-04'),
            new Date('2020-03-05'),
            new Date('2020-03-06'),
            new Date('2020-03-07'),
            new Date('2020-03-08'),
            new Date('2020-03-09'),
          ]}
          eventAnnotationProps={{
            events: [
              {
                event: 'event 1',
                date: new Date('2020-03-04T00:00:00.000Z'),
                onRenderCard: () => <div className={calloutItemStyle}>event 1 message</div>,
              },
              {
                event: 'event 2',
                date: new Date('2020-03-04T00:00:00.000Z'),
                onRenderCard: () => <div className={calloutItemStyle}>event 2 message</div>,
              },
              {
                event: 'event 3',
                date: new Date('2020-03-04T00:00:00.000Z'),
                onRenderCard: () => <div className={calloutItemStyle}>event 3 message</div>,
              },
              {
                event: 'event 4',
                date: new Date('2020-03-06T00:00:00.000Z'),
                onRenderCard: () => <div className={calloutItemStyle}>event 4 message</div>,
              },
              {
                event: 'event 5',
                date: new Date('2020-03-08T00:00:00.000Z'),
                onRenderCard: () => <div className={calloutItemStyle}>event 5 message</div>,
              },
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
        />
      </div>
    );
  }
}


function App() {
  return (
    <div className="container">
      <h1 className='mt-3'>Predictive Analytics</h1>
      <div className='row mt-3' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48vw', height: '50vh', overflow: 'auto', marginRight: '2vw' }}>
          <ShimmerApplicationExample />
        </div>
        <div style={{ width: '48vw', height: '50vh', overflow: 'auto' }}>
          <LineChartEventsExample />
        </div>
      </div>
    </div>
  );
}

export default App;
