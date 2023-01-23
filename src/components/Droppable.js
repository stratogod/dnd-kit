import { useDraggable, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { SortableItem } from './SortableItem';

import blankIcon from '../assets/icons/blank.png';
import plusIcon from '../assets/icons/plus-circle.svg';

// css
import styles from './scheduler.module.scss';

Droppable.propTypes = {
   item: PropTypes.object,
   lastParent: PropTypes.bool,
   hasShifts: PropTypes.bool,
   list: PropTypes.array,
   position: PropTypes.string,
   beginningOfWeek: PropTypes.string,
   endOfWeek: PropTypes.string,
   currentDay: PropTypes.string,
   addedNewShift: PropTypes.bool,
   buttonClick: PropTypes.bool,
   isPublished: PropTypes.bool,
   scheduleView: PropTypes.string,
   filterQueryShiftState: PropTypes.string,
   filterQueryWorkGroup: PropTypes.array,
   filterQueryPosition: PropTypes.array,
   filterQueryTimePeriod: PropTypes.array,
   filterQueryOnlyShow: PropTypes.array,
   filterQueryTimeIn: PropTypes.string,
   filterQueryTimeOut: PropTypes.string
};

export function Droppable(props) {
   const {
      item,
      lastParent,
      hasShifts,
      list,
      position,
      beginningOfWeek,
      endOfWeek,
      currentDay,
      addedNewShift,
      buttonClick,
      isPublished,
      scheduleView,
      filterQueryShiftState,
      filterQueryWorkGroup,
      filterQueryPosition,
      filterQueryTimePeriod,
      filterQueryOnlyShow

      // filterQueryTimeIn,
      // filterQueryTimeOut,
      // filterQuerySpecialTags
   } = props;

   // eslint-disable-next-line no-unused-vars
   const { setNodeRef: setDraggableNodeRef, isDragging } = useDraggable({
      id: item.id,
      data: { item, lastParent, hasShifts, type: 'parent' }
   });

   const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
      id: item.id,
      data: {
         type: 'parent',
         item
      }
   });

   const dropStyle = {
      borderLeft: isOver ? '4px solid #a6b6cc' : undefined
   };

   const dragStyle = { opacity: isDragging ? '0.5' : 1 };

   // sub drop style

   const { isOver: subIsOver, setDroppableNodeRef: setSubDroppableNodeRef } = useSortable({
      id: `SubMenu${item.id}${position}`
   });

   const subDropStyle = {
      height: '4px',
      backgroundColor: subIsOver ? '#a6b6cc' : 'transparent',
      width: '180px',
      margin: '8px 0px 8px 15px',
      borderRadius: '8px'
   };

   const [over, setOver] = useState(false);

   const [newShiftDrawer, setNewShiftDrawer] = useState(false);

   const onChangeNewShiftDrawer = newValue => {
      setNewShiftDrawer(newValue);
      setOver(false);
   };

   const [selectedDate, setSelectedDate] = useState();

   return (
      <div
         className={styles.dayContainer}
         style={isDragging ? dragStyle : dropStyle}
         onMouseOver={() => setOver(true)}
         onMouseOut={() => setOver(false)}
         value={selectedDate}
      >
         <img
            src={over ? plusIcon : blankIcon}
            className={styles.addShift}
            alt='Add Shift'
            width='25'
            height='25'
            onClick={() => {
               setNewShiftDrawer(!newShiftDrawer);
               setSelectedDate(currentDay);
            }}
         />
         <div className={styles.droppableArea} ref={setDroppableNodeRef}></div>
         <SortableContext id={`SubMenu${item.id}${position}`} items={list} strategy={verticalListSortingStrategy}>
            <div className={styles.shiftContainer} ref={setSubDroppableNodeRef}>
               {list.map(
                  shift =>
                     item.date >= beginningOfWeek &&
                     item.date <= endOfWeek &&
                     shift.shiftState === filterQueryShiftState &&
                     (filterQueryPosition.length > 0
                        ? filterQueryPosition.some(val => val.label === item.position)
                        : filterQueryPosition) &&
                     (filterQueryWorkGroup.length > 0
                        ? filterQueryWorkGroup.some(val => val.label === shift.workGroup)
                        : filterQueryWorkGroup) &&
                     (filterQueryTimePeriod.length > 0
                        ? filterQueryTimePeriod.some(val => val.label === shift.timePeriod)
                        : filterQueryTimePeriod) &&
                     (filterQueryOnlyShow.length > 0
                        ? filterQueryOnlyShow.some(val => val.label === shift.timePeriod)
                        : filterQueryOnlyShow) && (
                        // eslint-disable-next-line lines-around-comment
                        /* filterQueryTimeIn &&
                     filterQueryTimeIn== shift.timeIn &&
                     filterQueryTimeOut &&
                     filterQueryTimeOut === shift.timeOut && 
                     filterQuerySpecialTags === shift.tags
                     ( */

                        <div key={shift.id}>
                           <div style={subDropStyle}></div>
                           <div
                              className={classnames(styles.shiftTile)}
                              style={{
                                 // eventually go back and make these classes and use css variables to detect brightness of background to determine white/black text color
                                 ...((item.position === 'Bartender' || shift.position === 'Bartender') &&
                                    !shift.isReleased &&
                                    !shift.isHouse &&
                                    !shift.isPriority && {
                                       backgroundColor: '#00529d',
                                       color: '#FFFFFF'
                                    }),
                                 ...((item.position === 'Bartender' || shift.position === 'Bartender') &&
                                    (shift.isReleased || shift.isHouse || shift.isPriority) &&
                                    !shift.hasRTO && {
                                       border: '1px solid #00529d'
                                    }),
                                 ...((item.position === 'Cook' || shift.position === 'Cook') &&
                                    !shift.isReleased &&
                                    !shift.isHouse &&
                                    !shift.isPriority && {
                                       backgroundColor: '#9D0084',
                                       color: '#FFFFFF'
                                    }),
                                 ...((item.position === 'Cook' || shift.position === 'Cook') &&
                                    (shift.isReleased || shift.isHouse || shift.isPriority) &&
                                    !shift.hasRTO && {
                                       border: '1px solid #9D0084'
                                    }),
                                 ...((item.position === 'Head Chef' || shift.position === 'Head Chef') &&
                                    !shift.isReleased &&
                                    !shift.isHouse &&
                                    !shift.isPriority && {
                                       backgroundColor: '#F1E800'
                                    }),
                                 ...((item.position === 'Head Chef' || shift.position === 'Head Chef') &&
                                    (shift.isReleased || shift.isHouse || shift.isPriority) &&
                                    !shift.hasRTO && {
                                       border: '1px solid #F1E800'
                                    }),
                                 ...((item.position === 'Server' || shift.position === 'Server') &&
                                    !shift.isReleased &&
                                    !shift.isHouse &&
                                    !shift.isPriority && {
                                       backgroundColor: '#FFE3E3'
                                    }),
                                 ...((item.position === 'Server' || shift.position === 'Server') &&
                                    (shift.isReleased || shift.isHouse || shift.isPriority) &&
                                    !shift.hasRTO && {
                                       border: '1px solid #FFE3E3'
                                    }),
                                 ...(shift.hasRTO && {
                                    border: '1px solid #FFF !important'
                                 })
                              }}
                           >
                              <SortableItem
                                 id={shift.id}
                                 selectedDate={item.date}
                                 selectedPosition={item.position}
                                 name={shift.name}
                                 position={shift.position}
                                 avatar={shift.avatar}
                                 time={shift.time}
                                 timePeriod={shift.timePeriod}
                                 timeIn={shift.timeIn}
                                 timeOut={shift.timeOut}
                                 station={shift.station}
                                 tags={shift.tags}
                                 item={shift}
                                 hasNotes={shift.hasNotes}
                                 notes={shift.notes}
                                 correctPosition={shift.correctPosition}
                                 isHouse={shift.isHouse}
                                 isPriority={shift.isPriority}
                                 swapPending={shift.swapPending}
                                 hasRTO={shift.hasRTO}
                                 scheduleView={scheduleView}
                                 isShift
                              />
                           </div>
                        </div>
                     )
               )}
            </div>
         </SortableContext>
      </div>
   );
}
