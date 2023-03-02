import styled from '@emotion/styled';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PhoneIcon from '@mui/icons-material/Phone';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import InputStyle from './InputStyle';
import styles from './TextBoxWithLabel.module.scss';

const Label = styled('label')({
   fontSize: 14
});
interface Props {
   formGroup: string;
   required: boolean;
   label: string;
   value: string;
   handleInput: (value: string, isValid: boolean) => void;
   validation: (value: string) => boolean;
   id: string;
   errorMsg: string;
   type: string;
}

const TextBoxWithLabel: React.FC<Props> = props => {
   const [originalType] = useState<string>(props.type);

   const [showPassword, setShowPassword] = useState<boolean>(false);
   const inputRef = useRef<HTMLInputElement>();

   const handleClickShowPassword = () => setShowPassword(value => !value);
   const handleMouseDownPassword = () => setShowPassword(value => !value);

   const handleIfPassword = () => {
      if (originalType === 'password') {
         if (showPassword) {
            return 'text';
         } else {
            return 'password';
         }
      }

      return props.type;
   };

   let inputProps = {
      startAdornment: (
         <InputAdornment position='start'>
            {props.type === 'tel' ? <PhoneIcon className={styles.phone} /> : null}
         </InputAdornment>
      ),
      endAdornment: (
         <InputAdornment position='end' className={styles.errorLabel}>
            {originalType === 'password' && (
               <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
               >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
               </IconButton>
            )}
            <ReportProblemIcon color='error' />
         </InputAdornment>
      ),
      style: {
         fontSize: 14,
         color: '#C5283D',
         borderColor: '#C5283D !important'
      }
   };

   let classes = `${props.formGroup} ${styles.error}`;

   let isValid = props.validation(props.value);
   const handleChange = () => {
      let value = inputRef!.current!.value;

      if (props.type === 'tel') {
         value = phoneMask(value);
      }

      isValid = props.validation(value);

      props.handleInput(value, isValid);
   };

   const phoneMask = (phoneNumber: string): string => {
      let maskPhone: string = phoneNumber.replace(/\D/g, '');
      maskPhone = maskPhone.replace(/^0/, '');
      if (maskPhone.length > 6) {
         // 6..10 digits. Format as 4+4
         maskPhone = maskPhone.replace(/^(\d{0,3})(\d{0,3})(\d{0,4}).*/, '($1) $2-$3');
      } else if (maskPhone.length > 3) {
         // 3..5 digits. Add (0XX..)
         maskPhone = maskPhone.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
      } else if (maskPhone.length > 0) {
         // 0..2 digits. Just add (0XX
         maskPhone = maskPhone.replace(/^(\d*)/, '($1');
      }
      return maskPhone;
   };

   if (isValid) {
      inputProps = {
         startAdornment: (
            <InputAdornment position='start'>
               {props.type === 'tel' ? <PhoneIcon className={styles.phone} /> : null}
            </InputAdornment>
         ),
         endAdornment: (
            <InputAdornment position='end'>
               {originalType === 'password' && (
                  <IconButton
                     aria-label='toggle password visibility'
                     onClick={handleClickShowPassword}
                     onMouseDown={handleMouseDownPassword}
                  >
                     {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
               )}
            </InputAdornment>
         ),
         style: {
            fontSize: 14,
            color: 'inherit',
            borderColor: 'inherit'
         }
      };
   }

   return (
      <>
         <div className={classes}>
            <Label htmlFor={props.id} className={`${styles.label} ${!isValid ? styles.errorLabel : ''}`}>
               {props.required && '*'}
               {props.label}
            </Label>
            <TextField
               className={styles.error}
               name={props.id}
               id={props.id}
               type={handleIfPassword()}
               variant='outlined'
               value={props.value}
               onInput={handleChange}
               inputRef={inputRef}
               size='small'
               InputProps={inputProps}
            />
            <span className={!isValid ? styles.errorMsg : styles.errorNone}>{props.errorMsg}</span>
         </div>
      </>
   );
};

export default TextBoxWithLabel;
