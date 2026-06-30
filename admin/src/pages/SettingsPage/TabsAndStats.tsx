import { Flex, Typography } from '@strapi/design-system';
import { TabsBar, TabBtn, TypeIconWrapper, StatCard, StatLabel, StatNumber, NeumorphicToggleTrack, NeumorphicToggleThumb } from './styles';
import { CubeIcon, DocumentIcon } from './icons';

interface TabsAndStatsProps {
  activeTab: 'collectionType' | 'singleType';
  setActiveTab: (tab: 'collectionType' | 'singleType') => void;
  sortBy: 'alphabetical' | 'custom';
  onChangeSortBy: (sortBy: 'alphabetical' | 'custom') => void;
  stats: {
    total: number;
    grouped: number;
    ungrouped: number;
  };
}

export function TabsAndStats({ activeTab, setActiveTab, sortBy, onChangeSortBy, stats }: TabsAndStatsProps) {
  const isCustom = sortBy === 'custom';

  return (
    <TabsBar>
      <Flex gap={4}>
        <TabBtn
          $active={activeTab === 'collectionType'}
          onClick={() => setActiveTab('collectionType')}
        >
          <TypeIconWrapper $active={activeTab === 'collectionType'}>
            <CubeIcon />
          </TypeIconWrapper>
          Collection Types
        </TabBtn>
        <TabBtn
          $active={activeTab === 'singleType'}
          onClick={() => setActiveTab('singleType')}
        >
          <TypeIconWrapper $active={activeTab === 'singleType'}>
            <DocumentIcon />
          </TypeIconWrapper>
          Single Types
        </TabBtn>
      </Flex>
      <Flex gap={5}>
        <Flex gap={3} alignItems="center" style={{ paddingRight: '16px', borderRight: '1px solid #eaeaef' }}>
          <Typography variant="sigma" textColor="neutral600">
            SORT ORDER
          </Typography>
          <Flex gap={2} alignItems="center">
            <Typography variant="pi" textColor={!isCustom ? 'primary600' : 'neutral500'} fontWeight="bold">
              Alphabetical
            </Typography>
            <NeumorphicToggleTrack $checked={isCustom} onClick={() => onChangeSortBy(isCustom ? 'alphabetical' : 'custom')}>
              <NeumorphicToggleThumb $checked={isCustom} />
            </NeumorphicToggleTrack>
            <Typography variant="pi" textColor={isCustom ? 'primary600' : 'neutral500'} fontWeight="bold">
              Custom Order
            </Typography>
          </Flex>
        </Flex>

        <Flex gap={3}>
          <StatCard>
            <StatLabel>Total</StatLabel>
            <StatNumber>{stats.total}</StatNumber>
          </StatCard>
          <StatCard>
            <StatLabel>Grouped</StatLabel>
            <StatNumber>{stats.grouped}</StatNumber>
          </StatCard>
          <StatCard>
            <StatLabel>Ungrouped</StatLabel>
            <StatNumber>{stats.ungrouped}</StatNumber>
          </StatCard>
        </Flex>
      </Flex>
    </TabsBar>
  );
}
