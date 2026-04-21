import {
  faMessage,
  faSatelliteDish,
  faTrophy,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';

export interface TabIconProps {
  readonly color: string;
  readonly size: number;
}

export type TabBarIconComponent = (props: TabIconProps) => React.ReactNode;

const TabIcon = (icon: IconDefinition): TabBarIconComponent =>
  function IconElement(props: TabIconProps): React.ReactElement {
    const { size, color } = props;
    return <FontAwesomeIcon icon={icon} color={color} size={size} />;
  };

export const RankingsIcon = TabIcon(faTrophy);
export const OngoingIcon = TabIcon(faSatelliteDish);
export const ChatIcon = TabIcon(faMessage);
