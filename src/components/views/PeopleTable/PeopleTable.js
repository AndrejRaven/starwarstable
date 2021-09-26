/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import RemoveIcon from '@mui/icons-material/Remove';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoneIcon from '@mui/icons-material/Done';
import Grid from '@mui/material/Grid';
import Axios from 'axios';
import api from '../../../settings';
import EnhancedTableHead from './PeopleTableHeader';
import EnhancedTableToolbar from './PeopleTableToolbar';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const EnhancedTable = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('born');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(5);
  const [characters, setCharacters] = React.useState([]);
  const [filteredCharacters, setFilteredCharacters] = React.useState([]);
  React.useEffect(() => {
    if (characters.length === 0) {
      (async () => {
        let nextPage = `${api.url}/${api.people}`;

        let people = [];

        while (nextPage) {
          const result = await Axios.get(nextPage);

          const { next, results } = await result.data;

          nextPage = next;

          people = [...people, ...results];
        }

        for (const character of people) {
          const result = await Axios.get(character.homeworld);

          const planet = result.data.name;
          character.homeworld = planet;
        }

        for (const character of people) {
          if (character.species.length) {
            const result = await Axios.get(character.species);
            const specie = result.data.name;
            character.species = specie;
          } else {
            character.species = 'Unspecified';
          }
        }

        for (const character of people) {
          let vehiclesAndStarships = [];
          for (const vehicle of character.vehicles) {
            const result = await Axios.get(vehicle);
            const vehicleName = result.data.name;
            vehiclesAndStarships = [...vehiclesAndStarships, vehicleName];
          }
          for (const starship of character.starships) {
            const result = await Axios.get(starship);
            const starshipName = result.data.name;
            vehiclesAndStarships = [...vehiclesAndStarships, starshipName];
          }
          character.vehiclesAndStarships = vehiclesAndStarships;
          character.status = 'active';
        }

        setCharacters(people);
        setFilteredCharacters(people);
      })();
    }
  });
  const showRandom = (vehiclesAndStarships) => {
    const shuffled = vehiclesAndStarships.sort(() => 0.5 - Math.random());
    const twoRandomTransports = shuffled.slice(0, 2);

    return twoRandomTransports;
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = characters.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - characters.length) : 0;

  return (
    <Box sx={{ width: '100%', marginTop: '15vh' }}>
      <Typography variant="h5">Characters</Typography>
      <EnhancedTableToolbar
        characters={characters}
        setFilteredCharacters={setFilteredCharacters}
        selected={selected}
        setSelected={setSelected}
      />
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={characters.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(filteredCharacters, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((charakter, index) => {
                  const isItemSelected = isSelected(charakter.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, charakter.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      sx={{
                        ...(charakter.status === 'deactivated' && {
                          bgcolor: (theme) =>
                            alpha(
                              theme.palette.action.disabled,
                              theme.palette.action.activatedOpacity
                            )
                        })
                      }}
                      key={charakter.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <Grid container wrap="nowrap" direction="column">
                          <Grid item>{charakter.name}</Grid>
                          <Grid item xs zeroMinWidth sx={{ fontSize: '10px' }}>
                            <span>{charakter.species}</span>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell align="right">
                        {charakter.birth_year}
                      </TableCell>
                      <TableCell align="right">{charakter.homeworld}</TableCell>
                      <TableCell align="right">
                        <Grid container wrap="nowrap" direction="column">
                          <Grid item>
                            {showRandom(charakter.vehiclesAndStarships)[0]}
                          </Grid>
                          <Grid item xs zeroMinWidth>
                            {showRandom(charakter.vehiclesAndStarships)[1]}
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell align="right">
                        {charakter.status === 'active' ? (
                          <Box sx={{ display: 'inline-flex' }}>
                            <DoneIcon
                              sx={{
                                borderRadius: '50%',
                                background: '#1b5e20',
                                marginRight: '1ch',
                                color: '#FFFFFF'
                              }}
                            />
                            {charakter.status}
                          </Box>
                        ) : (
                          <Box sx={{ display: 'inline-flex' }}>
                            <RemoveIcon
                              sx={{
                                borderRadius: '50%',
                                background: '#949EAE',
                                marginRight: '1ch'
                              }}
                            />
                            {charakter.status}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          aria-label="Change name"
                          component="span"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          aria-label="menu"
                          component="span"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Grid container justify="flex-start" direction="row-reverse">
        <Pagination
          component="div"
          count={Math.ceil(characters.length / rowsPerPage)}
          page={page + 1}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </Grid>
    </Box>
  );
};

export default EnhancedTable;
