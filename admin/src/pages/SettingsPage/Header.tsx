import { useIntl } from 'react-intl';
import { Flex, Typography, Button } from '@strapi/design-system';
import { HeaderBar, HeaderIcon, UnsavedBadge, UnsavedDot } from './styles';
import { FolderIconBlue } from './icons';
import { getTrad } from '../../utils/getTrad';

interface HeaderProps {
  hasChanges: boolean;
  saving: boolean;
  onReset: () => void;
  onSave: () => void;
}

export function Header({ hasChanges, saving, onReset, onSave }: HeaderProps) {
  const { formatMessage } = useIntl();

  return (
    <HeaderBar>
      <div>
        <Flex alignItems="center" gap={3}>
          <HeaderIcon>
            <FolderIconBlue />
          </HeaderIcon>
          <Flex direction="column" alignItems="flex-start" gap={1}>
            <Typography variant="alpha" textColor="neutral800">
              {formatMessage({ id: getTrad('header.title'), defaultMessage: 'Content Manager Organizer' })}
            </Typography>
            <Typography variant="epsilon" textColor="neutral500">
              {formatMessage({
                id: getTrad('header.subtitle'),
                defaultMessage: 'Organize Collection Types and Single Types into custom sidebar groups.',
              })}
            </Typography>
          </Flex>
        </Flex>
      </div>
      <Flex gap={3} alignItems="center">
        {hasChanges && (
          <UnsavedBadge>
            <UnsavedDot /> {formatMessage({ id: getTrad('header.unsaved'), defaultMessage: 'Unsaved changes' })}
          </UnsavedBadge>
        )}
        <Button variant="tertiary" onClick={onReset} disabled={!hasChanges}>
          {formatMessage({ id: getTrad('header.reset'), defaultMessage: 'Reset' })}
        </Button>
        <Button onClick={onSave} loading={saving} disabled={!hasChanges}>
          {formatMessage({ id: getTrad('header.save'), defaultMessage: 'Save Configuration' })}
        </Button>
      </Flex>
    </HeaderBar>
  );
}
