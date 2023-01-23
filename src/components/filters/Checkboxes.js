import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material';

// ----------------------------------------------------------------------

FilterCheckboxes.propTypes = {
   query: PropTypes.array.isRequired,
   options: PropTypes.array.isRequired,
   onSort: PropTypes.func.isRequired,
   filterChecklist: PropTypes.array,
   onChangeFilterCheckList: PropTypes.func
};

export default function FilterCheckboxes({ query, options, onSort, filterChecklist, onChangeFilterCheckList }) {
   // Below code is for IF we want the checkboxes to be checked by default
   // let filterValue = '';
   // query && query.length === 4 ? (filterValue = [...options.map((x, id) => ({ id, ...x }))]) : (filterValue = query);

   const [filterArray, setFilterArray] = useState(query);
   const [filterChecklistArray, setFilterCheckList] = useState(options);

   const checkedHandler = (e, index) => {
      setFilterCheckList(prev => {
         let newState = [...prev];
         newState[index].checked = e.target.checked;

         return newState;
      });
      onChangeFilterCheckList(filterChecklist);
   };

   return (
      <FormControl component='fieldset' variant='standard'>
         <FormGroup>
            {filterChecklistArray.map((option, index) => (
               <FormControlLabel
                  key={option.key}
                  control={
                     <Checkbox
                        onChange={e => {
                           if (e.target.checked) {
                              setFilterArray([
                                 ...filterArray,
                                 {
                                    value: option.value,
                                    label: option.label
                                 }
                              ]);
                           } else {
                              // remove from list
                              setFilterArray(filterArray.filter(item => item.label !== option.label));
                           }

                           checkedHandler(e, index);
                           onSort(filterArray);
                        }}
                        checked={option?.checked || false}
                        value={option.value}
                        name={option.label}
                     />
                  }
                  label={option.label}
                  onClick={onSort(filterArray)}

                  // onClick={() => onSort(filterArray)}
               />
            ))}
         </FormGroup>
      </FormControl>
   );
}
