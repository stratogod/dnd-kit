import PropTypes from 'prop-types';

import styles from './Forms.module.scss';

// ----------------------------------------------------------------------

Label.propTypes = {
   children: PropTypes.node
};

export default function Label({ children }) {
   return (
      <label className={styles.label}>
         <span>{children}</span>
      </label>
   );
}
