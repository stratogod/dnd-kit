import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { Divider, FormControl, MenuItem, Select } from '@mui/material';

// css
import styles from './select.module.scss';

// ----------------------------------------------------------------------

FilterSelect.propTypes = {
   id: PropTypes.string.isRequired,
   query: PropTypes.string.isRequired,
   options: PropTypes.array.isRequired,
   onSort: PropTypes.func.isRequired,
   size: PropTypes.string,
   displayEmpty: PropTypes.bool,
   hasTopDivider: PropTypes.bool,
   topValues: PropTypes.array,
   hasBottomDivider: PropTypes.bool,
   bottomValues: PropTypes.array
};

export default function FilterSelect({
   id,
   query,
   options,
   onSort,
   size,
   displayEmpty,
   hasTopDivider,
   topValues,
   hasBottomDivider,
   bottomValues
}) {
   const [activeSelection, setSelection] = useState(query);

   const handleChangeSelection = e => {
      setSelection(e.target.value);
      onSort(e.target.value);
   };

   const sizeClass =
      (size === 'fullWidth' && styles.fullWidthSelect) ||
      (size === 'drawer' && styles.fullDrawerWidthSelect) ||
      (size === 'medium' && styles.halfDrawerWidthSelect);

   return (
      <div value={query}>
         <FormControl>
            <Select
               id={id}
               displayEmpty={displayEmpty}
               renderValue={value => (value?.length ? (Array.isArray(value) ? value.join(', ') : value) : '')}
               className={sizeClass}
               value={activeSelection}
               onChange={handleChangeSelection}
            >
               {hasTopDivider && <Divider variant='middle' id='divider2' />}
               {topValues &&
                  topValues.map(topValue => (
                     <MenuItem key={topValue.key} value={topValue.value}>
                        {topValue.label}
                     </MenuItem>
                  ))}
               {options.map(option => (
                  <MenuItem key={option.key} value={option.value}>
                     {option.label}
                  </MenuItem>
               ))}
               {hasBottomDivider && <Divider variant='middle' id='divider2' />}
               {bottomValues &&
                  bottomValues.map(bottomValue => (
                     <MenuItem key={bottomValue.key} value={bottomValue.value}>
                        {bottomValue.label}
                     </MenuItem>
                  ))}
            </Select>
         </FormControl>
      </div>
   );
}
