import classnames from 'classnames';
import PropTypes from 'prop-types';
import FilterButtons from './filters/Buttons';
import FilterCheckboxes from './filters/Checkboxes';
import FilterSelect from './filters/Select';

// @mui
import { Button, Divider, Drawer, Grid, List } from '@mui/material';

// components
import Iconify from './Iconify';

// data
import {
   ONLY_SHOW_OPTIONS,
   POSITION_OPTIONS,
   SHIFT_STATE_OPTIONS,
   SPECIAL_TAGS,
   TIME_OPTIONS,
   TIME_PERIOD_OPTIONS,
   TIME_SELECT_TOP,
   WORKGROUP_OPTIONS
} from '../data/filters';

// graphics
import PositionIcon from '../assets/icons/badge.svg';
import ClockIcon from '../assets/icons/clock.svg';
import HelpIcon from '../assets/icons/help.svg';
import ListIcon from '../assets/icons/list-alt.svg';
import WorkGroupIcon from '../assets/icons/workgroups.svg';

// css
import '../custom.scss';
import styles from './scheduler.module.scss';

Filters.propTypes = {
   filterDrawer: PropTypes.bool,
   handleFilterDrawer: PropTypes.func,
   selectedDate: PropTypes.string,
   selectedPosition: PropTypes.string,
   handleFilterCheckList: PropTypes.func,
   handleShiftStateFilters: PropTypes.func,
   handleWorkGroupsFilters: PropTypes.func,
   handlePositionFilters: PropTypes.func,
   handleTimePeriodFilters: PropTypes.func,
   handleOnlyShowFilters: PropTypes.func,
   handleTimeInFilters: PropTypes.func,
   handleTimeOutFilters: PropTypes.func,
   handleSpecialTagsFilters: PropTypes.func,
   filterChecklist: PropTypes.array,
   shiftStateFilters: PropTypes.string,
   workGroupFilters: PropTypes.array,
   positionFilters: PropTypes.array,
   timePeriodFilters: PropTypes.array,
   onlyShowFilters: PropTypes.array,
   timeInFilters: PropTypes.string,
   timeOutFilters: PropTypes.string,
   specialTagsFilters: PropTypes.string,
   id: PropTypes.number
};

export default function Filters({
   filterDrawer,
   handleFilterDrawer,
   handleFilterCheckList,
   handleShiftStateFilters,
   handleWorkGroupsFilters,
   handlePositionFilters,
   handleTimePeriodFilters,
   handleOnlyShowFilters,
   handleTimeInFilters,
   handleTimeOutFilters,
   handleSpecialTagsFilters,
   filterChecklist,
   shiftStateFilters,
   workGroupFilters,
   positionFilters,
   timePeriodFilters,
   onlyShowFilters,
   timeInFilters,
   timeOutFilters,
   specialTagsFilters
}) {
   return (
      <Drawer
         variant='temporary'
         anchor='right'
         open={filterDrawer}
         onClose={() => {
            handleFilterDrawer(false);
         }}
      >
         <List className={classnames('drawer', styles.filtersDrawer)}>
            <Grid container spacing={0} direction='row' justifyContent='flex-end' alignItems='flex-start'>
               <Grid item xs={12} md={8} lg={8}>
                  <h2>Filters</h2>
               </Grid>
               <Grid item xs={12} md={4} lg={4}>
                  <Button className='closeButton' onClick={() => handleFilterDrawer(false)}>
                     <Iconify icon='ci:close-big' />
                  </Button>
               </Grid>
            </Grid>
            <Divider variant='middle' id='divider2' />
            <br />
            <Grid container spacing={7}>
               <Grid item xs={12} md={12} lg={12}>
                  <label id='shiftState' className={styles.filterLabel}>
                     <img src={HelpIcon} alt='Help' /> <span>Shift State</span>
                  </label>
                  <br />
                  <FilterButtons
                     id='shiftState'
                     query={shiftStateFilters}
                     options={SHIFT_STATE_OPTIONS}
                     onSort={handleShiftStateFilters}
                  />
                  <br />
                  <label id='workGroups' className={styles.filterLabel}>
                     <img src={WorkGroupIcon} width={15} height={15} alt='Workgroups' /> <span>Workgroups</span>
                  </label>
                  <br />
                  <div className={styles.filterSection}>
                     <FilterCheckboxes
                        query={workGroupFilters}
                        options={WORKGROUP_OPTIONS}
                        onSort={handleWorkGroupsFilters}
                        onChangeFilterCheckList={handleFilterCheckList}
                     />
                  </div>
                  <br />
                  <label id='position' className={styles.filterLabel}>
                     <img src={PositionIcon} width={16} height={16} alt='Workgroups' /> <span>Position</span>
                  </label>
                  <br />
                  <div className={styles.filterSection}>
                     <FilterCheckboxes
                        filterChecklist={filterChecklist}
                        query={positionFilters}
                        options={POSITION_OPTIONS}
                        onSort={handlePositionFilters}
                        onChangeFilterCheckList={handleFilterCheckList}
                     />
                  </div>
                  <br />
                  <label id='timePeriod' className={styles.filterLabel}>
                     <img src={ClockIcon} width={14} height={14} alt='Time Period' /> <span>Time Period</span>
                  </label>
                  <br />
                  <div className={styles.filterSection}>
                     <FilterCheckboxes
                        query={timePeriodFilters}
                        options={TIME_PERIOD_OPTIONS}
                        onSort={handleTimePeriodFilters}
                        onChangeFilterCheckList={handleFilterCheckList}
                     />
                  </div>
                  <br />
                  <label id='onlyShow' className={styles.filterLabel}>
                     <img src={ListIcon} width={17} height={17} alt='Only Show' /> <span>Only Show</span>
                  </label>
                  <br />
                  <div className={styles.filterSection}>
                     <FilterCheckboxes
                        query={onlyShowFilters}
                        options={ONLY_SHOW_OPTIONS}
                        onSort={handleOnlyShowFilters}
                        onChangeFilterCheckList={handleFilterCheckList}
                     />
                  </div>
               </Grid>
            </Grid>
            <br />
            <Grid container spacing={7}>
               <Grid item xs={12} md={12} lg={12}>
                  <label id='timeIn'>
                     <span>Time In</span>
                  </label>
                  <br />
                  <FilterSelect
                     id='timeIn'
                     query={timeInFilters}
                     options={TIME_OPTIONS}
                     onSort={handleTimeInFilters}
                     displayEmpty={true}
                     size='medium'
                     hasTopDivider={true}
                     topValues={TIME_SELECT_TOP}
                     hasBottomDivider={false}
                  />
               </Grid>
            </Grid>
            <br />
            <Grid container spacing={7}>
               <Grid item xs={12} md={12} lg={12}>
                  <label id='timeOut'>
                     <span>Time Out</span>
                  </label>
                  <br />
                  <FilterSelect
                     id='timeOut'
                     query={timeOutFilters}
                     options={TIME_OPTIONS}
                     onSort={handleTimeOutFilters}
                     displayEmpty={true}
                     size='medium'
                     hasTopDivider={true}
                     topValues={TIME_SELECT_TOP}
                     hasBottomDivider={false}
                  />
               </Grid>
            </Grid>
            <br />
            <Grid container spacing={7}>
               <Grid item xs={12} md={12} lg={12}>
                  <label id='specialTags'>
                     <span>Special Tags</span>
                  </label>
                  <br />
                  <FilterSelect
                     id='specialTags'
                     query={specialTagsFilters}
                     options={SPECIAL_TAGS}
                     onSort={handleSpecialTagsFilters}
                     displayEmpty={true}
                     size='medium'
                  />
               </Grid>
            </Grid>
         </List>
      </Drawer>
   );
}
