import { StackHeaderLeftProps } from '@react-navigation/stack';
import React from 'react';
import { HeaderBackButton } from '@react-navigation/elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const BackImage = ({
  tintColor,
}: {
  readonly tintColor: string;
}): React.ReactNode => {
  return <FontAwesomeIcon icon={faArrowLeft} color={tintColor} />;
};

export const BackButton = (props: StackHeaderLeftProps): React.ReactNode => {
  return <HeaderBackButton {...props} backImage={BackImage} />;
};
