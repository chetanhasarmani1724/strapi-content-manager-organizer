import { Flex, Typography } from '@strapi/design-system';
import { Search, Cross, Filter, Drag, CheckCircle } from '@strapi/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MenuContentTypeOption } from '../../types';
import { TypeIcon } from './icons';
import {
  LeftPanelContainer,
  PanelHeader,
  CountBadge,
  SearchContainer,
  SearchBoxWrapper,
  SearchIconWrapper,
  SearchInput,
  ClearButton,
  FilterIconBtn,
  AvailableList,
  LeftPanelFooter,
  DragInstructionBox,
  InfoIcon,
  AvailableItem,
  DragHandle,
  AssignedHandle,
  TypeIconWrapper,
  CheckIconWrapper,
} from './styles';

/* ── Available Type Row ── */
export function AvailableTypeRow({
  ct,
  assignedGroup,
}: {
  ct: MenuContentTypeOption;
  assignedGroup: string | null;
}) {
  const isAssigned = !!assignedGroup;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `available-${ct.singularName}`,
    disabled: isAssigned,
    data: { type: 'available-item', singularName: ct.singularName },
  });
  const style = {
    transition,
    opacity: isDragging ? 0.4 : isAssigned ? 0.6 : 1,
    cursor: isAssigned ? 'not-allowed' : 'grab',
  };

  return (
    <AvailableItem
      ref={setNodeRef}
      style={style}
      $assigned={isAssigned}
      title={isAssigned ? `Already in "${assignedGroup}"` : undefined}
      {...(isAssigned ? {} : listeners)}
      {...(isAssigned ? {} : attributes)}
    >
      <Flex alignItems="center" gap={3}>
        {!isAssigned ? (
          <DragHandle as="div">
            <Drag />
          </DragHandle>
        ) : (
          <AssignedHandle>
            <Drag />
          </AssignedHandle>
        )}
        <TypeIconWrapper $assigned={isAssigned}>
          <TypeIcon kind={ct.kind} />
        </TypeIconWrapper>
        <Flex direction="column" gap={0} alignItems="start">
          <Typography
            textColor={isAssigned ? 'neutral600' : 'neutral800'}
            fontWeight={isAssigned ? 'regular' : 'bold'}
          >
            {ct.cleanDisplayName}
          </Typography>
          {isAssigned && (
            <Typography textColor="neutral500" variant="pi" style={{ fontSize: '1.1rem' }}>
              In {assignedGroup} group
            </Typography>
          )}
        </Flex>
      </Flex>
      {isAssigned && (
        <CheckIconWrapper>
          <CheckCircle />
        </CheckIconWrapper>
      )}
    </AvailableItem>
  );
}

/* ── Left Panel ── */
interface LeftPanelProps {
  activeTab: 'collectionType' | 'singleType';
  search: string;
  setSearch: (val: string) => void;
  filteredContentTypes: MenuContentTypeOption[];
  assignedMap: Map<string, string>;
}

export function LeftPanel({
  activeTab,
  search,
  setSearch,
  filteredContentTypes,
  assignedMap,
}: LeftPanelProps) {
  return (
    <LeftPanelContainer>
      <PanelHeader>
        <Typography fontWeight="bold" textColor="neutral800">
          Available {activeTab === 'collectionType' ? 'Collection' : 'Single'} Types
        </Typography>
        <CountBadge>{filteredContentTypes.length}</CountBadge>
      </PanelHeader>

      <SearchContainer>
        <SearchBoxWrapper>
          <SearchIconWrapper>
            <Search />
          </SearchIconWrapper>
          <SearchInput
            placeholder={`Search ${activeTab === 'collectionType' ? 'collection' : 'single'} types...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <ClearButton onClick={() => setSearch('')}>
              <Cross />
            </ClearButton>
          )}
        </SearchBoxWrapper>
      </SearchContainer>

      <AvailableList>
        <SortableContext
          items={filteredContentTypes.map((ct) => `available-${ct.singularName}`)}
          strategy={verticalListSortingStrategy}
        >
          {filteredContentTypes.map((ct) => (
            <AvailableTypeRow
              key={ct.uid}
              ct={ct}
              assignedGroup={assignedMap.get(ct.singularName) || null}
            />
          ))}
        </SortableContext>
      </AvailableList>

      <LeftPanelFooter>
        <DragInstructionBox>
          <Typography textColor="neutral500" variant="pi">
            Drag items to groups on the right
          </Typography>
          <InfoIcon>i</InfoIcon>
        </DragInstructionBox>
      </LeftPanelFooter>
    </LeftPanelContainer>
  );
}
