import React, { useState } from 'react';
import { FormControl, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { PatternFormat } from "react-number-format";
import Label from './Label'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PhoneIcon from '@mui/icons-material/Phone';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { IconButton, InputAdornment } from '@mui/material';
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
   control: PropTypes.any,
   errorMsg: PropTypes.string,
   defaultValue: PropTypes.string,
};

const myHelper = {
   email: {
     required: "Email is required",
     pattern: "Invalid Email Address"
   },
   password: {
      required: "Password is required",
      pattern: "Must contain at least 8 characters"
    }
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
   helperText,
   errors,
   handleInput,
   validators,
   errorMsg,
   cssClass,
   ...other
}) {
   
   const [showPassword, setShowPassword] = useState(false);

   const handleClickShowPassword = () => setShowPassword(value => !value);
   const handleMouseDownPassword = () => setShowPassword(value => !value);

   const handleType = (value) => {
      if (type === 'password') {
         if (showPassword) {
            return 'text';
         } else {
            return 'password';
         }
      }

      if (type === 'email') {
         return 'email';
      }

      if (type === 'tel') {
         return 'tel';
      }

      return type;
   };


    const validateFields = (value) => {

      if (type === 'tel') {
      const matches = value.match(
         /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i
      );
      return matches?.length > 0 || "Not a Number";
      } 

      if (type === 'email') {
         const matches = value.match(
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
         );
         
         return matches?.length > 0 || "Not an email address";
         } 

         if (type === 'password') {
            const matches = value.match(
               /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
            );
            return matches?.length > 0 || "Password must contain at least 8 characters";
         }
  
    };



   const inputProps = (hasError) => ({
      startAdornment: (
         <InputAdornment position='start'>
            {type === 'tel' ? <PhoneIcon className={styles.phone} /> : null}
         </InputAdornment>
      ),
      endAdornment: (
         <InputAdornment position='end' className={styles.errorLabel}>
            {type === 'password' && (
               <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
               >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
               </IconButton>
            )}
            {hasError && <ReportProblemIcon color='error' />}
         </InputAdornment>
      )
   });


   return (
      <FormControl className={cssClass} fullWidth>
         <Label htmlFor={id}>
               {required && '*'}
               {label}
            </Label>
            <Controller
               name={name}
               label={label}
               control={control}
               defaultValue = {defaultValue}
               rules={{
                  required: { value: required, message: `${label} is required`},
                  pattern: { value: validateFields, message: `${label} is wrong`},
                  validate: validateFields
                  
                }}
               render={({ field, fieldState: { error } }) => ({
                  ...type === 'tel' ? (
                  <PatternFormat
                  {...other}
                  customInput={TextField}
                  format="(###) ###-####"
                  onValueChange={(value) => {
                     console.log(value);
                  }}
                  error={error !== undefined && error!== null}
                  InputProps={inputProps(error)}
                  onBlur={field.onBlur}
                  onChange={field.onChange}       
                  />) : (
                  <TextField
                     {...field}
                     className={cssClass}
                     name={label}
                     id={id}       
                     variant='outlined'
                     size='small'
                     error={error !== undefined && error!== null}
                     helperText={helperText && error ? myHelper[type] ? myHelper[type][error.type] : "" : ""}
                     type={handleType(field.value)}
                     InputProps={inputProps(error)}
                     onBlur={field.onBlur}
                     onChange={field.onChange}
                  />)
               })}
            />
      </FormControl>
   );
}
