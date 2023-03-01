import { MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { Dropdown } from '../../types/Dropdown';
// import LoadingSmall from './LoadingSmall';

import styles from './Forms.module.scss';

const Label = styled('label')({
   fontSize: 14
});

interface Props {
   formGroup: string;
   label: string;
   value: string;
   values: Dropdown[];
   defaultValue: string | null;
   handleSelect: (value: string, isValid: boolean) => void;
   id: string;
}

const SelectWithLabel: React.FC<Props> = props => {
   const handleOnChange = (events: SelectChangeEvent<string>) => {
      const value = events.target.value;
      let isValid = true;

      if (value === '-1') isValid = false;

      props.handleSelect(value, isValid);
   };

   let value = props.value;
   if (props.values.filter(x => x.id === value).length == 0) {
      value = '-1';
   }

   return (
      <>
         <div className={props.formGroup}>
            <Label className={styles.label} htmlFor={props.id}>
               {props.label}
            </Label>
            {!props.values ? (
               <span>Loading...</span>
            ) : (
               <Select
                  name={props.id}
                  id={props.id}
                  type={props.id}
                  value={value}
                  size='small'
                  onChange={handleOnChange}
                  input={<OutlinedInput sx={{ fontSize: 14 }} />}
               >
                  {props.defaultValue && <MenuItem value='-1'>{props.defaultValue}</MenuItem>}
                  {props.values.map(v => {
                     return (
                        <MenuItem value={v.id} key={v.id}>
                           {v.name}
                        </MenuItem>
                     );
                  })}
               </Select>
            )}
         </div>
      </>
   );
};

export default SelectWithLabel;
