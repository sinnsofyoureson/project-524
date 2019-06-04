import React, { ChangeEvent, MouseEvent } from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';

interface Data {
  id: number;
  username: string;
  text: string;
  email: string;
  status: string;
};

type Order = 'asc' | 'desc';

interface HeadRow {
  disablePadding : boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
  span: number;
}

const headRows: HeadRow[] = [
  { id: 'id', numeric: true, disablePadding: true, label: 'id', span: 1 },
  { id: 'username', numeric: false, disablePadding: false, label: 'имя', span: 1 },
  { id: 'text', numeric: false, disablePadding: false, label: 'текст', span: 2 },
  { id: 'email', numeric: false, disablePadding: false, label: 'мейл', span: 1 },
  { id: 'status', numeric: false, disablePadding: false, label: 'статус', span: 1 }
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

const TasksTableHead = (props: EnhancedTableProps) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
            colSpan={row.span}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TasksTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default TasksTableHead;