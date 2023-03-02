import PropTypes from 'prop-types';
import  { useId, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// @mui
import { Button, Divider } from '@mui/material';

// components
import TextBoxField from './components/form/TextBoxField';
import SelectWithLabel from './components/form/SelectWithLabel.tsx';


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

   const { handleSubmit, reset, control } = useForm();

   const id = useId();

   const [announcementTitle, setAnnouncementTitle] = useState('');

   const handleAnnouncementTitle = event => {
      setAnnouncementTitle(event.value);
   };

   return (
        <div style={{ padding: '1em' }}>
            <h2>New Log Note</h2>
            <br />
            <Divider variant='middle' id='divider2' />
            <br />
            <FormProvider>
               <form>
                  <br />
                  <div style={{ clear: 'both' }}></div>
                  <br />
                  <TextBoxField
                     id={`${id}_announcementTitle`}
                     name='announcementTitle'
                     defaultValue={announcementTitle}
                     control={control}
                     rules={{
                        maxLength: 3,
                        required: true
                     }}
                     label='Announcement Title'
                     required={false}
                     errorMsg=''
                     // check if we need handler and optimize everything.  compare to use 2 cases using his components and then these new ones
                     onChange={handleAnnouncementTitle}
                     sx={{
                        '& .MuiOutlinedInput-root': {
                           height: '30px',
                           width: '560px',
                           marginTop: '5px'
                        }
                     }}
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
                        <Button variant='contained' size='large' style={{ width: '400px' }}>
                           Post
                        </Button>
               </form>
            </FormProvider>
            </div>
   );
}
