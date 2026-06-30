import { useState, useRef, useEffect } from 'react';
import { Flex, Typography } from '@strapi/design-system';
import { IconButton } from '@strapi/design-system';
import { Trash, More, Pencil, Drag } from '@strapi/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MenuGroup } from '../../types';
import { FolderIconSmallBlue, ChevronSvg, TypeIcon, EmptyGroupSvg } from './icons';
import {
  GroupCardWrapper,
  GroupCardHeader,
  GroupIcon,
  GroupBadge,
  OverflowMenuWrapper,
  OverflowMenu,
  OverflowMenuItem,
  CollapseButton,
  GroupItemsArea,
  EmptyGroupArea,
  EmptyGroupText,
  EmptyGroupSubText,
  ItemRow,
  DragHandle,
  TypeIconWrapper,
} from './styles';

/* ── Sortable Item (inside a group) ── */
export function SortableGroupItem({
  id,
  label,
  kind,
  onRemove,
}: {
  id: string;
  label: string;
  kind: 'collectionType' | 'singleType';
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <ItemRow ref={setNodeRef} style={style}>
      <Flex alignItems="center" gap={3}>
        <DragHandle {...attributes} {...listeners}>
          <Drag />
        </DragHandle>
        <TypeIconWrapper>
          <TypeIcon kind={kind} />
        </TypeIconWrapper>
        <Typography textColor="neutral800" fontWeight="bold">
          {label}
        </Typography>
      </Flex>
      <IconButton label="Remove" withTooltip={false} onClick={onRemove} variant="ghost">
        <Trash />
      </IconButton>
    </ItemRow>
  );
}

/* ── Sortable Group Card ── */
interface SortableGroupCardProps {
  group: MenuGroup;
  groupIndex: number;
  getLabel: (name: string) => string;
  getKind: (name: string) => 'collectionType' | 'singleType';
  onRemoveItem: (groupId: string, itemIndex: number) => void;
  onDeleteGroup: (groupId: string) => void;
  onRenameGroup: (groupId: string) => void;
}

export function SortableGroupCard({
  group,
  groupIndex,
  getLabel,
  getKind,
  onRemoveItem,
  onDeleteGroup,
  onRenameGroup,
}: SortableGroupCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `group-${group.id}`,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <GroupCardWrapper ref={setNodeRef} style={style}>
      <GroupCardHeader>
        <Flex alignItems="center" gap={3} style={{ flex: 1 }}>
          <DragHandle {...attributes} {...listeners}>
            <Drag />
          </DragHandle>
          <GroupIcon>
            <FolderIconSmallBlue />
          </GroupIcon>
          <Typography fontWeight="bold" textColor="neutral800">
            {group.label}
          </Typography>
          <GroupBadge>
            {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
          </GroupBadge>
        </Flex>
        <Flex alignItems="center" gap={1}>
          <OverflowMenuWrapper ref={menuRef}>
            <IconButton
              label="Actions"
              withTooltip={false}
              variant="ghost"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <More />
            </IconButton>
            {menuOpen && (
              <OverflowMenu>
                <OverflowMenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    onRenameGroup(group.id);
                  }}
                >
                  <Pencil /> Rename
                </OverflowMenuItem>
                <OverflowMenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    onDeleteGroup(group.id);
                  }}
                  $danger
                >
                  <Trash /> Delete
                </OverflowMenuItem>
              </OverflowMenu>
            )}
          </OverflowMenuWrapper>
          <CollapseButton onClick={() => setCollapsed(!collapsed)} $collapsed={collapsed}>
            <ChevronSvg />
          </CollapseButton>
        </Flex>
      </GroupCardHeader>

      {!collapsed && (
        <GroupItemsArea>
          {group.items.length === 0 ? (
            <EmptyGroupArea>
              <EmptyGroupSvg />
              <EmptyGroupText>Drop {group.kind === 'singleType' ? 'single' : 'collection'} types here</EmptyGroupText>
              <EmptyGroupSubText>or drag from the left panel</EmptyGroupSubText>
            </EmptyGroupArea>
          ) : (
            <SortableContext items={group.items} strategy={verticalListSortingStrategy}>
              {group.items.map((item, itemIndex) => (
                <SortableGroupItem
                  key={item}
                  id={item}
                  label={getLabel(item)}
                  kind={getKind(item)}
                  onRemove={() => onRemoveItem(group.id, itemIndex)}
                />
              ))}
            </SortableContext>
          )}
        </GroupItemsArea>
      )}
    </GroupCardWrapper>
  );
}
