import { useIntl } from 'react-intl';
import { Flex, Typography, Button, Checkbox, Modal, Field } from '@strapi/design-system';
import { ModalInput } from './styles';
import { getTrad } from '../../utils/getTrad';

interface GroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'rename';
  groupName: string;
  setGroupName: (name: string) => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  onSubmit: () => void;
}

export function GroupModal({
  open,
  onOpenChange,
  mode,
  groupName,
  setGroupName,
  expanded,
  setExpanded,
  onSubmit,
}: GroupModalProps) {
  const { formatMessage } = useIntl();

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{mode === 'create'
              ? formatMessage({ id: getTrad('modal.createTitle'), defaultMessage: 'Create Group' })
              : formatMessage({ id: getTrad('modal.renameTitle'), defaultMessage: 'Rename Group' })}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column" gap={5}>
            <Field.Root>
              <Field.Label>{formatMessage({ id: getTrad('modal.name'), defaultMessage: 'Group Name' })}</Field.Label>
              <ModalInput
                value={groupName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value)}
                placeholder={formatMessage({ id: getTrad('modal.namePlaceholder'), defaultMessage: 'e.g. Products, Blog, HR...' })}
                autoFocus
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') onSubmit();
                }}
              />
            </Field.Root>
            <Flex gap={2} alignItems="center">
              <Checkbox
                checked={expanded}
                onCheckedChange={(checked) => setExpanded(checked === true)}
              />
              <Typography textColor="neutral800">
                {formatMessage({ id: getTrad('modal.expanded'), defaultMessage: 'Expanded by default' })}
              </Typography>
            </Flex>
          </Flex>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button variant="tertiary">{formatMessage({ id: getTrad('modal.cancel'), defaultMessage: 'Cancel' })}</Button>
          </Modal.Close>
          <Button onClick={onSubmit} disabled={!groupName.trim()}>
            {mode === 'create'
              ? formatMessage({ id: getTrad('modal.create'), defaultMessage: 'Create' })
              : formatMessage({ id: getTrad('modal.save'), defaultMessage: 'Save' })}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
