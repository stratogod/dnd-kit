import { FormControl, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import styles from './Forms.module.scss';

TextBoxField.propTypes = {
   formGroup: PropTypes.string,
   required: PropTypes.bool,
   label: PropTypes.string,
   value: PropTypes.string,
   name: PropTypes.string,
   register: PropTypes.func,
   values: PropTypes.array,
   type: PropTypes.string,
   id: PropTypes.string,
   errorMsg: PropTypes.string,
   handleInput: PropTypes.func,
   validation: PropTypes.string,
   defaultValue: PropTypes.string,
   validators: PropTypes.any,
   logNoteDrawerOpen: PropTypes.bool,
   onChangeLogNoteDrawer: PropTypes.func
};

export default function TextBoxField({
   formGroup,
   id,
   label,
   defaultValue,
   value,
   name,
   rules,
   control,
   values,
   type,
   required,
   validation,
   handleInput,
   validators,
   errorMsg,
   ...props
}) {
   let classes = `${formGroup} ${styles.error}`;

   return (
      <FormControl {...props} className={formGroup} fullWidth>
         <div className={classes}>
            <Controller
               name={name}
               label={label}
               rules={rules}
               defaultValue=''
               control={control}
               render={({ field, fieldState: { error } }) => (
                  <TextField
                     {...field}
                     className={styles.error}
                     id={id}
                     variant='outlined'
                     value={value}
                     size='small'
                     error={error}
                     defaultValue={defaultValue}
                     onBlur={field.onBlur}
                     onChange={field.onChange}
                  />
               )}
            />
         </div>
      </FormControl>
   );
}
