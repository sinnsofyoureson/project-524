import React, { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import TasksTableHead from './TasksTableHead';
import TasksTableToolbar from './TasksTableToolbar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

interface TasksData {
  id: number;
  username: string;
  text: string;
  email: string;
  status: string;
};

interface A {
  email: string,
  id: number,
  image_path: string,
  status: number,
  text: string,
  username: string
}

type Order = 'asc' | 'desc';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    card: {
      minWidth: 275,
    },
    pos: {
      marginBottom: 12,
    },
  }),
);

const Component: React.FC = (props: any) => {

  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [tasks, setTasks] = useState<Array<A>>([]);
  const [tasksCount, setTasksCount] = useState(0);
  const [tasksOrder, setTasksOrder] = useState<Order>('asc');
  const [tasksOrderBy, setTasksOrderBy] = useState<keyof TasksData>('id');
  const [taskSelected, setTaskSelected] = useState<number[]>([]);

  function handleTasksRequestSort(event: MouseEvent<unknown>, property: keyof TasksData) {
    const isDesc = tasksOrderBy === property && tasksOrder === 'desc';
    const newTasksOrder = isDesc ? 'asc' : 'desc';
    setTasksOrder(isDesc ? 'asc' : 'desc');
    setTasksOrderBy(property);
    getTasks(newTasksOrder, property);
  }

  function handleTasksSelectAllClick(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      const newSelecteds = tasks.map(t => t.id);
      setTaskSelected(newSelecteds);
      return;
    }
    setTaskSelected([]);
  }

  function handleTaskClick(event: MouseEvent<unknown>, id: number) {
    const selectedIndex = taskSelected.indexOf(id);
    let newSelected: number[] = [];
    
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(taskSelected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(taskSelected.slice(1));
    } else if (selectedIndex === taskSelected.length - 1) {
      newSelected = newSelected.concat(taskSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        taskSelected.slice(0, selectedIndex),
        taskSelected.slice(selectedIndex + 1),
      );
    };

    setTaskSelected(newSelected);
  };

  function handleChangePage(event: unknown, newPage: number) {
    setPage(newPage);
    getTasks(tasksOrder, tasksOrderBy);
  };

  function handleChangeRowsPerPage(event: ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(+event.target.value);
  };

  function handleChangeDense(event: ChangeEvent<HTMLInputElement>) {
    setDense(event.target.checked);
  };

  const isTaskSelected = (id: number) => taskSelected.indexOf(id) !== -1;

  const emptyTasksRows = rowsPerPage - Math.min(rowsPerPage, tasks.length - page * rowsPerPage);
  
  const getTasks = (order: string, orderBy: string) => {
    let url = `https://uxcandy.com/~shapoval/test-task-backend/v2/?developer=Example&sort_field=${orderBy}&sort_direction=${order}&page=${page}`;
    axios
      .get(url)
      .then((response: any) => {
        if (response.data.status === 'ok') {
          setTasks(response.data.message.tasks);
          setTasksCount(response.data.message.total_task_count);
          console.log(response);
        } else {
          console.log('Get request error:')
        }
      })
      .catch((error) => {
        console.log('Get request error:', error);
    })
  }

	return (
    <React.Fragment>
      {tasks.length === 0 && getTasks('asc', 'id')}
      <Box boxShadow="8">
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.root}>
            <Paper className={classes.paper}>
              <TasksTableToolbar numSelected={taskSelected.length} />
              <div className={classes.tableWrapper}>
                <Table
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  size={dense ? 'small' : 'medium'}
                >
                  <TasksTableHead
                    numSelected={taskSelected.length}
                    order={tasksOrder}
                    orderBy={tasksOrderBy}
                    onSelectAllClick={handleTasksSelectAllClick}
                    onRequestSort={handleTasksRequestSort}
                    rowCount={tasks.length}
                  />
                  <TableBody>
                    {tasks
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((task: any) => {
                        console.log('task',task);
                        const isItemSelected = isTaskSelected(task.id);
                        return (
                          <TableRow
                            hover
                            onClick={event => handleTaskClick(event, task.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={task.id}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={isItemSelected} />
                            </TableCell>
                            <TableCell component="th" scope="row" padding="none" align="right">
                              <img
                                style={{ height: '48px', width: '48px', borderRadius: '100%', marginTop: '8px' }}
                                src={task.image_path}
                                alt={task.id}
                              />
                            </TableCell>
                            <TableCell>{ task.username }</TableCell>
                            <TableCell colSpan={2}>{ task.text }</TableCell>
                            <TableCell>{ task.email }</TableCell>
                            <TableCell>{ task.status === 10 ? 'Выполнен' : 'Неизвестен' }</TableCell>
                          </TableRow>
                        );
                      })
                    }
                    {emptyTasksRows > 0 && (
                      <TableRow style={{ height: 49 * emptyTasksRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                rowsPerPageOptions={[3, 5, 8]}
                component="div"
                count={tasksCount}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Paper>
            <FormControlLabel
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Dense padding"
            />
          </div>
        </CardContent>
        <CardActions />
      </Card>
      </Box>

      {/* <div className="counter">
        <p>new post {success}</p>
        <form>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </form>
        <button onClick={() => newPost()}>send</button>
      </div> */}
    </React.Fragment>
  );
}

export default Component;