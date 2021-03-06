import * as React from 'react';
import { css } from '@emotion/react';

import { HtmlElementPropsType } from '@/types';
import { SPACING } from '@/constants';

const wideCss = css`
  width: 1000px;
`;

const standardCss = css`
  width: 800px;
`;

const pCss = css`
  width: 650px;
  padding-right: 150px;
`;

type Width = 'wide' | 'standard' | 'p';

const widthOptions = {
  wide: wideCss,
  standard: standardCss,
  p: pCss,
};

type Props = {
  width?: Width;
  vMargin?: SPACING;
  role?: string;
} & HtmlElementPropsType;

export const Box: React.FC<Props> = ({
  children,
  sx,
  id,
  className,
  vMargin,
  width = 'standard',
  role = '',
}) => {
  const style = css`
    // Use selected width
    ${widthOptions[width]}

    max-width: 100%;
    margin: ${vMargin ?? 0} auto;

    // Pass along any styling
    ${sx}
  `;

  return (
    <div role={role} id={id} className={className} css={style}>
      {children}
    </div>
  );
};
