import { connect } from 'react-redux';
import {
  getAllPeople,
  getPeopleLoadingState,
  fetchPeopleFromAPI
} from '../../../redux/peopleReducer';
import PeopleTable from './PeopleTable';

const mapStateToProps = (state) => ({
  people: getAllPeople(state),
  loading: getPeopleLoadingState(state)
});

const mapDispatchToProps = (dispatch) => ({
  fetchPeople: () => dispatch(fetchPeopleFromAPI())
});

export default connect(mapStateToProps, mapDispatchToProps)(PeopleTable);
