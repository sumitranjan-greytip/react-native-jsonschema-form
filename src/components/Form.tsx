// Polyfill Event and CustomEvent for React Native (Hermes doesn't have them)
// Must be at the very top BEFORE any imports that might use them
if (typeof (globalThis as any).Event === 'undefined') {
  (globalThis as any).Event = class Event {
    type: string;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    
    constructor(type: string, eventInitDict?: { bubbles?: boolean; cancelable?: boolean }) {
      this.type = type;
      this.bubbles = eventInitDict?.bubbles ?? false;
      this.cancelable = eventInitDict?.cancelable ?? false;
      this.defaultPrevented = false;
    }
    
    preventDefault() {
      this.defaultPrevented = true;
    }
    
    stopPropagation() {}
  };
}

if (typeof (globalThis as any).CustomEvent === 'undefined') {
  (globalThis as any).CustomEvent = class CustomEvent extends (globalThis as any).Event {
    detail: any;
    constructor(type: string, eventInitDict?: { bubbles?: boolean; cancelable?: boolean; detail?: any }) {
      super(type, eventInitDict);
      this.detail = eventInitDict?.detail ?? null;
    }
  };
}

import RJSFForm from '@rjsf/core';
import { FormProps, IChangeEvent } from '@rjsf/core';
import { FormContextType, RJSFSchema } from '@rjsf/utils';
import React, { useRef, useMemo, useState, useCallback } from 'react';
import { View, ViewStyle } from 'react-native';
import theme from '../theme';
import validator from '@rjsf/validator-ajv8';

interface RNFormProps extends Omit<FormProps<any>, 'className' | 'style'> {
  style?: ViewStyle;
}

// Custom wrapper to replace HTML <form> with React Native <View>
const FormWrapper = React.forwardRef<View, any>(({ children, onSubmit, ...props }, ref) => {
  // Ignore onSubmit since we handle it manually
  return <View ref={ref} {...props}>{children}</View>;
});

export default function Form(props: RNFormProps) {
  const { style, children, formContext, onSubmit, schema, ...formProps } = props;
  const [currentFormData, setCurrentFormData] = useState(props.formData || {});

  // Handle form data changes
  const handleChange = useCallback((data: IChangeEvent) => {
    setCurrentFormData(data.formData);
    if (props.onChange) {
      props.onChange(data);
    }
  }, [props.onChange]);

  // Function to manually submit the form (bypasses @rjsf/core's browser-based submit)
  const handleManualSubmit = useCallback(() => {
    
    // Validate form data
    const formValidator = props.validator || validator;
    const { errors } = formValidator.validateFormData(currentFormData, schema as any);
    
    if (errors && errors.length > 0) {
      console.log("Validation errors:", errors);
      if (props.onError) {
        props.onError(errors);
      }
    } else {
      console.log("Form is valid, calling onSubmit");
      if (onSubmit) {
        // Pass a mock event as second argument (required by @rjsf/core types)
        const mockEvent = { preventDefault: () => {} } as any;
        onSubmit({ formData: currentFormData } as any, mockEvent);
      }
    }
  }, [currentFormData, schema, props.validator, props.onError, onSubmit]);

  // Create enhanced formContext with submit function
  const enhancedFormContext = useMemo(() => ({
    ...formContext,
    __submitForm: handleManualSubmit,
  }), [formContext, handleManualSubmit]);

  return (
    <View style={style}>
      <RJSFForm
        {...formProps}
        schema={schema}
        formData={currentFormData}
        onChange={handleChange}
        formContext={enhancedFormContext}
        tagName={FormWrapper as any}
        templates={theme.templates}
        widgets={theme.widgets}
      >
        {children}
      </RJSFForm>
    </View>
  );
}
