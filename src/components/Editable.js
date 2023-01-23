// Editable.js
import PropTypes from 'prop-types';
import React, { useState } from 'react';

Editable.propTypes = {
   text: PropTypes.string,
   type: PropTypes.string,
   placeholder: PropTypes.string,
   children: PropTypes.element
};

export default function Editable({ text, type, placeholder, children, ...props }) {
   const [isEditing, setEditing] = useState(false);

   // const handleKeyDown = (event, type) => {};

   const handleKeyDown = () => {};

   return (
      <section {...props}>
         {isEditing ? (
            <div onBlur={() => setEditing(false)} onKeyDown={e => handleKeyDown(e, type)}>
               {children}
            </div>
         ) : (
            <div onClick={() => setEditing(true)}>
               <span>{text || placeholder || 'Editable content'}</span>
            </div>
         )}
      </section>
   );
}
