import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '../../muiComponents/Button';
import colors from '../../utils/styles/colors';
import { spacings } from '../../utils/styles/spacings';

import PackageImg from './img/package.svg';

export const NOT_FOUND_TEXT = "Sorry, we couldn't find it...";
export const LABEL_NOT_FOUND = "The page you're looking for doesn't exist.";
export const GO_TO_HOME_PAGE = 'Go to the home page';

const EmptyPackage = styled('img')({
  width: '150px',
  margin: '0 auto',
});

const StyledHeading = styled(Typography)({
  color: colors.primary,
  marginBottom: spacings.sm,
});

const NotFound: React.FC = () => {
  const history = useHistory();

  const handleGomHome = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <Box alignItems="center" data-testid="404" display="flex" flexDirection="column" flexGrow={1} justifyContent="center" p={2}>
      <EmptyPackage alt="404 - Page not found" src={PackageImg} />
      <StyledHeading className="not-found-text" variant="h4">
        {NOT_FOUND_TEXT}
      </StyledHeading>
      <Button onClick={handleGomHome} variant="contained">
        {GO_TO_HOME_PAGE}
      </Button>
    </Box>
  );
};

export default NotFound;
