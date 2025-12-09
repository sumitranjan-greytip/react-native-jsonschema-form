import TextInputWidget from './TextInputWidget';
import TextWidget from './TextWidget';
import NumberWidget from './NumberWidget';
import CheckboxWidget from './CheckboxWidget';
import RadioButtonWidget from './RadioButtonWidget';
import SelectWidget from './SelectWidget';
import ToggleWidget from './ToggleWidget';
import DateTimeWidget from './DateTimeWidget';

export default {
  // Use TextInputWidget for editable text fields (TextWidget is read-only display)
  TextWidget: TextInputWidget,
  TextInputWidget,
  TextareaWidget: TextInputWidget,
  EmailWidget: TextInputWidget,
  URLWidget: TextInputWidget,
  PasswordWidget: TextInputWidget,
  // Keep the original TextWidget available as ReadOnlyTextWidget if needed
  ReadOnlyTextWidget: TextWidget,
  NumberWidget,
  IntegerWidget: NumberWidget,
  CheckboxWidget,
  RadioWidget: RadioButtonWidget,
  SelectWidget,
  ToggleWidget,
  DateWidget: DateTimeWidget,
  TimeWidget: DateTimeWidget,
  DateTimeWidget,
};
