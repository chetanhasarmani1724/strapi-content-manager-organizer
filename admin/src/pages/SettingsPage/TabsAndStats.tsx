import { useIntl } from 'react-intl';
import { Flex, Typography } from '@strapi/design-system';
import { TabsBar, TabBtn, TypeIconWrapper, StatCard, StatLabel, StatNumber, NeumorphicToggleTrack, NeumorphicToggleThumb } from './styles';
import { CubeIcon, DocumentIcon } from './icons';
import { getTrad } from '../../utils/getTrad';

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
  const { formatMessage } = useIntl();
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
          {formatMessage({ id: getTrad('tabs.collectionTypes'), defaultMessage: 'Collection Types' })}
        </TabBtn>
        <TabBtn
          $active={activeTab === 'singleType'}
          onClick={() => setActiveTab('singleType')}
        >
          <TypeIconWrapper $active={activeTab === 'singleType'}>
            <DocumentIcon />
          </TypeIconWrapper>
          {formatMessage({ id: getTrad('tabs.singleTypes'), defaultMessage: 'Single Types' })}
        </TabBtn>
      </Flex>
      <Flex gap={5}>
        <Flex gap={3} alignItems="center" style={{ paddingRight: '16px', borderRight: '1px solid #eaeaef' }}>
          <Typography variant="sigma" textColor="neutral600">
            {formatMessage({ id: getTrad('sort.label'), defaultMessage: 'SORT ORDER' })}
          </Typography>
          <Flex gap={2} alignItems="center">
            <Typography variant="pi" textColor={!isCustom ? 'primary600' : 'neutral500'} fontWeight="bold">
              {formatMessage({ id: getTrad('sort.alphabetical'), defaultMessage: 'Alphabetical' })}
            </Typography>
            <NeumorphicToggleTrack $checked={isCustom} onClick={() => onChangeSortBy(isCustom ? 'alphabetical' : 'custom')}>
              <NeumorphicToggleThumb $checked={isCustom} />
            </NeumorphicToggleTrack>
            <Typography variant="pi" textColor={isCustom ? 'primary600' : 'neutral500'} fontWeight="bold">
              {formatMessage({ id: getTrad('sort.custom'), defaultMessage: 'Custom Order' })}
            </Typography>
          </Flex>
        </Flex>

        <Flex gap={3}>
          <StatCard>
            <StatLabel>{formatMessage({ id: getTrad('stats.total'), defaultMessage: 'Total' })}</StatLabel>
            <StatNumber>{stats.total}</StatNumber>
          </StatCard>
          <StatCard>
            <StatLabel>{formatMessage({ id: getTrad('stats.grouped'), defaultMessage: 'Grouped' })}</StatLabel>
            <StatNumber>{stats.grouped}</StatNumber>
          </StatCard>
          <StatCard>
            <StatLabel>{formatMessage({ id: getTrad('stats.ungrouped'), defaultMessage: 'Ungrouped' })}</StatLabel>
            <StatNumber>{stats.ungrouped}</StatNumber>
          </StatCard>
        </Flex>
      </Flex>
    </TabsBar>
  );
}
