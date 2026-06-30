import styled from 'styled-components';

export const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
`;

export const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary100};
  border-radius: 8px;
`;

export const TabsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
`;

export const TabBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-bottom: 2px solid ${({ $active, theme }) => ($active ? theme.colors.primary600 : 'transparent')};
  background: transparent;
  color: ${({ $active, theme }) => ($active ? theme.colors.primary600 : theme.colors.neutral500)};
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary600};
  }
`;

export const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 24px;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: ${({ theme }) => theme.colors.neutral0};
  min-width: 90px;
`;

export const StatNumber = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral800};
`;

export const StatLabel = styled.span`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.neutral500};
  margin-bottom: 2px;
`;

export const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
  padding: 32px;
  background: ${({ theme }) => theme.colors.neutral100};
  min-height: calc(100vh - 180px);
  align-items: start;
`;

export const LeftPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 4px;
  box-shadow: ${({ theme }) => theme.shadows.filterShadow};
  max-height: calc(100vh - 240px);
  position: sticky;
  top: 32px;
`;

export const RightPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.neutral100};
  padding: 24px 32px;
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px 16px 20px;
`;

export const CountBadge = styled.span`
  background: ${({ theme }) => theme.colors.neutral150};
  color: ${({ theme }) => theme.colors.neutral600};
  font-size: 1.1rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
`;

export const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 20px 16px;
`;

export const SearchBoxWrapper = styled.div`
  position: relative;
  flex: 1;
`;

export const SearchIconWrapper = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.neutral500};
  display: flex;
  align-items: center;
  svg { width: 14px; height: 14px; }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 34px;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 4px;
  font-size: 1.3rem;
  background: ${({ theme }) => theme.colors.neutral0};
  color: ${({ theme }) => theme.colors.neutral800};

  &::placeholder { color: ${({ theme }) => theme.colors.neutral400}; }
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary600}; }
`;

export const FilterIconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.neutral500};
  cursor: pointer;
  svg { width: 14px; height: 14px; }
  &:hover { background: ${({ theme }) => theme.colors.neutral100}; }
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral400};
  display: flex;
  align-items: center;
  padding: 2px;
  svg { width: 10px; height: 10px; }
  &:hover { color: ${({ theme }) => theme.colors.neutral600}; }
`;

export const AvailableList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
`;

export const AvailableItem = styled.div<{ $assigned?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral150};
  transition: opacity 0.15s ease;
`;

export const TypeIconWrapper = styled.div<{ $active?: boolean, $assigned?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active, $assigned, theme }) => $assigned ? theme.colors.neutral400 : $active ? theme.colors.primary600 : theme.colors.primary500};
  svg { width: 16px; height: 16px; }
`;

export const CheckIconWrapper = styled.div`
  color: ${({ theme }) => theme.colors.success500};
  svg { width: 16px; height: 16px; }
`;

export const DragHandle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: grab;
  color: ${({ theme }) => theme.colors.neutral400};
  padding: 0;
  &:hover { color: ${({ theme }) => theme.colors.neutral600}; }
  &:active { cursor: grabbing; }
  svg { width: 12px; height: 12px; }
`;

export const AssignedHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.neutral300};
  svg { width: 12px; height: 12px; }
`;

export const LeftPanelFooter = styled.div`
  padding: 20px;
`;

export const DragInstructionBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.neutral100};
  border-radius: 4px;
  padding: 12px;
`;

export const InfoIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: 1px solid ${({ theme }) => theme.colors.neutral500};
  border-radius: 50%;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.neutral500};
  font-weight: bold;
`;

export const GroupsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const GroupCardWrapper = styled.div`
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 8px;
`;

export const GroupCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.neutral0};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral150};
  border-radius: 7px 7px 0 0;
`;

export const GroupIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary500};
  svg { width: 16px; height: 16px; }
`;

export const GroupBadge = styled.span`
  font-size: 1.1rem;
  background: ${({ theme }) => theme.colors.neutral200};
  color: ${({ theme }) => theme.colors.neutral600};
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
`;

export const CollapseButton = styled.button<{ $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral500};
  padding: 4px;
  border-radius: 4px;
  transition: transform 0.2s ease;
  transform: ${({ $collapsed }) => ($collapsed ? 'rotate(-90deg)' : 'rotate(0)')};
  &:hover { background: ${({ theme }) => theme.colors.neutral150}; }
`;

export const OverflowMenuWrapper = styled.div`
  position: relative;
`;

export const OverflowMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 999;
  min-width: 140px;
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const OverflowMenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: transparent;
  font-size: 1.3rem;
  cursor: pointer;
  color: ${({ $danger, theme }) => ($danger ? theme.colors.danger600 : theme.colors.neutral800)};
  text-align: left;
  &:hover { background: ${({ $danger, theme }) => ($danger ? theme.colors.danger100 : theme.colors.neutral100)}; }
  svg { width: 14px; height: 14px; }
`;

export const GroupItemsArea = styled.div`
  padding: 8px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const EmptyGroupArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px dashed ${({ theme }) => theme.colors.neutral200};
  border-radius: 4px;
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.neutral500};
  svg {
    width: 24px;
    height: 24px;
    margin-bottom: 12px;
    path {
      fill: ${({ theme }) => theme.colors.neutral400};
    }
  }
`;

export const EmptyGroupText = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral600};
  margin-bottom: 4px;
`;

export const EmptyGroupSubText = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.neutral500};
`;

export const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral150};
  background: ${({ theme }) => theme.colors.neutral0};
  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.neutral100}; }
`;

export const UnsavedBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.warning100};
  color: ${({ theme }) => theme.colors.warning600};
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.warning200};
`;

export const UnsavedDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.warning600};
`;

export const ErrorBanner = styled.div`
  margin: 0 32px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.danger100};
  border: 1px solid ${({ theme }) => theme.colors.danger200};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.danger700};
  font-size: 1.3rem;
`;

export const DragOverlayCard = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  font-size: 1.3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral800};
  svg { width: 14px; height: 14px; color: ${({ theme }) => theme.colors.neutral400}; }
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 4px;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.neutral800};
  background: ${({ theme }) => theme.colors.neutral0};

  &::placeholder { color: ${({ theme }) => theme.colors.neutral400}; }
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary600}; box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary100}; }
`;

export const EmptyGroupsState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px dashed ${({ theme }) => theme.colors.neutral300};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.neutral500};
`;

export const NeumorphicToggleTrack = styled.div<{ $checked: boolean }>`
  position: relative;
  width: 52px;
  height: 28px;
  border-radius: 14px;
  background: ${({ $checked, theme }) => $checked ? theme.colors.primary600 : theme.colors.neutral150};
  box-shadow: ${({ $checked, theme }) => $checked
    ? `inset 2px 2px 4px ${theme.colors.primary700}, inset -2px -2px 4px ${theme.colors.primary500}`
    : `inset 2px 2px 4px ${theme.colors.neutral200}, inset -2px -2px 4px ${theme.colors.neutral100}`};
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
`;

export const NeumorphicToggleThumb = styled.div<{ $checked: boolean }>`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutral0};
  box-shadow: 2px 2px 4px ${({ theme }) => theme.colors.neutral200},
              -1px -1px 2px ${({ theme }) => theme.colors.neutral0};
  transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  transform: ${({ $checked }) => ($checked ? 'translateX(24px)' : 'translateX(0)')};
`;
