/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import RemoveIcon from '@mui/icons-material/Remove';
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

const EnhancedTableToolbar = ({
  characters,
  setFilteredCharacters,
  selected,
  setSelected
}) => {
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
  const statusMenu = ['active', 'desactiveted'];

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
  const removeCharacters = () => {
    function removeFromArray(original, remove) {
      return original.filter((value) => !remove.includes(value.name));
    }
    setFilteredCharacters(removeFromArray(characters, selected));
    // eslint-disable-next-line no-param-reassign
    setSelected([]);
  };
  const deactivateCharacters = () => {
    for (const select of selected) {
      for (const character of characters) {
        if (character.name === select) {
          character.status = 'deactivated';
        }
      }
    }
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
          onClick={removeCharacters}
          sx={{ textTransform: 'none', marginLeft: '3ch' }}
        >
          <RemoveIcon sx={{ marginRight: '1ch' }} />
          Remove characters
        </Button>
        <Button
          variant="contained"
          sx={{ textTransform: 'none' }}
          onClick={deactivateCharacters}
        >
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
  setFilteredCharacters: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSelected: PropTypes.func.isRequired
};

export default EnhancedTableToolbar;
