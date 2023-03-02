import PropTypes from 'prop-types';
import  { useId, useRef, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// @mui
import { Button, Divider } from '@mui/material';

// components
import TextBoxField from './components/form/TextBoxField';
import SelectWithLabel from './components/form/SelectWithLabel.tsx';
import useRenderCounter from './components/form/useRenderCounter'

import styles from './components/form/Forms.module.scss';

NewLogNote.propTypes = {
   logNoteDrawerOpen: PropTypes.bool,
   onChangeLogNoteDrawer: PropTypes.func
};


const positions = [
  {
     id: 1,
     name: 'Dishwasher'
  },
  {
     id: 2,
     name: 'Dryer'
  },
  {
     id: 3,
     name: 'Washer'
  },
  {
     id: 4,
     name: 'Line Cook'
  },
  {
     id: 5,
     name: 'Server'
  }
];


export default function NewLogNote() {

   const { handleSubmit, control, methods } = useForm({mode: 'onBlur'});
   const id = useId();
   const onSubmit = (data) => console.log(data);

   const renderCounter = useRenderCounter();

 

   return (
        <div style={{ padding: '1em' }}>
            <h1>New Log Note</h1>
            <h2>Renders: {renderCounter}</h2>
            <br />
            <Divider variant='middle' id='divider2' />
            <br />
            <FormProvider {...methods}>
               <form>
                  <br />
                  <div style={{ clear: 'both' }}></div>
                  <br />
                  <TextBoxField
                     id={`${id}_announcementTitle`}
                     label='Announcement Title'
                     name='announcementTitle'
                     cssClass={styles.formGroup}
                     defaultValue={''}
                     control={control}
                     required={true}
                     helperText={true}
                     // check if we need handler and optimize everything.  compare to use 2 cases using his components and then these new ones
                     // onChange={handleAnnouncementTitle}
                  />
                  <br />
                  <br />


                  <TextBoxField
                     id={`${id}_email`}
                     label='Email'
                     name='email'
                     cssClass={styles.formGroup}
                     defaultValue={''}
                     control={control}
                     type='email'
                     required={true}
                     helperText={true}
                     // check if we need handler and optimize everything.  compare to use 2 cases using his components and then these new ones
                     // onChange={handleAnnouncementTitle}
                  />
                  <br />
                  <br />


                  <TextBoxField
                     id={`${id}_phone`}
                     label='Phone'
                     name='phone'
                     cssClass={styles.formGroup}
                     defaultValue={''}
                     control={control}
                     type='tel'
                     required={true}
                     helperText={true}                     
                     // errorMsg=''
                     // check if we need handler and optimize everything.  compare to use 2 cases using his components and then these new ones
                     // onChange={handleAnnouncementTitle}
                  />
                  <br />
                  <br />


                  <TextBoxField
                     id={`${id}_password`}
                     label='Password'
                     name='password'
                     cssClass={styles.formGroup}
                     defaultValue={''}
                     control={control}
                     type='password'
                     required={true}
                     helperText={true}
                     // rules={{ required: true }}
                     // errorMsg=''
                     // check if we need handler and optimize everything.  compare to use 2 cases using his components and then these new ones
                     // onChange={handleAnnouncementTitle}
                  />
                  <br />
                  <br />

              <SelectWithLabel
               id={`${id}_teamMembers`}
               label='Position'
               // value={station.position}
               values={positions}
               defaultValue='Select Positions'
               // handleSelect={(value, isValid) => handleEditStation({ ...station, position: value }, isValid, value)}
            />
            <br />
                  <br />
                  
                  <br />
                        <Button variant='contained' size='large' style={{ width: '400px' }} onClick={handleSubmit(onSubmit)}>
                           Post
                        </Button>
               </form>
            </FormProvider>
            </div>
   );
}
