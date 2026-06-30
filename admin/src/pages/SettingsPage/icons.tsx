import { Folder } from '@strapi/icons';

export const CubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);

export const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

export const TypeIcon = ({ kind }: { kind: 'collectionType' | 'singleType' }) => {
  return kind === 'collectionType' ? <CubeIcon /> : <DocumentIcon />;
};

export function ChevronSvg() {
  return (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M14 .889a.86.86 0 0 1-.26.625l-6 5.778a.92.92 0 0 1-.65.264.92.92 0 0 1-.65-.264l-6-5.778A.86.86 0 0 1 .18.89c0-.24.1-.451.26-.625A.92.92 0 0 1 1.09 0a.92.92 0 0 1 .65.264L7.09 5.42 12.44.264A.92.92 0 0 1 13.09 0a.92.92 0 0 1 .65.264.86.86 0 0 1 .26.625Z" fill="currentColor" />
    </svg>
  );
}

export const FolderIconBlue = () => (
  <Folder style={{ width: 24, height: 24, color: '#4945ff' }} />
);

export const FolderIconSmallBlue = () => (
  <Folder style={{ width: 18, height: 18, color: '#4945ff' }} />
);

export const EmptyGroupSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 9H19L17.5 19H6.5L5 9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="4 4"
    />
    <path
      d="M8 9V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="4 4"
    />
  </svg>
);
