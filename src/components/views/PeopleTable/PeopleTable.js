/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import { visuallyHidden } from '@mui/utils';
import SearchIcon from '@mui/icons-material/Search';
import RemoveIcon from '@mui/icons-material/Remove';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoneIcon from '@mui/icons-material/Done';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Axios from 'axios';
import api from '../../../settings';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid black',
  backgroundColor: alpha(theme.palette.common.white, 0.75),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto'
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch'
      }
    }
  }
}));

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

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name'
  },
  {
    id: 'born',
    numeric: false,
    disablePadding: false,
    label: 'Born'
  },
  {
    id: 'homeworld',
    numeric: false,
    disablePadding: false,
    label: 'Homeworld'
  },
  {
    id: 'vehiclesAndStarships',
    numeric: false,
    disablePadding: false,
    label: 'Vehicles and Starships'
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Actions'
  }
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all characters'
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.disablePadding ? 'left' : 'right'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const EnhancedTableToolbar = ({ characters, setFilteredCharacters }) => {
  const [speciesArray, setSpeciesArray] = React.useState([]);
  const [species, setSpecies] = React.useState('');
  const [homeworldArray, setHomeworldArray] = React.useState([]);
  const [homeworld, setHomeworld] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [search, setSearch] = React.useState('');
  React.useEffect(() => {
    if (speciesArray.length === 0) {
      (async () => {
        let nextPage = `${api.url}/${api.species}`;

        let speciesList = [];

        while (nextPage) {
          const result = await Axios.get(nextPage);

          const { next, results } = await result.data;
          nextPage = next;

          speciesList = [...speciesList, ...results.map((res) => res.name)];
        }
        setSpeciesArray(speciesList);
      })();
    }
  });
  React.useEffect(() => {
    if (homeworldArray.length === 0) {
      (async () => {
        let nextPage = `${api.url}/${api.planets}`;

        let homeworldList = [];

        while (nextPage) {
          const result = await Axios.get(nextPage);

          const { next, results } = await result.data;
          nextPage = next;

          homeworldList = [...homeworldList, ...results.map((res) => res.name)];
        }
        setHomeworldArray(homeworldList);
      })();
    }
  });
  const statusMenu = ['active', 'desactive'];

  const handleSpecies = (event) => {
    setSpecies(event.target.value);
    setFilteredCharacters(
      characters.filter((character) => character.species === event.target.value)
    );
  };
  const handleHomeworld = (event) => {
    setHomeworld(event.target.value);
    setFilteredCharacters(
      characters.filter(
        (character) => character.homeworld === event.target.value
      )
    );
  };
  const handleStatus = (event) => {
    setStatus(event.target.value);
    setFilteredCharacters(
      characters.filter((character) => character.status === event.target.value)
    );
  };
  const handleSearch = (event) => {
    setSearch(event.target.value);
    const pattern = new RegExp(search, 'i');
    setFilteredCharacters(
      characters.filter((character) => pattern.test(character.name))
    );
  };

  return (
    <Toolbar
      sx={{
        mt: '2vh',
        pl: { sm: 0 },
        pr: { xs: 1, sm: 1 },
        '& .MuiTextField-root': {
          m: 1,
          width: '25ch',
          '& .MuiSelect-select': {
            padding: '9px'
          }
        }
      }}
    >
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          value={search}
          onChange={handleSearch}
        />
      </Search>
      <TextField
        id="outlined-select-species"
        label="Species"
        select
        value={species}
        onChange={handleSpecies}
      >
        {speciesArray.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="outlined-select-homeworld"
        label="Homeworld"
        select
        value={homeworld}
        onChange={handleHomeworld}
      >
        {homeworldArray.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="outlined-select-homeworld"
        label="Status"
        select
        value={status}
        onChange={handleStatus}
      >
        {statusMenu.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <Grid container flexDirection="row-reverse">
        <Button
          variant="contained"
          color="error"
          sx={{ textTransform: 'none', marginLeft: '3ch' }}
        >
          <RemoveIcon sx={{ marginRight: '1ch' }} />
          Remove characters
        </Button>
        <Button variant="contained" sx={{ textTransform: 'none' }}>
          <RemoveIcon
            sx={{
              borderRadius: '50%',
              background: '#d32f2f',
              marginRight: '1ch'
            }}
          />
          Deactivate characters
        </Button>
      </Grid>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  characters: PropTypes.instanceOf(Array).isRequired,
  setFilteredCharacters: PropTypes.func.isRequired
};

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
                        <DoneIcon
                          sx={{
                            borderRadius: '50%',
                            background: '#1b5e20',
                            marginRight: '1ch',
                            color: '#FFFFFF'
                          }}
                        />
                        {charakter.status}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
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
