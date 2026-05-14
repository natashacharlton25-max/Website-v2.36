import './FormField.css';
import './FormField.responsive.css';
import '../Caret';  // FormField hosts the custom caret + arrow-tab — JS scopes them to .form-field
import '../Button'; // FormField's select-type uses Button as the dropdown trigger (need Button.css)
import '../Image';  // card-select option media slot may use Image atom
import '../Icon';   // card-select option media slot may use Icon atom

export { default as FormField } from './FormField.astro';
export { default as schema } from './FormField.schema.json';
