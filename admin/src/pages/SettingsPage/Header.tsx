import { Flex, Typography, Button } from '@strapi/design-system';
import { HeaderBar, HeaderIcon, UnsavedBadge, UnsavedDot } from './styles';
import { FolderIconBlue } from './icons';

interface HeaderProps {
  hasChanges: boolean;
  saving: boolean;
  onReset: () => void;
  onSave: () => void;
}

export function Header({ hasChanges, saving, onReset, onSave }: HeaderProps) {
  return (
    <HeaderBar>
      <div>
        <Flex alignItems="center" gap={3}>
          <HeaderIcon>
            <FolderIconBlue />
          </HeaderIcon>
          <Flex direction="column" alignItems="flex-start" gap={1}>
            <Typography variant="alpha" textColor="neutral800">
              Content Manager Organizer
            </Typography>
            <Typography variant="epsilon" textColor="neutral500">
              Organize Collection Types and Single Types into custom sidebar groups.
            </Typography>
          </Flex>
        </Flex>
      </div>
      <Flex gap={3} alignItems="center">
        {hasChanges && (
          <UnsavedBadge>
            <UnsavedDot /> Unsaved changes
          </UnsavedBadge>
        )}
        <Button variant="tertiary" onClick={onReset} disabled={!hasChanges}>
          Reset
        </Button>
        <Button onClick={onSave} loading={saving} disabled={!hasChanges}>
          Save Configuration
        </Button>
      </Flex>
    </HeaderBar>
  );
}
