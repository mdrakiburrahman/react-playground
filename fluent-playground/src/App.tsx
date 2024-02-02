import * as React from 'react';
import { createListItems, IExampleItem } from '@fluentui/example-data';
import { IColumn, buildColumns, SelectionMode, Toggle, IListProps } from '@fluentui/react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { useSetInterval, useConst } from '@fluentui/react-hooks';
import './App.css';

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


function App() {
  return (
    <div className="container">
      <h1 className='mt-3'>Predictive Analytics</h1>
      <div className='row mt-3' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48vw', height: '50vh', overflow: 'auto', marginRight: '2vw' }}>
          <ShimmerApplicationExample />
        </div>
        <div style={{ width: '48vw', height: '50vh', overflow: 'auto' }}>
          <ShimmerApplicationExample />
        </div>
      </div>
    </div>
  );
}

export default App;
