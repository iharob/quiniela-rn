#!/bin/sh

echo "// Automatically Generated $(date +'%x %X')" > index.tsx
echo "" >> index.tsx
for x in *.png;
do
	NAME=$(echo "${x%.png}" | tr '[:lower:]' '[:upper:]')
	OUTPATH=${x%.png}.tsx
	COMPONENT_NAME=$(echo "${NAME}" | sed -e 's/-/_/g')

	rm -f "$OUTPATH"

	cat <<EOF > "$OUTPATH"
// Automatically Generated 13/06/24 15:57:56
import React from 'react';
import { StyleProp, Image, ImageStyle } from 'react-native';

interface Props {
  readonly height: number;
  readonly width: number;
}

const Flag: React.FC<Props> = React.memo(
  function Flag({ width, height }: Props): React.ReactElement {
    const style = React.useMemo((): StyleProp<ImageStyle> => ({ height, width }), [height, width]);

    return (
      <Image
        source={require('./${x}')}
        style={style}
      />
    );
  },
  (previous: Props, current: Props): boolean =>
    previous.width !== current.width || previous.height !== current.height,
);

export default Flag;
EOF

	echo "import ${COMPONENT_NAME} from '@app/flags/${OUTPATH%.tsx}';" >> index.tsx

	if [[ "${NAME}" =~ "-" ]]; then
	  NAME="'${NAME}'"
	fi

	DEFINITIONS="$DEFINITIONS\n  ${NAME}: ${COMPONENT_NAME},"
done
echo "import React from 'react';" >> index.tsx
echo "" >> index.tsx
echo "interface Props {" >> index.tsx
echo "  readonly height: number;" >> index.tsx
echo "  readonly width: number;" >> index.tsx
echo "}" >> index.tsx
echo "" >> index.tsx
echo -e "export const flags: Record<string, React.FunctionComponent<Props>> = {${DEFINITIONS}" >> index.tsx
echo "};" >> index.tsx

