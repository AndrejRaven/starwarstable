/* eslint-disable react/prop-types */
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';

class PeopleTable extends React.Component {
  componentDidMount() {
    const { fetchPeople } = this.props;

    fetchPeople();
  }

  render() {
    const { people } = this.props;

    const Search = styled('div')(({ theme }) => ({
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      border: '1px solid black',
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25)
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
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
        [theme.breakpoints.up('md')]: {
          width: '20ch'
        }
      }
    }));

    const currencies = [
      {
        value: 'USD',
        label: '$'
      },
      {
        value: 'EUR',
        label: '€'
      },
      {
        value: 'BTC',
        label: '฿'
      },
      {
        value: 'JPY',
        label: '¥'
      }
    ];
    const currency = 'eur';
    return (
      <>
        <CssBaseline />
        <Container maxWidth="xl">
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5">Characters</Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Toolbar>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
                <TextField
                  id="outlined-select"
                  select
                  variant="outlined"
                  value={currency}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  id="outlined-select"
                  select
                  variant="outlined"
                  value={currency}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  id="outlined-select"
                  select
                  variant="outlined"
                  value={currency}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Button>button</Button>
                  <Button>button</Button>
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
                    size="large"
                    aria-label="show more"
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <MoreIcon />
                  </IconButton>
                </Box>
              </Toolbar>
            </Box>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <TableBody>
                {people.map((character) => (
                  <TableRow key={character.name}>
                    <TableCell padding="checkbox">s</TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {character.name}
                    </TableCell>
                    <TableCell align="right">{character.birth_year}</TableCell>
                    <TableCell align="right">{character.homeworld}</TableCell>
                    <TableCell align="right">{character.vehicles}</TableCell>
                    <TableCell align="right">{character.status}</TableCell>
                    <TableCell align="right">{character.actions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Paper>
            <Grid container justify="flex-end">
              <Pagination
                component="div"
                count={10}
                page={1}
                variant="outlined"
                shape="rounded"
              />
            </Grid>
          </Box>
        </Container>
      </>
    );
  }
}

export default PeopleTable;
