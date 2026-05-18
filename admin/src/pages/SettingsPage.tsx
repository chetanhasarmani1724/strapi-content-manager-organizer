import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  Flex,
  IconButton,
  Main,
  SingleSelect,
  SingleSelectOption,
  Typography,
} from '@strapi/design-system';
import { Layouts, useNotification, Page as PageHelper } from '@strapi/admin/strapi-admin';
import { ArrowUp, ArrowDown, Trash } from '@strapi/icons';
import styled from 'styled-components';
import { fetchMenuConfig, fetchMenuContentTypes, saveMenuConfig } from '../api';
import type { MenuContentTypeOption, MenuGroup, MenuOrganizerConfig } from '../types';

const eventName = 'cmo:config-updated';

function createGroupId(label: string, groups: MenuGroup[]) {
  const base = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'group';
  const existing = new Set(groups.map((group) => group.id));
  let id = base;
  let index = 2;

  while (existing.has(id)) {
    id = `${base}-${index}`;
    index += 1;
  }

  return id;
}

function move<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items;

  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);

  return next;
}

function cleanConfig(config: MenuOrganizerConfig): MenuOrganizerConfig {
  const seen = new Set<string>();

  return {
    stripNumericPrefix: config.stripNumericPrefix,
    groups: config.groups.map((group) => ({
      ...group,
      label: group.label.trim() || 'Group',
      items: group.items.filter((item) => {
        if (seen.has(item)) return false;
        seen.add(item);
        return true;
      }),
    })),
  };
}

export default function SettingsPage() {
  const [config, setConfig] = useState<MenuOrganizerConfig | null>(null);
  const [contentTypes, setContentTypes] = useState<MenuContentTypeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { toggleNotification } = useNotification();
  const savedConfigRef = useRef<string>('');
  const scrollToNewGroupRef = useRef(false);
  const lastGroupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([fetchMenuConfig(), fetchMenuContentTypes()])
      .then(([nextConfig, nextContentTypes]) => {
        if (!mounted) return;
        const cleaned = cleanConfig(nextConfig);
        setConfig(cleaned);
        savedConfigRef.current = JSON.stringify(cleaned);
        setContentTypes(nextContentTypes);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || 'Unable to load Content Manager Organizer settings');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const assignedItems = useMemo(() => {
    const values = new Set<string>();
    config?.groups.forEach((group) => group.items.forEach((item) => values.add(item)));
    return values;
  }, [config]);

  const ungroupedContentTypes = useMemo(
    () => contentTypes.filter((contentType) => !assignedItems.has(contentType.singularName)),
    [assignedItems, contentTypes]
  );

  const hasChanges = useMemo(
    () => config !== null && JSON.stringify(config) !== savedConfigRef.current,
    [config]
  );

  const updateConfig = (updater: (current: MenuOrganizerConfig) => MenuOrganizerConfig) => {
    setConfig((current) => (current ? updater(current) : current));
  };

  const updateGroup = (groupIndex: number, updater: (group: MenuGroup) => MenuGroup) => {
    updateConfig((current) => ({
      ...current,
      groups: current.groups.map((group, index) => (index === groupIndex ? updater(group) : group)),
    }));
  };

  const addGroup = () => {
    updateConfig((current) => {
      const label = 'New Group';

      return {
        ...current,
        groups: [
          ...current.groups,
          {
            id: createGroupId(label, current.groups),
            label,
            defaultExpanded: false,
            items: [],
          },
        ],
      };
    });
    scrollToNewGroupRef.current = true;
  };

  useEffect(() => {
    if (scrollToNewGroupRef.current && lastGroupRef.current) {
      lastGroupRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      scrollToNewGroupRef.current = false;
    }
  });

  const removeGroup = (groupIndex: number) => {
    updateConfig((current) => ({
      ...current,
      groups: current.groups.filter((_, index) => index !== groupIndex),
    }));
  };

  const addItemToGroup = (groupIndex: number, singularName: string) => {
    if (!singularName) return;

    updateGroup(groupIndex, (group) => ({
      ...group,
      items: group.items.includes(singularName) ? group.items : [...group.items, singularName],
    }));
  };

  const removeItemFromGroup = (groupIndex: number, itemIndex: number) => {
    updateGroup(groupIndex, (group) => ({
      ...group,
      items: group.items.filter((_, index) => index !== itemIndex),
    }));
  };

  const moveGroup = (groupIndex: number, direction: -1 | 1) => {
    updateConfig((current) => ({
      ...current,
      groups: move(current.groups, groupIndex, groupIndex + direction),
    }));
  };

  const moveItem = (groupIndex: number, itemIndex: number, direction: -1 | 1) => {
    updateGroup(groupIndex, (group) => ({
      ...group,
      items: move(group.items, itemIndex, itemIndex + direction),
    }));
  };

  const save = async () => {
    if (!config) return;

    setSaving(true);
    setError('');

    try {
      const saved = await saveMenuConfig(cleanConfig(config));
      setConfig(saved);
      savedConfigRef.current = JSON.stringify(saved);
      window.dispatchEvent(new CustomEvent(eventName, { detail: saved }));
      toggleNotification({
        type: 'success',
        title: 'Saved',
        message: 'Content Manager Organizer settings saved successfully',
      });
    } catch (err: any) {
      const message = err?.message || 'Unable to save Content Manager Organizer settings';
      setError(message);
      toggleNotification({
        type: 'danger',
        title: 'Error',
        message,
      });
    } finally {
      setSaving(false);
    }
  };

  const getContentTypeLabel = (singularName: string) => {
    const contentType = contentTypes.find((item) => item.singularName === singularName);
    return contentType?.cleanDisplayName || singularName;
  };

  if (loading) {
    return (
      <Main>
        <PageHelper.Loading />
      </Main>
    );
  }

  if (!config) {
    return (
      <Main>
        <PageHelper.Error />
      </Main>
    );
  }

  return (
    <Main>
      <Layouts.Header
        title="Content Manager Organizer"
        subtitle="Configure Content Manager collection type groups."
        primaryAction={
          <Flex gap={2}>
            <Button variant="secondary" onClick={addGroup}>
              Add group
            </Button>
            <Button onClick={save} loading={saving} disabled={!hasChanges}>
              Save
            </Button>
          </Flex>
        }
      />

      <ContentArea>
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}

        <Flex gap={2} alignItems="center">
          <Checkbox
            checked={config.stripNumericPrefix}
            onCheckedChange={(checked) =>
              updateConfig((current) => ({
                ...current,
                stripNumericPrefix: checked === true,
              }))
            }
          />
          <Typography textColor="neutral800">Strip numeric prefixes</Typography>
        </Flex>

        <TwoColumnLayout>
          <GroupsColumn>
            {config.groups.map((group, groupIndex) => (
              <GroupCard
                key={group.id}
                ref={groupIndex === config.groups.length - 1 ? lastGroupRef : undefined}
              >
                <GroupCardHeader>
                  <GroupTitleInput
                    value={group.label}
                    aria-label="Group label"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      updateGroup(groupIndex, (current) => ({
                        ...current,
                        label: event.target.value,
                      }))
                    }
                  />
                  <Flex gap={1} alignItems="center">
                    <IconButton
                      label="Move up"
                      withTooltip={false}
                      disabled={groupIndex === 0}
                      onClick={() => moveGroup(groupIndex, -1)}
                      variant="ghost"
                    >
                      <ArrowUp />
                    </IconButton>
                    <IconButton
                      label="Move down"
                      withTooltip={false}
                      disabled={groupIndex === config.groups.length - 1}
                      onClick={() => moveGroup(groupIndex, 1)}
                      variant="ghost"
                    >
                      <ArrowDown />
                    </IconButton>
                    <IconButton
                      label="Remove group"
                      withTooltip={false}
                      onClick={() => removeGroup(groupIndex)}
                      variant="ghost"
                    >
                      <Trash />
                    </IconButton>
                  </Flex>
                </GroupCardHeader>

                <Flex gap={2} alignItems="center">
                  <Checkbox
                    checked={group.defaultExpanded}
                    onCheckedChange={(checked) =>
                      updateGroup(groupIndex, (current) => ({
                        ...current,
                        defaultExpanded: checked === true,
                      }))
                    }
                  />
                  <Typography textColor="neutral600" variant="pi">
                    Expanded by default
                  </Typography>
                </Flex>

                <ItemsContainer>
                  {group.items.map((item, itemIndex) => (
                    <ItemRow key={item}>
                      <Typography textColor="neutral800">{getContentTypeLabel(item)}</Typography>
                      <Flex gap={1} alignItems="center">
                        <IconButton
                          label="Move up"
                          withTooltip={false}
                          disabled={itemIndex === 0}
                          onClick={() => moveItem(groupIndex, itemIndex, -1)}
                          variant="ghost"
                        >
                          <ArrowUp />
                        </IconButton>
                        <IconButton
                          label="Move down"
                          withTooltip={false}
                          disabled={itemIndex === group.items.length - 1}
                          onClick={() => moveItem(groupIndex, itemIndex, 1)}
                          variant="ghost"
                        >
                          <ArrowDown />
                        </IconButton>
                        <IconButton
                          label="Remove item"
                          withTooltip={false}
                          onClick={() => removeItemFromGroup(groupIndex, itemIndex)}
                          variant="ghost"
                        >
                          <Trash />
                        </IconButton>
                      </Flex>
                    </ItemRow>
                  ))}
                  {group.items.length === 0 ? (
                    <EmptyState>No content types assigned</EmptyState>
                  ) : null}
                </ItemsContainer>

                <SingleSelect
                  value={null}
                  onChange={(value) => addItemToGroup(groupIndex, String(value))}
                  placeholder="Add content type"
                  aria-label={`Add content type to ${group.label}`}
                >
                  {ungroupedContentTypes.map((contentType) => (
                    <SingleSelectOption key={contentType.uid} value={contentType.singularName}>
                      {contentType.cleanDisplayName}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </GroupCard>
            ))}
          </GroupsColumn>

          <SidebarColumn>
            <SidebarCard>
              <Typography variant="delta" textColor="neutral800">
                Ungrouped
              </Typography>
              <SidebarItemList>
                {ungroupedContentTypes.map((contentType) => (
                  <SidebarItem key={contentType.uid}>
                    <Typography textColor="neutral800">{contentType.cleanDisplayName}</Typography>
                  </SidebarItem>
                ))}
                {ungroupedContentTypes.length === 0 ? (
                  <EmptyState>All collection types are assigned</EmptyState>
                ) : null}
              </SidebarItemList>
            </SidebarCard>
          </SidebarColumn>
        </TwoColumnLayout>
      </ContentArea>
    </Main>
  );
}

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaces[6]};
  padding: ${({ theme }) => `${theme.spaces[6]} ${theme.spaces[8]}`};
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: ${({ theme }) => theme.spaces[6]};
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const GroupsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaces[4]};
`;

const GroupCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaces[4]};
  border: 1px solid ${({ theme }) => theme.colors.neutral150};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.neutral0};
  padding: ${({ theme }) => theme.spaces[5]};
`;

const GroupCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaces[4]};
  align-items: center;
`;

const GroupTitleInput = styled.input`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => `${theme.spaces[2]} ${theme.spaces[3]}`};
  color: ${({ theme }) => theme.colors.neutral800};
  background: ${({ theme }) => theme.colors.neutral0};
  font-size: ${({ theme }) => theme.fontSizes[2]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  &:hover {
    border-color: ${({ theme }) => theme.colors.neutral300};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary600};
    box-shadow: ${({ theme }) => theme.colors.primary600} 0 0 0 2px;
  }
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaces[2]};
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaces[3]};
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.neutral150};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => `${theme.spaces[2]} ${theme.spaces[3]}`};
  background: ${({ theme }) => theme.colors.neutral0};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }
`;

const EmptyState = styled.div`
  color: ${({ theme }) => theme.colors.neutral500};
  font-size: ${({ theme }) => theme.fontSizes[1]};
  padding: ${({ theme }) => theme.spaces[3]};
  text-align: center;
  font-style: italic;
`;

const ErrorMessage = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.danger600};
  background: ${({ theme }) => theme.colors.danger100};
  color: ${({ theme }) => theme.colors.danger700};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spaces[3]};
  font-size: ${({ theme }) => theme.fontSizes[2]};
`;

const SidebarColumn = styled.div`
  position: sticky;
  top: ${({ theme }) => theme.spaces[6]};
`;

const SidebarCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaces[4]};
  border: 1px solid ${({ theme }) => theme.colors.neutral150};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.neutral0};
  padding: ${({ theme }) => theme.spaces[5]};
`;

const SidebarItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaces[2]};
  max-height: 400px;
  overflow-y: auto;
`;

const SidebarItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral150};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => `${theme.spaces[2]} ${theme.spaces[3]}`};
  background: ${({ theme }) => theme.colors.neutral0};
`;
