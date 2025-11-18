import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  TablesContainer,
  TablesRow,
  TableColumn,
  Table,
  TableHead,
  TableBody,
  ComparisonTable,
  ComparisonTableHead,
  ComparisonTableBody,
  PerformanceTable
} from './ConversionTables.styled';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const ShimmerEffect = styled.div`
  animation: ${shimmer} 1.5s linear infinite forwards;
  background: linear-gradient(to right, 
    ${props => props.theme.name === 'dark' ? '#2a2a2a' : '#f6f6f6'} 8%, 
    ${props => props.theme.name === 'dark' ? '#3a3a3a' : '#e6e6e6'} 18%, 
    ${props => props.theme.name === 'dark' ? '#2a2a2a' : '#f6f6f6'} 33%);
  background-size: 800px 104px;
  border-radius: 4px;
`;

const HeadingShimmer = styled(ShimmerEffect)`
  width: 500px;
  height: 40px;
  margin-bottom: 1.5rem;
  border-radius: 6px;
`;

const DescriptionShimmer = styled(ShimmerEffect)`
  width: 100%;
  max-width: 900px;
  height: 20px;
  margin-bottom: 1.5rem;
  border-radius: 4px;
`;

const PerformanceHeadingShimmer = styled(ShimmerEffect)`
  width: 350px;
  height: 30px;
  margin: 2rem 0 1rem;
  border-radius: 6px;
`;

const TableHeadingShimmer = styled(ShimmerEffect)`
  width: 250px;
  height: 30px;
  margin-bottom: 1rem;
  border-radius: 6px;
`;

const ComparisonHeadingShimmer = styled(ShimmerEffect)`
  width: 300px;
  height: 35px;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
`;

const CellShimmer = styled(ShimmerEffect)`
  width: 100%;
  height: 20px;
  border-radius: 4px;
`;

const ConversionTablesShimmer: React.FC = () => {
  const renderShimmerRow = (columns: number, rowIndex: number) => {
    return (
      <tr key={`row-${rowIndex}`}>
        {Array.from({ length: columns }).map((_, i) => (
          <td key={`cell-${rowIndex}-${i}`}>
            <CellShimmer />
          </td>
        ))}
      </tr>
    );
  };

  return (
    <TablesContainer>
      <HeadingShimmer />
      
      <DescriptionShimmer />
      <DescriptionShimmer style={{ width: '85%' }} />
      <DescriptionShimmer style={{ width: '90%' }} />
      
      <PerformanceHeadingShimmer />
      <PerformanceTable>
        <TableHead>
          <tr>
            {Array.from({ length: 6 }).map((_, i) => (
              <th key={`perf-head-${i}`}>
                <CellShimmer />
              </th>
            ))}
          </tr>
        </TableHead>
        <TableBody>
          {renderShimmerRow(6, 0)}
        </TableBody>
      </PerformanceTable>
      
      <DescriptionShimmer style={{ width: '80%' }} />
      
      <TablesRow>
        <TableColumn>
          <TableHeadingShimmer />
          <div style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
            <Table>
              <TableHead>
                <tr>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <th key={`table1-head-${i}`}>
                      <CellShimmer />
                    </th>
                  ))}
                </tr>
              </TableHead>
              <TableBody>
                {Array.from({ length: 8 }).map((_, i) => (
                  renderShimmerRow(2, `table1-${i}`)
                ))}
              </TableBody>
            </Table>
          </div>
        </TableColumn>
        
        <TableColumn>
          <TableHeadingShimmer />
          <div style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
            <Table>
              <TableHead>
                <tr>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <th key={`table2-head-${i}`}>
                      <CellShimmer />
                    </th>
                  ))}
                </tr>
              </TableHead>
              <TableBody>
                {Array.from({ length: 8 }).map((_, i) => (
                  renderShimmerRow(2, `table2-${i}`)
                ))}
              </TableBody>
            </Table>
          </div>
        </TableColumn>
      </TablesRow>
      
      <ComparisonHeadingShimmer />
      <div style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
        <ComparisonTable>
          <ComparisonTableHead>
            <tr>
              {Array.from({ length: 4 }).map((_, i) => (
                <th key={`comparison1-head-${i}`}>
                  <CellShimmer />
                </th>
              ))}
            </tr>
          </ComparisonTableHead>
          <ComparisonTableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              renderShimmerRow(4, `comparison1-${i}`)
            ))}
          </ComparisonTableBody>
        </ComparisonTable>
      </div>
      
      <ComparisonHeadingShimmer />
      <div style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
        <ComparisonTable>
          <ComparisonTableHead>
            <tr>
              {Array.from({ length: 4 }).map((_, i) => (
                <th key={`comparison2-head-${i}`}>
                  <CellShimmer />
                </th>
              ))}
            </tr>
          </ComparisonTableHead>
          <ComparisonTableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              renderShimmerRow(4, `comparison2-${i}`)
            ))}
          </ComparisonTableBody>
        </ComparisonTable>
      </div>
    </TablesContainer>
  );
};

export default ConversionTablesShimmer;
