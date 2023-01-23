import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

FilterButtons.propTypes = {
   id: PropTypes.string,
   query: PropTypes.string.isRequired,
   options: PropTypes.array.isRequired,
   onSort: PropTypes.func
};

export default function FilterButtons({ id, query, options, onSort }) {
   const [activeButton, setActiveButton] = useState(query);

   const handleChangeTabs = e => {
      onSort(e);
   };

   return (
      <div value={query}>
         {options.map(option => (
            <Button
               id={id}
               key={option.value}
               value={option.value}
               variant='contained'
               className={`buttonSelect ${activeButton === option.value ? 'active' : null}`}
               sx={{ mx: 0.35, my: 0.5, borderRadius: 1, boxShadow: 'none' }}
               style={{ fontSize: '12px', height: '22px' }}
               onClick={e => {
                  setActiveButton(e.target.value);
                  handleChangeTabs(e.target.value);
               }}
            >
               {option.label}
            </Button>
         ))}
      </div>
   );
}
