import { useState } from 'react';
import './App.css';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import {
  Button,
  FluentProvider,
  Input,
  ProgressBar,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  teamsLightTheme,
} from '@fluentui/react-components';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FluentProvider theme={teamsLightTheme}>
        <NationalityDetector />
      </FluentProvider>
    </QueryClientProvider>
  );
}

const columns = [
  { columnKey: 'country_id', label: 'Country' },
  { columnKey: 'probability', label: 'Author' },
];

function NationalityDetector() {
  const [name, setName] = useState('');
  const mutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch('https://api.nationalize.io/?name=' + name);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
  });

  return (
    <div className="w-[100dvw] h-[100dvh] relative">
      <div className="w-full h-full p-3 pb-[48px] flex justify-center align-center">
        {mutation.isPending && <Spinner size="large" />}
        {mutation.isSuccess && (
          <div className="flex flex-col items-center justify-center gap-y-5">
            <Text as="h1">{mutation.data.name}</Text>
            <Table arial-label="Nationality table" className="max-w-[500px]">
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHeaderCell key={column.columnKey}>{column.label}</TableHeaderCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(mutation.data?.country ?? []).map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <span className={`fi fi-${item.country_id?.toLocaleLowerCase?.()}`} />
                    </TableCell>
                    <TableCell>
                      <TableCellLayout media={<ProgressBar value={item.probability} />}>
                        {(item.probability * 100).toFixed(2)}%
                      </TableCellLayout>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 w-full flex gap-2 justify-center p-2">
        <Input
          value={name}
          onChange={(_, data) => {
            setName(data.value);
            mutation.mutate(data.value);
          }}
        />
        <Button appearance="primary">Search</Button>
      </div>
    </div>
  );
}

export default App;
