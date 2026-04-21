import { StyledButton } from '@app/components/styledButton';
import React from 'react';

interface Props {
  readonly disabled?: boolean;
  onNext?(): void;
}

export const NextButton: React.FC<Props> = (props: Props): React.ReactElement => {
  const { disabled, onNext } = props;
  return <StyledButton label="Aceptar" disabled={disabled} onPress={onNext} />;
};
