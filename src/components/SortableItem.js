import { useSortable } from '@dnd-kit/sortable';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Editable from './Editable';

// utils
import axios from 'axios';

// import RightClickMenu from './RightClickMenu';

// @mui
import { Box, Grid } from '@mui/material';


import AlertIcon from '../assets/icons/alert-circle.svg';
import ChatIcon from '../assets/icons/chat.svg';
import ClockIcon from '../assets/icons/clock.svg';
import DragDropIcon from '../assets/icons/drag-and-drop.svg';
import VariablesIcon from '../assets/icons/variables.svg';

// css
import styles from './scheduler.module.scss';

export function SortableItem(props) {
   const {
      name,
      position,
      avatar,
      selectedDate,
      selectedPosition,
      isShift,
      item,
      id,
      station,
      time,
      timePeriod,
      timeIn,
      timeOut,
      tags,
      hasNotes,
      notes,
      correctPosition,
      isHouse,
      isPriority,
      swapPending,
      hasRTO,
      scheduleView
   } = props;

   const {
      attributes: subAttributes,
      listeners: subListeners,
      setNodeRef,
      isDragging
   } = useSortable({
      id,
      data: {
         item,
         name,
         type: 'shift'
      }
   });

   const dragStyle = { opacity: isDragging && isShift ? '0.5' : 1 };


   const [timeEditable, setTimeEditable] = useState('');

   const [staffMembers, setStaffMembers] = useState([]);
   const [staffPositions, setStaffPositions] = useState([]);
   useEffect(() => {
      try {
         axios.get('/data/staff.json').then(response => {
            setStaffMembers(response.data.staffs);
            setStaffPositions(response.data.staffs);
         });
      } catch (error) {
         console.error(error);
      }
   }, []);

   return (
      <div className={styles.shiftTileContent} ref={setNodeRef} style={dragStyle}>
         {!hasRTO && (
            <div className={styles.dragIconContainer}>
               <img
                  alt='Drag'
                  className={styles.dragIcon}
                  {...subListeners}
                  {...subAttributes}
                  src={DragDropIcon}
                  width={12}
                  height={12}
               />
            </div>
         )}
         {hasNotes && <img className={styles.notes} alt='Notes' src={ChatIcon} width={12} height={12} />}
         
         {!correctPosition && (
            <img className={styles.notes} alt='Wrong Position' src={VariablesIcon} width={12} height={12} />
         )}
         {!hasRTO && (
            <span className={styles.shiftTime}>
               <Editable text={timeEditable} placeholder={time} type='input'>
                  <input
                     type='time'
                     name='time'
                     placeholder='Select new time'
                     step='1800'
                     pattern='[0-9]{2}:[0-9]{2}'
                     value={timeEditable}
                     onChange={e => setTimeEditable(e.target.value)}
                  />
                  {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                     <TimePicker
                        label='Basic example'
                        value={timeEditableExample}
                        onChange={newValue => {
                           setTimeEditableExample(newValue);
                        }}
                        renderInput={params => (
                           <TextField
                              {...params}
                              className='dateField'
                              sx={{
                                 '& .MuiOutlinedInput-root': { height: '35px' }
                              }}
                           />
                        )}
                     />
                  </LocalizationProvider> */}
               </Editable>
            </span>
         )}
         {isHouse && !isPriority && !hasRTO && <span>House Shift</span>}
         {!isHouse && isPriority && (
            <Grid container direction='row' spacing={0} className={styles.priorityShift}>
               <Grid item xs={2}>
                  <img src={AlertIcon} alt='Priority Shift' />
               </Grid>
               <Grid item xs={10}>
                  <span>Priority Shift</span>
               </Grid>
            </Grid>
         )}
         {!isHouse && !isPriority && (
            <span>
               {scheduleView === 'employee' ? (
                  <Editable text={position} placeholder={position} type='select'>
                     <select id='assignTo' name='assignTo'>
                        {staffPositions.map(
                           (staff, index) =>
                              staff && (
                                 <option key={index} value={staff.position}>
                                    {staff.position}
                                 </option>
                              )
                        )}
                     </select>

                     {/* <FormControl>
                     <Select
                        id='assignTo'
                        displayEmpty={true}
                        renderValue={value => (value?.length ? (Array.isArray(value) ? value.join(', ') : value) : '')}
                        className={styles.fullWidthDropdown}
                        value={name}
                        onChange={handleChangeAssignTo}
                     >
                        <MenuItem value='Unassigned'>Unassigned (house shift)</MenuItem>
                        {staffMembers.map(
                           (staff, index) =>
                              staff && (
                                 <MenuItem key={index} value={staff.name}>
                                    {staff.name}
                                 </MenuItem>
                              )
                        )}
                     </Select>
                  </FormControl> */}
                  </Editable>
               ) : (
                  <Editable text={name} placeholder={name} type='select'>
                     <select id='assignTo' name='assignTo'>
                        {staffMembers.map(
                           (staff, index) =>
                              staff && (
                                 <option key={index} value={staff.name}>
                                    {staff.name}
                                 </option>
                              )
                        )}
                     </select>
                  </Editable>
               )}
            </span>
         )}
         {!hasRTO && (
            <span>
               <Editable text={station} placeholder={station} type='select'>
                  <select id='station' name='station'>
                     <option value='Front'>Front</option>
                     <option value='Back'>Back</option>
                     <option value='Main Kitchen'>Main Kitchen</option>
                  </select>
               </Editable>
            </span>
         )}
         {/* <RightClickMenu /> */}
         {swapPending && (
            <div className={styles.swapsDropDown}>
               <Box>
                  <img src={ClockIcon} width={15} height={15} alt='Swap Pending' />
                  <span>Swap Pending</span>
               </Box>
            </div>
         )}
      </div>
   );
}

SortableItem.propTypes = {
   name: PropTypes.string.isRequired,
   position: PropTypes.string,
   avatar: PropTypes.string,
   selectedDate: PropTypes.string,
   selectedPosition: PropTypes.string,
   isShift: PropTypes.bool.isRequired,
   item: PropTypes.object,
   id: PropTypes.string,
   station: PropTypes.string.isRequired,
   time: PropTypes.string.isRequired,
   timePeriod: PropTypes.string,
   timeIn: PropTypes.string,
   timeOut: PropTypes.string,
   tags: PropTypes.string,
   hasNotes: PropTypes.bool,
   notes: PropTypes.string,
   correctPosition: PropTypes.bool,
   isHouse: PropTypes.bool,
   isPriority: PropTypes.bool,
   swapPending: PropTypes.bool,
   hasRTO: PropTypes.bool,
   scheduleView: PropTypes.string
};
