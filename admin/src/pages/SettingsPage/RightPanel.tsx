import { useIntl } from 'react-intl';
import { Flex, Typography, Button } from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MenuGroup } from '../../types';
import { SortableGroupCard } from './SortableGroupCard';
import { FolderIconSmallBlue } from './icons';
import { getTrad } from '../../utils/getTrad';
import { RightPanelContainer, PanelHeader, GroupsList, EmptyGroupsState } from './styles';

interface RightPanelProps {
  groups: MenuGroup[];
  activeTab: 'collectionType' | 'singleType';
  getLabel: (name: string) => string;
  getKind: (name: string) => 'collectionType' | 'singleType';
  onNewGroup: () => void;
  onRemoveItem: (groupId: string, itemIndex: number) => void;
  onDeleteGroup: (groupId: string) => void;
  onRenameGroup: (groupId: string) => void;
}

export function RightPanel({
  groups,
  activeTab,
  getLabel,
  getKind,
  onNewGroup,
  onRemoveItem,
  onDeleteGroup,
  onRenameGroup,
}: RightPanelProps) {
  const { formatMessage } = useIntl();
  const groupIds = groups.map((g) => `group-${g.id}`);

  return (
    <RightPanelContainer>
      <PanelHeader style={{ padding: '0 0 20px 0' }}>
        <Flex alignItems="center" gap={2}>
          <FolderIconSmallBlue />
          <Typography fontWeight="bold" textColor="neutral800">
            {activeTab === 'collectionType'
              ? formatMessage({ id: getTrad('groups.title.collectionType'), defaultMessage: 'Sidebar Groups (Collection Types)' })
              : formatMessage({ id: getTrad('groups.title.singleType'), defaultMessage: 'Sidebar Groups (Single Types)' })}
          </Typography>
        </Flex>
        <Button startIcon={<Plus />} onClick={onNewGroup} size="S">
          {formatMessage({ id: getTrad('groups.new'), defaultMessage: 'New Group' })}
        </Button>
      </PanelHeader>

      <GroupsList>
        {groups.length === 0 ? (
          <EmptyGroupsState>
            <Typography variant="delta" textColor="neutral600">
              {formatMessage({ id: getTrad('groups.empty.title'), defaultMessage: 'No groups yet' })}
            </Typography>
            <Typography variant="pi" textColor="neutral500" style={{ marginTop: '8px' }}>
              {activeTab === 'collectionType'
                ? formatMessage({ id: getTrad('groups.empty.collectionType'), defaultMessage: 'Create a group and drag collection types into it.' })
                : formatMessage({ id: getTrad('groups.empty.singleType'), defaultMessage: 'Create a group and drag single types into it.' })}
            </Typography>
          </EmptyGroupsState>
        ) : (
          <SortableContext items={groupIds} strategy={verticalListSortingStrategy}>
            {groups.map((group, localIndex) => (
              <SortableGroupCard
                key={group.id}
                group={group}
                groupIndex={localIndex}
                getLabel={getLabel}
                getKind={getKind}
                onRemoveItem={onRemoveItem}
                onDeleteGroup={onDeleteGroup}
                onRenameGroup={onRenameGroup}
              />
            ))}
          </SortableContext>
        )}
      </GroupsList>
    </RightPanelContainer>
  );
}
