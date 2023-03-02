import PropTypes from 'prop-types';
import  { useId, useState } from 'react';
import { FormProvider } from 'react-hook-form';

// @mui
import { Button, Divider } from '@mui/material';

// components
import TextBoxWithLabel from './components/form/TextBoxWithLabel.tsx';
import useRenderCounter from './components/form/useRenderCounter'

import styles from './components/form/Forms.module.scss';

NewLogNote.propTypes = {
   logNoteDrawerOpen: PropTypes.bool,
   onChangeLogNoteDrawer: PropTypes.func
};





export default function NewLogNote() {

   const id = useId();

   const renderCounter = useRenderCounter();
   const [station, setStation] = useState('');
   const [station2, setStation2] = useState('');
   const [station3, setStation3] = useState('');

   const handleEditStation = postStation => {
      setStation(postStation);
   };

   const handleEditStation2 = postStation => {
    setStation2(postStation);
 };

 const handleEditStation3 = postStation => {
    setStation3(postStation);
 };
 

   return (
        <div style={{ padding: '1em' }}>
            <h1>New Log Note</h1>
            <h2>Renders: {renderCounter}</h2>
            <br />
            <Divider variant='middle' id='divider2' />
            <br />
            <FormProvider>
               <form>
                  <br />
                  <div style={{ clear: 'both' }}></div>
                  <br />
                  <TextBoxWithLabel
                        formGroup={styles.announcementTitle}
                        id={`${id}_tagName`}
                        label='Tag Name'
                        value={station.stationName}
                        handleInput={(value, isValid) => handleEditStation({ ...station, stationName: value }, isValid)}
                        validation={value => value == value}
                        required={false}
                        errorMsg=''
                        />
                        <br /><br />

                        <TextBoxWithLabel
                        formGroup={styles.announcementTitle}
                        id={`${id}_tagName2`}
                        label='Tag Name 2'
                        value={station2.stationName}
                        handleInput={(value, isValid) => handleEditStation2({ ...station, stationName: value }, isValid)}
                        validation={value => value == value}
                        required={false}
                        errorMsg=''
                        />
                        <br /><br />

                        <TextBoxWithLabel
                        formGroup={styles.announcementTitle}
                        id={`${id}_tagName`}
                        label='Tag Name'
                        value={station3.stationName}
                        handleInput={(value, isValid) => handleEditStation3({ ...station, stationName: value }, isValid)}
                        validation={value => value == value}
                        required={false}
                        errorMsg=''
                        />
                
                

            <br />
                  <br />
                  
                  <br />
                        <Button variant='contained' size='large' style={{ width: '400px' }}>
                           Post
                        </Button>
               </form>
            </FormProvider>
            </div>
   );
}
